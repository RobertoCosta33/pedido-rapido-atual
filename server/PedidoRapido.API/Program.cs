using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PedidoRapido.Application;
using PedidoRapido.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// =============================================================================
// Configuração de Variáveis de Ambiente
// =============================================================================

// Sobrescrever configurações com variáveis de ambiente
var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection") 
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

var jwtSecret = Environment.GetEnvironmentVariable("Jwt__Secret") 
    ?? builder.Configuration["JwtSettings:Secret"] 
    ?? throw new InvalidOperationException("JWT Secret não configurado");

var jwtIssuer = Environment.GetEnvironmentVariable("Jwt__Issuer") 
    ?? builder.Configuration["JwtSettings:Issuer"] 
    ?? "PedidoRapido.API";

var jwtAudience = Environment.GetEnvironmentVariable("Jwt__Audience") 
    ?? builder.Configuration["JwtSettings:Audience"] 
    ?? "PedidoRapido.Frontend";

// Stripe
var stripeSecretKey = Environment.GetEnvironmentVariable("Stripe__SecretKey") 
    ?? builder.Configuration["Stripe:SecretKey"];

var stripeWebhookSecret = Environment.GetEnvironmentVariable("Stripe__WebhookSecret") 
    ?? builder.Configuration["Stripe:WebhookSecret"];

var stripePublicKey = Environment.GetEnvironmentVariable("Stripe__PublicKey") 
    ?? builder.Configuration["Stripe:PublishableKey"];

// CORS Origins
var corsOrigins = Environment.GetEnvironmentVariable("CORS__AllowedOrigins")?.Split(',') 
    ?? builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
    ?? new[] { "http://localhost:3000" };

// Atualizar configuração
if (!string.IsNullOrEmpty(connectionString))
    builder.Configuration["ConnectionStrings:DefaultConnection"] = connectionString;

if (!string.IsNullOrEmpty(stripeSecretKey))
    builder.Configuration["Stripe:SecretKey"] = stripeSecretKey;

if (!string.IsNullOrEmpty(stripeWebhookSecret))
    builder.Configuration["Stripe:WebhookSecret"] = stripeWebhookSecret;

if (!string.IsNullOrEmpty(stripePublicKey))
    builder.Configuration["Stripe:PublishableKey"] = stripePublicKey;

// =============================================================================
// Configuração de Serviços
// =============================================================================

// Controllers com configuração JSON
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Serializar enums como strings
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        // Ignorar nulos
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// =============================================================================
// Health Checks
// =============================================================================

builder.Services.AddHealthChecks()
    .AddNpgSql(connectionString ?? "Server=localhost;Database=pedido_rapido;", name: "postgresql")
    .AddCheck("self", () => Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Healthy());

// =============================================================================
// Configuração JWT Authentication
// =============================================================================

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero // Sem tolerância de tempo
    };

    // Eventos apenas em desenvolvimento
    if (builder.Environment.IsDevelopment())
    {
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"[JWT] Autenticação falhou: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                var userId = context.Principal?.FindFirst("userId")?.Value;
                Console.WriteLine($"[JWT] Token validado para usuário: {userId}");
                return Task.CompletedTask;
            }
        };
    }
});

builder.Services.AddAuthorization(options =>
{
    // Policy para Super Admin
    options.AddPolicy("SuperAdmin", policy =>
        policy.RequireClaim("role", "SuperAdmin"));

    // Policy para Admin (Admin ou SuperAdmin)
    options.AddPolicy("Admin", policy =>
        policy.RequireClaim("role", "Admin", "SuperAdmin"));

    // Policy para usuários autenticados
    options.AddPolicy("Authenticated", policy =>
        policy.RequireAuthenticatedUser());
});

// =============================================================================
// Swagger / OpenAPI (apenas em desenvolvimento)
// =============================================================================

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "Pedido Rápido API",
            Version = "v1",
            Description = "API do sistema Pedido Rápido - Gestão de quiosques, cardápios e avaliações",
            Contact = new OpenApiContact
            {
                Name = "Pedido Rápido",
                Email = "contato@pedidorapido.com"
            }
        });

        // Configuração de autenticação JWT no Swagger
        options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Insira o token JWT no formato: Bearer {seu_token}"
        });

        options.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });

        // Incluir comentários XML
        var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
        var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
        if (File.Exists(xmlPath))
        {
            options.IncludeXmlComments(xmlPath);
        }
    });
}

// =============================================================================
// CORS - Configuração dinâmica baseada no ambiente
// =============================================================================

builder.Services.AddCors(options =>
{
    if (builder.Environment.IsDevelopment())
    {
        // Desenvolvimento: mais permissivo
        options.AddPolicy("AllowFrontend", policy =>
        {
            policy.WithOrigins(
                "http://localhost:3000",
                "http://localhost:3001",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:3001"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
        });
    }
    else
    {
        // Produção: apenas origens específicas
        options.AddPolicy("AllowFrontend", policy =>
        {
            policy.WithOrigins(corsOrigins)
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        });
    }
});

// =============================================================================
// Injeção de Dependências (Clean Architecture)
// =============================================================================

// Camada Infrastructure (repositórios EF Core + PostgreSQL ou InMemory)
builder.Services.AddInfrastructure(builder.Configuration);

// Camada Application (serviços de negócio)
builder.Services.AddApplication();

// =============================================================================
// Build e Configuração do Pipeline
// =============================================================================

var app = builder.Build();

// Swagger (apenas em desenvolvimento)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Pedido Rápido API v1");
        options.RoutePrefix = string.Empty; // Swagger na raiz
        options.DocumentTitle = "Pedido Rápido API";
    });
}

// Middleware de tratamento de erros
app.UseExceptionHandler("/error");

// CORS
app.UseCors("AllowFrontend");

// HTTPS Redirection (apenas em produção)
if (app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}

// Autenticação e Autorização
app.UseAuthentication();
app.UseAuthorization();

// Health Checks
app.MapHealthChecks("/health", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        var response = new
        {
            status = report.Status.ToString(),
            environment = app.Environment.EnvironmentName,
            timestamp = DateTime.UtcNow,
            version = "1.0.0",
            checks = report.Entries.Select(x => new
            {
                name = x.Key,
                status = x.Value.Status.ToString(),
                duration = x.Value.Duration.TotalMilliseconds
            })
        };
        await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(response));
    }
});

// Mapear controllers
app.MapControllers();

// Endpoint de erro
app.Map("/error", (HttpContext context) =>
{
    return Results.Problem(
        title: "Ocorreu um erro interno",
        statusCode: StatusCodes.Status500InternalServerError
    );
});

// =============================================================================
// Inicialização do Banco de Dados (Migrations + Seed)
// =============================================================================

if (app.Environment.IsProduction())
{
    Console.WriteLine("🚀 Iniciando aplicação em modo PRODUÇÃO...");
    Console.WriteLine($"🔗 CORS configurado para: {string.Join(", ", corsOrigins)}");
}
else
{
    Console.WriteLine(@"
╔═══════════════════════════════════════════════════════════════╗
║           🍽️  PEDIDO RÁPIDO API - v1.0.0  🍽️                ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Swagger UI: http://localhost:5000                            ║
║  API Base:   http://localhost:5000/api                        ║
║                                                               ║
║  🔐 AUTENTICAÇÃO JWT ATIVADA                                  ║
║  🗄️  POSTGRESQL + ENTITY FRAMEWORK CORE                      ║
║                                                               ║
║  Usuários de teste:                                           ║
║  • admin@pedidorapido.com (SuperAdmin) - senha: 123456        ║
║                                                               ║
║  Endpoints públicos:                                          ║
║  • POST /api/auth/login     - Fazer login                     ║
║  • GET  /api/ranking/*      - Rankings públicos               ║
║  • GET  /health             - Health check                    ║
║                                                               ║
║  Endpoints protegidos (requer token):                         ║
║  • GET /api/auth/me         - Dados do usuário                ║
║  • GET /api/kiosks          - Listar quiosques                ║
║  • GET /api/employees       - Listar funcionários             ║
║  • GET /api/menuitems       - Listar cardápio                 ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
");
}

// Inicializar banco de dados (migrations + seed)
await PedidoRapido.Infrastructure.DependencyInjection.InitializeDatabaseAsync(app.Services);

app.Run();

using System.Text.Json.Serialization;
using PedidoRapido.Application;
using PedidoRapido.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

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

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Pedido Rápido API",
        Version = "v1",
        Description = "API do sistema Pedido Rápido - Gestão de quiosques, cardápios e avaliações",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Pedido Rápido",
            Email = "contato@pedidorapido.com"
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

// CORS - Permitir frontend local
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "http://127.0.0.1:3000"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });

    // Política mais permissiva para desenvolvimento
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// =============================================================================
// Injeção de Dependências (Clean Architecture)
// =============================================================================

// Camada Infrastructure (repositórios in-memory com seed)
builder.Services.AddInfrastructure();

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
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Autenticação e Autorização (preparado para futuro)
// app.UseAuthentication();
// app.UseAuthorization();

// Mapear controllers
app.MapControllers();

// Endpoint de health check
app.MapGet("/health", () => Results.Ok(new 
{ 
    status = "healthy", 
    timestamp = DateTime.UtcNow,
    version = "1.0.0"
}));

// Endpoint de erro
app.Map("/error", (HttpContext context) =>
{
    return Results.Problem(
        title: "Ocorreu um erro",
        statusCode: StatusCodes.Status500InternalServerError
    );
});

// =============================================================================
// Iniciar Aplicação
// =============================================================================

Console.WriteLine(@"
╔═══════════════════════════════════════════════════════════════╗
║           🍽️  PEDIDO RÁPIDO API - v1.0.0  🍽️                ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Swagger UI: http://localhost:5000                            ║
║  API Base:   http://localhost:5000/api                        ║
║                                                               ║
║  Endpoints disponíveis:                                       ║
║  • GET /api/kiosks        - Listar quiosques                 ║
║  • GET /api/employees     - Listar funcionários              ║
║  • GET /api/menuitems     - Listar cardápio                  ║
║  • GET /api/ratings       - Listar avaliações                ║
║  • GET /api/ranking       - Rankings públicos                ║
║  • GET /api/plans         - Listar planos                    ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
");

app.Run();

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PedidoRapido.Application.Interfaces;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;
using PedidoRapido.Infrastructure.Configuration;
using PedidoRapido.Infrastructure.Data;
using PedidoRapido.Infrastructure.Repositories;
using PedidoRapido.Infrastructure.Repositories.EF;
using PedidoRapido.Infrastructure.Seed;
using PedidoRapido.Infrastructure.Services;

namespace PedidoRapido.Infrastructure;

/// <summary>
/// Extensão para configurar Dependency Injection da camada Infrastructure.
/// Suporta alternância entre InMemory e Entity Framework Core baseado no ambiente.
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Adiciona os serviços de infraestrutura ao container de DI.
    /// </summary>
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Verificar se deve usar Entity Framework Core
        var useEntityFramework = configuration.GetValue<bool>("UseEntityFramework", true);
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";

        Console.WriteLine($"[INFRA] Ambiente: {environment}");
        Console.WriteLine($"[INFRA] UseEntityFramework: {useEntityFramework}");

        if (useEntityFramework)
        {
            Console.WriteLine("[INFRA] 🗄️  Configurando Entity Framework Core + PostgreSQL");
            AddEntityFrameworkServices(services, configuration);
        }
        else
        {
            Console.WriteLine("[INFRA] 💾 Configurando repositórios InMemory");
            AddInMemoryServices(services);
        }

        // Configurar Stripe (sempre disponível)
        AddStripeServices(services, configuration);

        return services;
    }

    /// <summary>
    /// Configura Entity Framework Core com PostgreSQL
    /// </summary>
    private static void AddEntityFrameworkServices(IServiceCollection services, IConfiguration configuration)
    {
        // Configurar DbContext
        services.AddDbContext<PedidoRapidoDbContext>(options =>
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            options.UseNpgsql(connectionString, npgsqlOptions =>
            {
                npgsqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 3,
                    maxRetryDelay: TimeSpan.FromSeconds(5),
                    errorCodesToAdd: null);
            });

            // Configurações adicionais para desenvolvimento
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            if (environment == "Development")
            {
                options.EnableSensitiveDataLogging();
                options.EnableDetailedErrors();
            }
        });

        // Registrar repositórios EF Core como Scoped
        services.AddScoped<IUserRepository, EFUserRepository>();
        services.AddScoped<IKioskRepository, EFKioskRepository>();
        services.AddScoped<IEmployeeRepository, EFEmployeeRepository>();
        services.AddScoped<IMenuItemRepository, EFMenuItemRepository>();
        services.AddScoped<IRatingRepository, EFRatingRepository>();
        services.AddScoped<IPlanRepository, EFPlanRepository>();
        services.AddScoped<ISubscriptionRepository, EFSubscriptionRepository>();

        Console.WriteLine("[INFRA] ✅ Repositórios EF Core registrados como Scoped");
    }

    /// <summary>
    /// Configura repositórios InMemory (para testes ou desenvolvimento sem banco)
    /// </summary>
    private static void AddInMemoryServices(IServiceCollection services)
    {
        // Criar instâncias dos repositórios InMemory
        var planRepo = new PlanRepository();
        var kioskRepo = new KioskRepository();
        var employeeRepo = new EmployeeRepository();
        var menuItemRepo = new MenuItemRepository();
        var ratingRepo = new RatingRepository();
        var userRepo = new UserRepository();
        var subscriptionRepo = new SubscriptionRepository(planRepo);

        // Popular com dados de seed
        DataSeeder.SeedAll(
            planRepo,
            kioskRepo,
            employeeRepo,
            menuItemRepo,
            ratingRepo,
            subscriptionRepo,
            userRepo
        );

        // Registrar como Singleton
        services.AddSingleton<IPlanRepository>(planRepo);
        services.AddSingleton<IKioskRepository>(kioskRepo);
        services.AddSingleton<IEmployeeRepository>(employeeRepo);
        services.AddSingleton<IMenuItemRepository>(menuItemRepo);
        services.AddSingleton<IRatingRepository>(ratingRepo);
        services.AddSingleton<IUserRepository>(userRepo);
        services.AddSingleton<ISubscriptionRepository>(subscriptionRepo);

        Console.WriteLine("[INFRA] ✅ Repositórios InMemory registrados como Singleton");
    }

    /// <summary>
    /// Configura serviços do Stripe
    /// </summary>
    private static void AddStripeServices(IServiceCollection services, IConfiguration configuration)
    {
        // Configurar StripeSettings usando Bind
        services.Configure<StripeSettings>(options =>
        {
            configuration.GetSection("Stripe").Bind(options);
        });

        // Registrar StripeService
        services.AddScoped<IStripeService, StripeService>();

        Console.WriteLine("[INFRA] ✅ Serviços Stripe registrados");
    }

    /// <summary>
    /// Executa migrations e seed do banco de dados (apenas para EF Core)
    /// </summary>
    public static async Task InitializeDatabaseAsync(IServiceProvider serviceProvider)
    {
        try
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetService<PedidoRapidoDbContext>();
            
            if (context == null)
            {
                Console.WriteLine("[DB] Pulando inicialização - EF Core não configurado");
                return;
            }

            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";
            Console.WriteLine($"[DB] 🔄 Inicializando banco de dados - Ambiente: {environment}");

            // Verificar se o banco está acessível com retry
            var maxRetries = 5;
            var retryDelay = TimeSpan.FromSeconds(2);
            
            for (int i = 0; i < maxRetries; i++)
            {
                try
                {
                    var canConnect = await context.Database.CanConnectAsync();
                    if (canConnect)
                    {
                        Console.WriteLine("[DB] ✅ Conexão com PostgreSQL estabelecida");
                        break;
                    }
                }
                catch (Exception ex)
                {
                    if (i == maxRetries - 1)
                    {
                        Console.WriteLine($"[DB] ❌ Falha na conexão após {maxRetries} tentativas: {ex.Message}");
                        
                        // Em produção, falhar se não conseguir conectar
                        if (environment == "Production")
                        {
                            throw new InvalidOperationException("Não foi possível conectar ao banco de dados em produção", ex);
                        }
                        return;
                    }
                    
                    Console.WriteLine($"[DB] ⚠️  Tentativa {i + 1}/{maxRetries} falhou, tentando novamente em {retryDelay.TotalSeconds}s...");
                    await Task.Delay(retryDelay);
                }
            }

            // Aplicar migrations pendentes
            Console.WriteLine("[DB] 🔄 Verificando migrations pendentes...");
            var pendingMigrations = await context.Database.GetPendingMigrationsAsync();
            
            if (pendingMigrations.Any())
            {
                Console.WriteLine($"[DB] 📦 Aplicando {pendingMigrations.Count()} migrations pendentes...");
                await context.Database.MigrateAsync();
                Console.WriteLine("[DB] ✅ Migrations aplicadas com sucesso");
            }
            else
            {
                Console.WriteLine("[DB] ✅ Banco de dados já está atualizado");
            }

            // Executar seed apenas se necessário
            Console.WriteLine("[DB] 🌱 Verificando necessidade de seed...");
            var needsSeed = !await context.Users.AnyAsync();
            
            if (needsSeed)
            {
                Console.WriteLine("[DB] 🌱 Executando seed inicial...");
                await EFDataSeeder.SeedAsync(context);
                Console.WriteLine("[DB] ✅ Seed executado com sucesso");
            }
            else
            {
                Console.WriteLine("[DB] ✅ Dados já existem, pulando seed");
            }

            Console.WriteLine("[DB] 🎉 Inicialização do banco concluída com sucesso");
        }
        catch (Exception ex)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";
            Console.WriteLine($"[DB] ❌ Erro na inicialização do banco: {ex.Message}");
            
            if (environment == "Production")
            {
                Console.WriteLine("[DB] 💥 Falha crítica em produção - encerrando aplicação");
                throw;
            }
            else
            {
                Console.WriteLine("[DB] ⚠️  Continuando em modo desenvolvimento sem banco");
            }
        }
    }
}


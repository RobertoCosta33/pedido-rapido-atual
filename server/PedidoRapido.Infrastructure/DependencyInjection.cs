using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;
using PedidoRapido.Infrastructure.Data;
using PedidoRapido.Infrastructure.Repositories;
using PedidoRapido.Infrastructure.Repositories.EF;
using PedidoRapido.Infrastructure.Seed;

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

            Console.WriteLine("[DB] 🔄 Verificando conexão com PostgreSQL...");

            // Verificar se o banco está acessível
            var canConnect = await context.Database.CanConnectAsync();
            if (!canConnect)
            {
                Console.WriteLine("[DB] ❌ Não foi possível conectar ao PostgreSQL");
                Console.WriteLine("[DB] ℹ️  Verifique se o PostgreSQL está rodando e a connection string está correta");
                return;
            }

            Console.WriteLine("[DB] ✅ Conexão com PostgreSQL estabelecida");

            // Aplicar migrations pendentes
            Console.WriteLine("[DB] 🔄 Aplicando migrations...");
            await context.Database.MigrateAsync();
            Console.WriteLine("[DB] ✅ Migrations aplicadas");

            // Executar seed
            Console.WriteLine("[DB] 🌱 Executando seed...");
            await EFDataSeeder.SeedAsync(context);
            Console.WriteLine("[DB] ✅ Inicialização do banco concluída");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[DB] ❌ Erro na inicialização do banco: {ex.Message}");
            Console.WriteLine("[DB] ℹ️  A aplicação continuará funcionando, mas pode haver problemas com dados");
        }
    }
}


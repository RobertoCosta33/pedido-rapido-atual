using Microsoft.Extensions.DependencyInjection;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;
using PedidoRapido.Infrastructure.Repositories;
using PedidoRapido.Infrastructure.Seed;

namespace PedidoRapido.Infrastructure;

/// <summary>
/// Extensão para configurar Dependency Injection da camada Infrastructure.
/// Facilita a manutenção e futura troca de implementações.
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Adiciona os serviços de infraestrutura ao container de DI.
    /// </summary>
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        // Registrar repositórios como Singleton (In-Memory)
        // NOTA: Quando trocar para EF Core, mudar para Scoped
        
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

        return services;
    }
}


using Microsoft.Extensions.DependencyInjection;
using PedidoRapido.Application.Interfaces;
using PedidoRapido.Application.Services;

namespace PedidoRapido.Application;

/// <summary>
/// Extensão para configurar Dependency Injection da camada Application.
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Adiciona os serviços de aplicação ao container de DI.
    /// </summary>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Registrar serviços como Scoped
        services.AddScoped<IKioskService, KioskService>();
        services.AddScoped<IEmployeeService, EmployeeService>();
        services.AddScoped<IMenuItemService, MenuItemService>();
        services.AddScoped<IRatingService, RatingService>();
        services.AddScoped<IPlanService, PlanService>();
        services.AddScoped<IRankingService, RankingService>();
        
        // Serviço de autenticação
        services.AddScoped<IAuthService, AuthService>();

        // Serviço de validação de planos (FASE D)
        services.AddScoped<IPlanValidationService, PlanValidationService>();

        return services;
    }
}


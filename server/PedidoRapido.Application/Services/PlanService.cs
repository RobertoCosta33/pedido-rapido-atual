using PedidoRapido.Application.DTOs;
using PedidoRapido.Application.Interfaces;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;

namespace PedidoRapido.Application.Services;

/// <summary>
/// Serviço de Planos.
/// </summary>
public class PlanService : IPlanService
{
    private readonly IPlanRepository _planRepository;

    public PlanService(IPlanRepository planRepository)
    {
        _planRepository = planRepository;
    }

    public async Task<PlanDto?> GetByIdAsync(Guid id)
    {
        var plan = await _planRepository.GetByIdAsync(id);
        if (plan == null) return null;
        
        return ToDto(plan);
    }

    public async Task<PlanDto?> GetBySlugAsync(string slug)
    {
        var plan = await _planRepository.GetBySlugAsync(slug);
        if (plan == null) return null;
        
        return ToDto(plan);
    }

    public async Task<IEnumerable<PlanDto>> GetAllAsync()
    {
        var plans = await _planRepository.GetAllAsync();
        return plans.Select(ToDto).OrderBy(p => p.MonthlyPrice);
    }

    public async Task<IEnumerable<PlanDto>> GetActiveAsync()
    {
        var plans = await _planRepository.GetActivePlansAsync();
        return plans.Select(ToDto).OrderBy(p => p.MonthlyPrice);
    }

    private static PlanDto ToDto(Plan plan)
    {
        return new PlanDto(
            plan.Id,
            plan.Name,
            plan.Slug,
            plan.Description,
            plan.MonthlyPrice,
            plan.SemiannualPrice,
            plan.AnnualPrice,
            plan.MaxProducts,
            plan.MaxOrdersPerMonth,
            plan.MaxEmployees,
            plan.HasStockManagement,
            plan.HasEmployeeManagement,
            plan.HasPublicRanking,
            plan.HasAnalytics,
            plan.HasPrioritySupport,
            plan.IsHighlightedInRanking,
            plan.IsPopular,
            plan.IsActive
        );
    }
}


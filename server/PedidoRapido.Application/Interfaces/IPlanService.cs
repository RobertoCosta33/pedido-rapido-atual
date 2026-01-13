using PedidoRapido.Application.DTOs;

namespace PedidoRapido.Application.Interfaces;

/// <summary>
/// Interface do serviço de Planos.
/// </summary>
public interface IPlanService
{
    Task<PlanDto?> GetByIdAsync(Guid id);
    Task<PlanDto?> GetBySlugAsync(string slug);
    Task<IEnumerable<PlanDto>> GetAllAsync();
    Task<IEnumerable<PlanDto>> GetActiveAsync();
}


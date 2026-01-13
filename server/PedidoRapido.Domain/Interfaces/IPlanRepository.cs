using PedidoRapido.Domain.Entities;

namespace PedidoRapido.Domain.Interfaces;

/// <summary>
/// Repositório específico para Planos.
/// </summary>
public interface IPlanRepository : IRepository<Plan>
{
    Task<Plan?> GetBySlugAsync(string slug);
    Task<IEnumerable<Plan>> GetActivePlansAsync();
}


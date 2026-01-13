using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;

namespace PedidoRapido.Infrastructure.Repositories;

/// <summary>
/// Repositório in-memory para Planos.
/// </summary>
public class PlanRepository : InMemoryRepository<Plan>, IPlanRepository
{
    public Task<Plan?> GetBySlugAsync(string slug)
    {
        lock (_lock)
        {
            var plan = _data.FirstOrDefault(p => 
                p.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase));
            return Task.FromResult(plan);
        }
    }

    public Task<IEnumerable<Plan>> GetActivePlansAsync()
    {
        lock (_lock)
        {
            var plans = _data.Where(p => p.IsActive).OrderBy(p => p.DisplayOrder);
            return Task.FromResult<IEnumerable<Plan>>(plans.ToList());
        }
    }
}


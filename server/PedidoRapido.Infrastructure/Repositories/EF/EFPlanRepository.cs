using Microsoft.EntityFrameworkCore;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;
using PedidoRapido.Infrastructure.Data;

namespace PedidoRapido.Infrastructure.Repositories.EF;

/// <summary>
/// Repositório EF Core para Planos.
/// Mantém compatibilidade total com IPlanRepository.
/// </summary>
public class EFPlanRepository : EFRepository<Plan>, IPlanRepository
{
    public EFPlanRepository(PedidoRapidoDbContext context) : base(context)
    {
    }

    public async Task<Plan?> GetBySlugAsync(string slug)
    {
        return await _dbSet
            .FirstOrDefaultAsync(p => p.Slug.ToLower() == slug.ToLower());
    }

    public async Task<IEnumerable<Plan>> GetActivePlansAsync()
    {
        return await _dbSet
            .Where(p => p.IsActive)
            .OrderBy(p => p.DisplayOrder)
            .ToListAsync();
    }
}
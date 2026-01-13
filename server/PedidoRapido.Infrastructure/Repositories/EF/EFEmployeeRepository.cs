using Microsoft.EntityFrameworkCore;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;
using PedidoRapido.Infrastructure.Data;

namespace PedidoRapido.Infrastructure.Repositories.EF;

/// <summary>
/// Repositório EF Core para Funcionários.
/// Mantém compatibilidade total com IEmployeeRepository.
/// </summary>
public class EFEmployeeRepository : EFRepository<Employee>, IEmployeeRepository
{
    public EFEmployeeRepository(PedidoRapidoDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Employee>> GetByKioskIdAsync(Guid kioskId)
    {
        return await _dbSet
            .Where(e => e.KioskId == kioskId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Employee>> GetTopRatedAsync(int limit = 10)
    {
        return await _dbSet
            .Where(e => e.IsActive && e.TotalRatings >= 3)
            .OrderByDescending(e => e.AverageRating)
            .ThenByDescending(e => e.TotalRatings)
            .Take(limit)
            .ToListAsync();
    }
}
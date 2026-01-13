using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;

namespace PedidoRapido.Infrastructure.Repositories;

/// <summary>
/// Repositório in-memory para Funcionários.
/// </summary>
public class EmployeeRepository : InMemoryRepository<Employee>, IEmployeeRepository
{
    public Task<IEnumerable<Employee>> GetByKioskIdAsync(Guid kioskId)
    {
        lock (_lock)
        {
            var employees = _data.Where(e => e.KioskId == kioskId);
            return Task.FromResult<IEnumerable<Employee>>(employees.ToList());
        }
    }

    public Task<IEnumerable<Employee>> GetTopRatedAsync(int limit = 10)
    {
        lock (_lock)
        {
            var employees = _data
                .Where(e => e.IsActive && e.TotalRatings >= 3)
                .OrderByDescending(e => e.AverageRating)
                .ThenByDescending(e => e.TotalRatings)
                .Take(limit);
            return Task.FromResult<IEnumerable<Employee>>(employees.ToList());
        }
    }
}


using PedidoRapido.Domain.Entities;

namespace PedidoRapido.Domain.Interfaces;

/// <summary>
/// Repositório específico para Funcionários.
/// </summary>
public interface IEmployeeRepository : IRepository<Employee>
{
    Task<IEnumerable<Employee>> GetByKioskIdAsync(Guid kioskId);
    Task<IEnumerable<Employee>> GetTopRatedAsync(int limit = 10);
}


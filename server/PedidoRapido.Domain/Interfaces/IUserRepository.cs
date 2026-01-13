using PedidoRapido.Domain.Entities;

namespace PedidoRapido.Domain.Interfaces;

/// <summary>
/// Repositório específico para Usuários.
/// </summary>
public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<IEnumerable<User>> GetByRoleAsync(UserRole role);
    Task<IEnumerable<User>> GetByKioskIdAsync(Guid kioskId);
}


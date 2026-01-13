using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;

namespace PedidoRapido.Infrastructure.Repositories;

/// <summary>
/// Repositório in-memory para Usuários.
/// </summary>
public class UserRepository : InMemoryRepository<User>, IUserRepository
{
    public Task<User?> GetByEmailAsync(string email)
    {
        lock (_lock)
        {
            var user = _data.FirstOrDefault(u => 
                u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
            return Task.FromResult(user);
        }
    }

    public Task<IEnumerable<User>> GetByRoleAsync(UserRole role)
    {
        lock (_lock)
        {
            var users = _data.Where(u => u.Role == role);
            return Task.FromResult<IEnumerable<User>>(users.ToList());
        }
    }

    public Task<IEnumerable<User>> GetByKioskIdAsync(Guid kioskId)
    {
        lock (_lock)
        {
            var users = _data.Where(u => u.KioskId == kioskId);
            return Task.FromResult<IEnumerable<User>>(users.ToList());
        }
    }
}


using Microsoft.EntityFrameworkCore;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;
using PedidoRapido.Infrastructure.Data;

namespace PedidoRapido.Infrastructure.Repositories.EF;

/// <summary>
/// Repositório EF Core para Usuários.
/// Mantém compatibilidade total com IUserRepository.
/// </summary>
public class EFUserRepository : EFRepository<User>, IUserRepository
{
    public EFUserRepository(PedidoRapidoDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
    }

    public async Task<IEnumerable<User>> GetByRoleAsync(UserRole role)
    {
        return await _dbSet
            .Where(u => u.Role == role)
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetByKioskIdAsync(Guid kioskId)
    {
        return await _dbSet
            .Where(u => u.KioskId == kioskId)
            .ToListAsync();
    }
}
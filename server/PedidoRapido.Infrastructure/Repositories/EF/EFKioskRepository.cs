using Microsoft.EntityFrameworkCore;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;
using PedidoRapido.Infrastructure.Data;

namespace PedidoRapido.Infrastructure.Repositories.EF;

/// <summary>
/// Repositório EF Core para Quiosques.
/// Mantém compatibilidade total com IKioskRepository.
/// </summary>
public class EFKioskRepository : EFRepository<Kiosk>, IKioskRepository
{
    public EFKioskRepository(PedidoRapidoDbContext context) : base(context)
    {
    }

    public async Task<Kiosk?> GetBySlugAsync(string slug)
    {
        return await _dbSet
            .FirstOrDefaultAsync(k => k.Slug.ToLower() == slug.ToLower());
    }

    public async Task<IEnumerable<Kiosk>> GetByOwnerIdAsync(Guid ownerId)
    {
        return await _dbSet
            .Where(k => k.OwnerId == ownerId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Kiosk>> GetByCityAsync(string city)
    {
        return await _dbSet
            .Where(k => k.City.ToLower().Contains(city.ToLower()))
            .ToListAsync();
    }

    public async Task<IEnumerable<Kiosk>> GetActiveKiosksAsync()
    {
        return await _dbSet
            .Where(k => k.IsActive)
            .ToListAsync();
    }
}
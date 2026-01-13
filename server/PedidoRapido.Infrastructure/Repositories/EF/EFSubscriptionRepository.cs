using Microsoft.EntityFrameworkCore;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;
using PedidoRapido.Infrastructure.Data;

namespace PedidoRapido.Infrastructure.Repositories.EF;

/// <summary>
/// Repositório EF Core para Assinaturas.
/// Mantém compatibilidade total com ISubscriptionRepository.
/// </summary>
public class EFSubscriptionRepository : EFRepository<Subscription>, ISubscriptionRepository
{
    public EFSubscriptionRepository(PedidoRapidoDbContext context) : base(context)
    {
    }

    public async Task<Subscription?> GetByKioskIdAsync(Guid kioskId)
    {
        return await _dbSet
            .FirstOrDefaultAsync(s => s.KioskId == kioskId);
    }

    public override async Task<Subscription?> GetByIdAsync(Guid id)
    {
        return await _dbSet
            .Include(s => s.Plan)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<IEnumerable<Subscription>> GetExpiringAsync(int daysUntilExpiry = 7)
    {
        var expiryThreshold = DateTime.UtcNow.AddDays(daysUntilExpiry);
        
        return await _dbSet
            .Where(s => s.ExpiryDate <= expiryThreshold && s.Status == SubscriptionStatus.Active)
            .ToListAsync();
    }
}
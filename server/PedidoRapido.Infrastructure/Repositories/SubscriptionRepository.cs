using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;

namespace PedidoRapido.Infrastructure.Repositories;

/// <summary>
/// Repositório in-memory para Assinaturas.
/// </summary>
public class SubscriptionRepository : InMemoryRepository<Subscription>, ISubscriptionRepository
{
    private readonly IPlanRepository _planRepository;

    public SubscriptionRepository(IPlanRepository planRepository)
    {
        _planRepository = planRepository;
    }

    public async Task<Subscription?> GetByKioskIdAsync(Guid kioskId)
    {
        lock (_lock)
        {
            var subscription = _data.FirstOrDefault(s => s.KioskId == kioskId);
            return subscription;
        }
    }

    public override async Task<Subscription?> GetByIdAsync(Guid id)
    {
        Subscription? subscription;
        lock (_lock)
        {
            subscription = _data.FirstOrDefault(s => s.Id == id);
        }
        
        if (subscription != null)
        {
            subscription.Plan = await _planRepository.GetByIdAsync(subscription.PlanId);
        }
        
        return subscription;
    }

    public Task<IEnumerable<Subscription>> GetExpiringAsync(int daysUntilExpiry = 7)
    {
        lock (_lock)
        {
            var expiryThreshold = DateTime.UtcNow.AddDays(daysUntilExpiry);
            var subscriptions = _data.Where(s => 
                s.ExpiryDate <= expiryThreshold && 
                s.Status == SubscriptionStatus.Active);
            return Task.FromResult<IEnumerable<Subscription>>(subscriptions.ToList());
        }
    }
}


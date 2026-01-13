using PedidoRapido.Domain.Entities;

namespace PedidoRapido.Domain.Interfaces;

/// <summary>
/// Repositório específico para Assinaturas.
/// </summary>
public interface ISubscriptionRepository : IRepository<Subscription>
{
    Task<Subscription?> GetByKioskIdAsync(Guid kioskId);
    Task<IEnumerable<Subscription>> GetExpiringAsync(int daysUntilExpiry = 7);
}


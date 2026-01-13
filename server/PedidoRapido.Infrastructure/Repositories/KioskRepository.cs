using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;

namespace PedidoRapido.Infrastructure.Repositories;

/// <summary>
/// Repositório in-memory para Quiosques.
/// </summary>
public class KioskRepository : InMemoryRepository<Kiosk>, IKioskRepository
{
    public Task<Kiosk?> GetBySlugAsync(string slug)
    {
        lock (_lock)
        {
            var kiosk = _data.FirstOrDefault(k => 
                k.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase));
            return Task.FromResult(kiosk);
        }
    }

    public Task<IEnumerable<Kiosk>> GetByOwnerIdAsync(Guid ownerId)
    {
        lock (_lock)
        {
            var kiosks = _data.Where(k => k.OwnerId == ownerId);
            return Task.FromResult<IEnumerable<Kiosk>>(kiosks.ToList());
        }
    }

    public Task<IEnumerable<Kiosk>> GetByCityAsync(string city)
    {
        lock (_lock)
        {
            var kiosks = _data.Where(k => 
                k.City.Contains(city, StringComparison.OrdinalIgnoreCase));
            return Task.FromResult<IEnumerable<Kiosk>>(kiosks.ToList());
        }
    }

    public Task<IEnumerable<Kiosk>> GetActiveKiosksAsync()
    {
        lock (_lock)
        {
            var kiosks = _data.Where(k => k.IsActive);
            return Task.FromResult<IEnumerable<Kiosk>>(kiosks.ToList());
        }
    }
}


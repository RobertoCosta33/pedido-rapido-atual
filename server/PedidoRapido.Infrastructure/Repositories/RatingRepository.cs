using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;

namespace PedidoRapido.Infrastructure.Repositories;

/// <summary>
/// Repositório in-memory para Avaliações.
/// </summary>
public class RatingRepository : InMemoryRepository<Rating>, IRatingRepository
{
    public Task<IEnumerable<Rating>> GetByKioskIdAsync(Guid kioskId)
    {
        lock (_lock)
        {
            var ratings = _data.Where(r => r.KioskId == kioskId);
            return Task.FromResult<IEnumerable<Rating>>(ratings.ToList());
        }
    }

    public Task<IEnumerable<Rating>> GetByTargetAsync(RatingType type, Guid targetId)
    {
        lock (_lock)
        {
            var ratings = _data.Where(r => r.Type == type && r.TargetId == targetId);
            return Task.FromResult<IEnumerable<Rating>>(ratings.ToList());
        }
    }

    public Task<double> GetAverageByTargetAsync(RatingType type, Guid targetId)
    {
        lock (_lock)
        {
            var ratings = _data.Where(r => r.Type == type && r.TargetId == targetId).ToList();
            if (ratings.Count == 0) return Task.FromResult(0.0);
            return Task.FromResult(ratings.Average(r => r.Score));
        }
    }

    public Task<IEnumerable<(Guid TargetId, string TargetName, double Average, int Count)>> GetTopRatedAsync(RatingType type, int limit = 10)
    {
        lock (_lock)
        {
            var grouped = _data
                .Where(r => r.Type == type)
                .GroupBy(r => new { r.TargetId, r.TargetName })
                .Select(g => (
                    TargetId: g.Key.TargetId,
                    TargetName: g.Key.TargetName,
                    Average: g.Average(r => r.Score),
                    Count: g.Count()
                ))
                .Where(x => x.Count >= 2)
                .OrderByDescending(x => x.Average)
                .ThenByDescending(x => x.Count)
                .Take(limit)
                .ToList();

            return Task.FromResult<IEnumerable<(Guid, string, double, int)>>(grouped);
        }
    }
}


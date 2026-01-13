using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;

namespace PedidoRapido.Infrastructure.Repositories;

/// <summary>
/// Repositório in-memory para Avaliações.
/// </summary>
public class RatingRepository : InMemoryRepository<Rating>, IRatingRepository
{
    public Task<bool> HasUserRatedTargetAsync(Guid userId, RatingTargetType targetType, Guid targetId)
    {
        lock (_lock)
        {
            var exists = _data.Any(r => r.UserId == userId && r.TargetType == targetType && r.TargetId == targetId);
            return Task.FromResult(exists);
        }
    }

    public Task<IEnumerable<Rating>> GetByTargetAsync(RatingTargetType targetType, Guid targetId)
    {
        lock (_lock)
        {
            var ratings = _data.Where(r => r.TargetType == targetType && r.TargetId == targetId);
            return Task.FromResult<IEnumerable<Rating>>(ratings.ToList());
        }
    }

    public Task<double> GetAverageByTargetAsync(RatingTargetType targetType, Guid targetId)
    {
        lock (_lock)
        {
            var ratings = _data.Where(r => r.TargetType == targetType && r.TargetId == targetId).ToList();
            if (ratings.Count == 0) return Task.FromResult(0.0);
            return Task.FromResult(ratings.Average(r => r.Score));
        }
    }

    public Task<int> GetCountByTargetAsync(RatingTargetType targetType, Guid targetId)
    {
        lock (_lock)
        {
            var count = _data.Count(r => r.TargetType == targetType && r.TargetId == targetId);
            return Task.FromResult(count);
        }
    }

    public Task<IEnumerable<(Guid TargetId, double Average, int Count)>> GetTopRatedAsync(RatingTargetType targetType, int limit = 10)
    {
        lock (_lock)
        {
            var grouped = _data
                .Where(r => r.TargetType == targetType)
                .GroupBy(r => r.TargetId)
                .Select(g => (
                    TargetId: g.Key,
                    Average: g.Average(r => r.Score),
                    Count: g.Count()
                ))
                .Where(x => x.Count >= 1) // Pelo menos 1 avaliação
                .OrderByDescending(x => x.Average)
                .ThenByDescending(x => x.Count)
                .Take(limit)
                .ToList();

            return Task.FromResult<IEnumerable<(Guid, double, int)>>(grouped);
        }
    }
}


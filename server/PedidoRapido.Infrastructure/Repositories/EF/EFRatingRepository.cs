using Microsoft.EntityFrameworkCore;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;
using PedidoRapido.Infrastructure.Data;

namespace PedidoRapido.Infrastructure.Repositories.EF;

/// <summary>
/// Repositório EF Core para Avaliações.
/// Mantém compatibilidade total com IRatingRepository.
/// </summary>
public class EFRatingRepository : EFRepository<Rating>, IRatingRepository
{
    public EFRatingRepository(PedidoRapidoDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Rating>> GetByKioskIdAsync(Guid kioskId)
    {
        return await _dbSet
            .Where(r => r.KioskId == kioskId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Rating>> GetByTargetAsync(RatingType type, Guid targetId)
    {
        return await _dbSet
            .Where(r => r.Type == type && r.TargetId == targetId)
            .ToListAsync();
    }

    public async Task<double> GetAverageByTargetAsync(RatingType type, Guid targetId)
    {
        var ratings = await _dbSet
            .Where(r => r.Type == type && r.TargetId == targetId)
            .Select(r => r.Score)
            .ToListAsync();

        return ratings.Count == 0 ? 0.0 : ratings.Average();
    }

    public async Task<IEnumerable<(Guid TargetId, string TargetName, double Average, int Count)>> GetTopRatedAsync(RatingType type, int limit = 10)
    {
        var grouped = await _dbSet
            .Where(r => r.Type == type)
            .GroupBy(r => new { r.TargetId, r.TargetName })
            .Select(g => new
            {
                TargetId = g.Key.TargetId,
                TargetName = g.Key.TargetName,
                Average = g.Average(r => r.Score),
                Count = g.Count()
            })
            .Where(x => x.Count >= 2)
            .OrderByDescending(x => x.Average)
            .ThenByDescending(x => x.Count)
            .Take(limit)
            .ToListAsync();

        return grouped.Select(x => (x.TargetId, x.TargetName, x.Average, x.Count));
    }
}
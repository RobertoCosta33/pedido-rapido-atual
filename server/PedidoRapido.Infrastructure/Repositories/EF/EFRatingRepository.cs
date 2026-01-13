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

    public async Task<bool> HasUserRatedTargetAsync(Guid userId, RatingTargetType targetType, Guid targetId)
    {
        return await _dbSet
            .AnyAsync(r => r.UserId == userId && r.TargetType == targetType && r.TargetId == targetId);
    }

    public async Task<IEnumerable<Rating>> GetByTargetAsync(RatingTargetType targetType, Guid targetId)
    {
        return await _dbSet
            .Where(r => r.TargetType == targetType && r.TargetId == targetId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<double> GetAverageByTargetAsync(RatingTargetType targetType, Guid targetId)
    {
        var ratings = await _dbSet
            .Where(r => r.TargetType == targetType && r.TargetId == targetId)
            .Select(r => r.Score)
            .ToListAsync();

        return ratings.Count == 0 ? 0.0 : ratings.Average();
    }

    public async Task<int> GetCountByTargetAsync(RatingTargetType targetType, Guid targetId)
    {
        return await _dbSet
            .CountAsync(r => r.TargetType == targetType && r.TargetId == targetId);
    }

    public async Task<IEnumerable<(Guid TargetId, double Average, int Count)>> GetTopRatedAsync(RatingTargetType targetType, int limit = 10)
    {
        var grouped = await _dbSet
            .Where(r => r.TargetType == targetType)
            .GroupBy(r => r.TargetId)
            .Select(g => new
            {
                TargetId = g.Key,
                Average = g.Average(r => r.Score),
                Count = g.Count()
            })
            .Where(x => x.Count >= 1) // Pelo menos 1 avaliação
            .OrderByDescending(x => x.Average)
            .ThenByDescending(x => x.Count)
            .Take(limit)
            .ToListAsync();

        return grouped.Select(x => (x.TargetId, x.Average, x.Count));
    }
}
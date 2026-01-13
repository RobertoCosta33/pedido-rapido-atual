using PedidoRapido.Domain.Entities;

namespace PedidoRapido.Domain.Interfaces;

/// <summary>
/// Repositório específico para Avaliações.
/// </summary>
public interface IRatingRepository : IRepository<Rating>
{
    Task<IEnumerable<Rating>> GetByKioskIdAsync(Guid kioskId);
    Task<IEnumerable<Rating>> GetByTargetAsync(RatingType type, Guid targetId);
    Task<double> GetAverageByTargetAsync(RatingType type, Guid targetId);
    Task<IEnumerable<(Guid TargetId, string TargetName, double Average, int Count)>> GetTopRatedAsync(RatingType type, int limit = 10);
}


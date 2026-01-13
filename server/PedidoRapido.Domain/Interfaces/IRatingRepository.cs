using PedidoRapido.Domain.Entities;

namespace PedidoRapido.Domain.Interfaces;

/// <summary>
/// Repositório específico para Avaliações.
/// </summary>
public interface IRatingRepository : IRepository<Rating>
{
    /// <summary>
    /// Verifica se um usuário já avaliou um alvo específico
    /// </summary>
    Task<bool> HasUserRatedTargetAsync(Guid userId, RatingTargetType targetType, Guid targetId);
    
    /// <summary>
    /// Obtém avaliações por tipo de alvo e ID do alvo
    /// </summary>
    Task<IEnumerable<Rating>> GetByTargetAsync(RatingTargetType targetType, Guid targetId);
    
    /// <summary>
    /// Obtém média de avaliações por tipo de alvo e ID do alvo
    /// </summary>
    Task<double> GetAverageByTargetAsync(RatingTargetType targetType, Guid targetId);
    
    /// <summary>
    /// Obtém contagem de avaliações por tipo de alvo e ID do alvo
    /// </summary>
    Task<int> GetCountByTargetAsync(RatingTargetType targetType, Guid targetId);
    
    /// <summary>
    /// Obtém top rankings por tipo de alvo
    /// </summary>
    Task<IEnumerable<(Guid TargetId, double Average, int Count)>> GetTopRatedAsync(RatingTargetType targetType, int limit = 10);
}


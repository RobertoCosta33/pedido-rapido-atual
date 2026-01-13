using PedidoRapido.Application.DTOs;
using PedidoRapido.Domain.Entities;

namespace PedidoRapido.Application.Interfaces;

/// <summary>
/// Interface do serviço de Avaliações.
/// </summary>
public interface IRatingService
{
    Task<RatingDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<RatingDto>> GetByTargetAsync(RatingTargetType targetType, Guid targetId);
    Task<RatingDto> CreateAsync(Guid userId, CreateRatingDto dto);
    Task<RatingStatsDto> GetStatsAsync(RatingTargetType targetType, Guid targetId);
    Task<double> GetAverageAsync(RatingTargetType targetType, Guid targetId);
    Task<int> GetCountAsync(RatingTargetType targetType, Guid targetId);
}


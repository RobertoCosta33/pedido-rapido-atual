using PedidoRapido.Application.DTOs;
using PedidoRapido.Domain.Entities;

namespace PedidoRapido.Application.Interfaces;

/// <summary>
/// Interface do serviço de Avaliações.
/// </summary>
public interface IRatingService
{
    Task<RatingDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<RatingDto>> GetByKioskIdAsync(Guid kioskId);
    Task<IEnumerable<RatingDto>> GetByTargetAsync(RatingType type, Guid targetId);
    Task<RatingDto> CreateAsync(CreateRatingDto dto);
    Task<RatingStatsDto> GetStatsAsync(Guid kioskId);
    Task<double> GetAverageAsync(RatingType type, Guid targetId);
}


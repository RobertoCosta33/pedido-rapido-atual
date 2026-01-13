using PedidoRapido.Domain.Entities;

namespace PedidoRapido.Application.DTOs;

/// <summary>
/// DTO para resposta de Avaliação
/// </summary>
public record RatingDto(
    Guid Id,
    Guid UserId,
    string UserName,
    RatingTargetType TargetType,
    Guid TargetId,
    int Score,
    string? Comment,
    DateTime CreatedAt
);

/// <summary>
/// DTO para criação de Avaliação
/// </summary>
public record CreateRatingDto(
    RatingTargetType TargetType,
    Guid TargetId,
    int Score,
    string? Comment
);

/// <summary>
/// DTO para item do ranking
/// </summary>
public record RankingItemDto(
    Guid Id,
    string Name,
    double AverageRating,
    int TotalRatings,
    string? Description = null,
    string? Image = null
);

/// <summary>
/// DTO para estatísticas de avaliações
/// </summary>
public record RatingStatsDto(
    double AverageRating,
    int TotalRatings,
    Dictionary<int, int> Distribution, // Estrela -> Quantidade
    List<RatingDto> RecentRatings
);


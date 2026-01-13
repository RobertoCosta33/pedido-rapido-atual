using PedidoRapido.Domain.Entities;

namespace PedidoRapido.Application.DTOs;

/// <summary>
/// DTO para resposta de Avaliação
/// </summary>
public record RatingDto(
    Guid Id,
    Guid KioskId,
    string KioskName,
    string CustomerName,
    string Type,
    Guid TargetId,
    string TargetName,
    int Score,
    string? Comment,
    DateTime CreatedAt
);

/// <summary>
/// DTO para criação de Avaliação
/// </summary>
public record CreateRatingDto(
    Guid KioskId,
    Guid? CustomerId,
    string CustomerName,
    RatingType Type,
    Guid TargetId,
    string TargetName,
    int Score,
    string? Comment
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


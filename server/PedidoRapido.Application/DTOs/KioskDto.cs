namespace PedidoRapido.Application.DTOs;

/// <summary>
/// DTO para resposta de Quiosque
/// </summary>
public record KioskDto(
    Guid Id,
    string Name,
    string Slug,
    string Description,
    string Logo,
    string CoverImage,
    string City,
    string State,
    string Phone,
    string WhatsApp,
    bool AllowOnlineOrders,
    int EstimatedPrepTime,
    double AverageRating,
    int TotalRatings,
    bool IsPremium,
    DateTime CreatedAt
);

/// <summary>
/// DTO para criação de Quiosque
/// </summary>
public record CreateKioskDto(
    string Name,
    string Description,
    string? Logo,
    string? CoverImage,
    string Street,
    string Number,
    string? Complement,
    string Neighborhood,
    string City,
    string State,
    string ZipCode,
    string Phone,
    string? WhatsApp,
    string Email,
    string? Instagram,
    Guid OwnerId
);

/// <summary>
/// DTO para atualização de Quiosque
/// </summary>
public record UpdateKioskDto(
    string? Name,
    string? Description,
    string? Logo,
    string? CoverImage,
    string? Phone,
    string? WhatsApp,
    string? Email,
    string? Instagram,
    bool? AllowOnlineOrders,
    int? EstimatedPrepTime
);

/// <summary>
/// DTO para ranking de Quiosques
/// </summary>
public record KioskRankingDto(
    Guid Id,
    string Name,
    string Slug,
    string? Logo,
    string City,
    string State,
    double AverageRating,
    int TotalRatings,
    bool IsPremium,
    int Position
);


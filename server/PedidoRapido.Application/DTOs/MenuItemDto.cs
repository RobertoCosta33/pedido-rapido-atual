using PedidoRapido.Domain.Entities;

namespace PedidoRapido.Application.DTOs;

/// <summary>
/// DTO para resposta de Item de Menu
/// </summary>
public record MenuItemDto(
    Guid Id,
    Guid KioskId,
    string KioskName,
    string Name,
    string Description,
    decimal Price,
    string? Image,
    string Category,
    bool IsAvailable,
    int PreparationTime,
    double AverageRating,
    int TotalRatings,
    DateTime CreatedAt
);

/// <summary>
/// DTO para criação de Item de Menu
/// </summary>
public record CreateMenuItemDto(
    Guid KioskId,
    string Name,
    string Description,
    decimal Price,
    string? Image,
    MenuItemCategory Category,
    int PreparationTime
);

/// <summary>
/// DTO para atualização de Item de Menu
/// </summary>
public record UpdateMenuItemDto(
    string? Name,
    string? Description,
    decimal? Price,
    string? Image,
    MenuItemCategory? Category,
    bool? IsAvailable,
    int? PreparationTime
);

/// <summary>
/// DTO para ranking de Itens de Menu
/// </summary>
public record MenuItemRankingDto(
    Guid Id,
    string Name,
    string Category,
    string KioskName,
    decimal Price,
    string? Image,
    double AverageRating,
    int TotalRatings,
    int Position
);


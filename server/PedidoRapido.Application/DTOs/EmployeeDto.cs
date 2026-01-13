using PedidoRapido.Domain.Entities;

namespace PedidoRapido.Application.DTOs;

/// <summary>
/// DTO para resposta de Funcionário
/// </summary>
public record EmployeeDto(
    Guid Id,
    Guid KioskId,
    string KioskName,
    string Name,
    string Role,
    string Phone,
    string Email,
    DateTime HireDate,
    string? Photo,
    double AverageRating,
    int TotalRatings,
    bool IsActive,
    DateTime CreatedAt
);

/// <summary>
/// DTO para criação de Funcionário
/// </summary>
public record CreateEmployeeDto(
    Guid KioskId,
    string Name,
    EmployeeRole Role,
    string Phone,
    string Email,
    string Document,
    DateTime HireDate,
    decimal Salary,
    string? WorkSchedule,
    string? Photo
);

/// <summary>
/// DTO para atualização de Funcionário
/// </summary>
public record UpdateEmployeeDto(
    string? Name,
    EmployeeRole? Role,
    string? Phone,
    string? Email,
    decimal? Salary,
    string? WorkSchedule,
    string? Photo,
    bool? IsActive
);

/// <summary>
/// DTO para ranking de Funcionários
/// </summary>
public record EmployeeRankingDto(
    Guid Id,
    string Name,
    string Role,
    string KioskName,
    string? Photo,
    double AverageRating,
    int TotalRatings,
    int Position
);


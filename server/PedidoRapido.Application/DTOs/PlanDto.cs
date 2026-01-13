namespace PedidoRapido.Application.DTOs;

/// <summary>
/// DTO para resposta de Plano
/// </summary>
public record PlanDto(
    Guid Id,
    string Name,
    string Slug,
    string Description,
    decimal MonthlyPrice,
    decimal SemiannualPrice,
    decimal AnnualPrice,
    int MaxProducts,
    int MaxOrdersPerMonth,
    int MaxEmployees,
    bool HasStockManagement,
    bool HasEmployeeManagement,
    bool HasPublicRanking,
    bool HasAnalytics,
    bool HasPrioritySupport,
    bool IsHighlightedInRanking,
    bool IsPopular,
    bool IsActive
);

/// <summary>
/// DTO para resposta de Assinatura
/// </summary>
public record SubscriptionDto(
    Guid Id,
    Guid KioskId,
    string KioskName,
    Guid PlanId,
    string PlanName,
    string Status,
    string BillingCycle,
    DateTime StartDate,
    DateTime ExpiryDate,
    bool AutoRenew,
    decimal Price
);


namespace PedidoRapido.Application.DTOs;

/// <summary>
/// DTO para resposta paginada
/// </summary>
public record PagedResult<T>(
    IEnumerable<T> Items,
    int TotalItems,
    int Page,
    int PageSize,
    int TotalPages
);

/// <summary>
/// DTO para resultado de operação
/// </summary>
public record OperationResult(
    bool Success,
    string? Message = null,
    object? Data = null
);

/// <summary>
/// DTO para erros de validação
/// </summary>
public record ValidationError(
    string Field,
    string Message
);


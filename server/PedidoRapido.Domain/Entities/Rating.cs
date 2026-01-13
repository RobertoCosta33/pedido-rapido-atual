namespace PedidoRapido.Domain.Entities;

/// <summary>
/// Avaliação feita por um usuário.
/// Pode ser de quiosque, produto (MenuItem) ou funcionário (Employee).
/// </summary>
public class Rating : BaseEntity
{
    public Guid UserId { get; set; }
    
    public RatingTargetType TargetType { get; set; }
    public Guid TargetId { get; set; }
    
    public int Score { get; set; } // 1 a 5
    public string? Comment { get; set; }
    
    // Navegações
    public User? User { get; set; }
}

/// <summary>
/// Tipo de alvo da avaliação
/// </summary>
public enum RatingTargetType
{
    Kiosk = 1,
    Product = 2,
    Staff = 3
}


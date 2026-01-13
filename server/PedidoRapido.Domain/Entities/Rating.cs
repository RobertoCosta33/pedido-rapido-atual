namespace PedidoRapido.Domain.Entities;

/// <summary>
/// Avaliação feita por um cliente.
/// Pode ser de quiosque, item do menu, funcionário ou atendimento.
/// </summary>
public class Rating : BaseEntity
{
    public Guid KioskId { get; set; }
    public Guid? CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    
    public RatingType Type { get; set; }
    public Guid TargetId { get; set; }
    public string TargetName { get; set; } = string.Empty;
    
    public int Score { get; set; } // 1 a 5
    public string? Comment { get; set; }
    
    // Navegações
    public Kiosk? Kiosk { get; set; }
    public User? Customer { get; set; }
}

/// <summary>
/// Tipo de avaliação
/// </summary>
public enum RatingType
{
    Kiosk = 0,
    MenuItem = 1,
    Employee = 2,
    Service = 3
}


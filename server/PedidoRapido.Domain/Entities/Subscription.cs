namespace PedidoRapido.Domain.Entities;

/// <summary>
/// Assinatura de um quiosque a um plano.
/// Controla o ciclo de pagamento e status.
/// </summary>
public class Subscription : BaseEntity
{
    public Guid KioskId { get; set; }
    public Guid PlanId { get; set; }
    
    public SubscriptionStatus Status { get; set; } = SubscriptionStatus.Active;
    public BillingCycle BillingCycle { get; set; } = BillingCycle.Monthly;
    
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime ExpiryDate { get; set; }
    public bool AutoRenew { get; set; } = true;
    
    public decimal Price { get; set; }
    public decimal TotalPaid { get; set; }
    
    // Navegações
    public Kiosk? Kiosk { get; set; }
    public Plan? Plan { get; set; }
}

/// <summary>
/// Status da assinatura
/// </summary>
public enum SubscriptionStatus
{
    Active = 0,
    ExpiringSoon = 1,
    Expired = 2,
    Suspended = 3,
    Cancelled = 4
}

/// <summary>
/// Ciclo de cobrança
/// </summary>
public enum BillingCycle
{
    Monthly = 0,
    Semiannual = 1,
    Annual = 2
}


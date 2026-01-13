namespace PedidoRapido.Infrastructure.Configuration;

/// <summary>
/// Configurações do Stripe
/// </summary>
public class StripeSettings
{
    public string SecretKey { get; set; } = string.Empty;
    public string PublishableKey { get; set; } = string.Empty;
    public string WebhookSecret { get; set; } = string.Empty;
    public StripePriceIds PriceIds { get; set; } = new();
}

/// <summary>
/// IDs dos preços no Stripe organizados por plano e ciclo
/// </summary>
public class StripePriceIds
{
    public PlanPrices Basic { get; set; } = new();
    public PlanPrices Pro { get; set; } = new();
    public PremiumPrices Premium { get; set; } = new();
}

/// <summary>
/// Preços de um plano (todos os ciclos)
/// </summary>
public class PlanPrices
{
    public string Monthly { get; set; } = string.Empty;
    public string Semiannual { get; set; } = string.Empty;
    public string Annual { get; set; } = string.Empty;
}

/// <summary>
/// Preços do Premium (não tem semestral)
/// </summary>
public class PremiumPrices
{
    public string Monthly { get; set; } = string.Empty;
    public string Annual { get; set; } = string.Empty;
}
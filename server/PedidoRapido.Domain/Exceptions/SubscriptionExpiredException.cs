namespace PedidoRapido.Domain.Exceptions;

/// <summary>
/// Exceção lançada quando uma assinatura está expirada.
/// </summary>
public class SubscriptionExpiredException : Exception
{
    public DateTime ExpiryDate { get; }
    public string PlanName { get; }

    public SubscriptionExpiredException(DateTime expiryDate, string planName)
        : base($"Assinatura expirada em {expiryDate:dd/MM/yyyy}. Plano: {planName}. Faça upgrade para continuar usando o sistema.")
    {
        ExpiryDate = expiryDate;
        PlanName = planName;
    }
}
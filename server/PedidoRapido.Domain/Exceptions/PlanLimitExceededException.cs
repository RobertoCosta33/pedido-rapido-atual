namespace PedidoRapido.Domain.Exceptions;

/// <summary>
/// Exceção lançada quando um limite do plano é excedido.
/// </summary>
public class PlanLimitExceededException : Exception
{
    public string LimitType { get; }
    public int CurrentCount { get; }
    public int MaxAllowed { get; }
    public string PlanName { get; }

    public PlanLimitExceededException(string limitType, int currentCount, int maxAllowed, string planName)
        : base($"Limite do plano excedido: {limitType}. Atual: {currentCount}, Máximo permitido: {maxAllowed} (Plano {planName})")
    {
        LimitType = limitType;
        CurrentCount = currentCount;
        MaxAllowed = maxAllowed;
        PlanName = planName;
    }

    public PlanLimitExceededException(string limitType, string planName)
        : base($"Funcionalidade não disponível no plano {planName}: {limitType}")
    {
        LimitType = limitType;
        PlanName = planName;
        CurrentCount = 0;
        MaxAllowed = 0;
    }
}
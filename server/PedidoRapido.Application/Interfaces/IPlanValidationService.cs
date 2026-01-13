using PedidoRapido.Domain.Entities;

namespace PedidoRapido.Application.Interfaces;

/// <summary>
/// Serviço para validar limites de planos e assinaturas.
/// </summary>
public interface IPlanValidationService
{
    /// <summary>
    /// Valida se o usuário pode criar um novo quiosque
    /// </summary>
    Task ValidateCanCreateKioskAsync(Guid userId);

    /// <summary>
    /// Valida se o usuário pode criar um novo funcionário
    /// </summary>
    Task ValidateCanCreateEmployeeAsync(Guid kioskId);

    /// <summary>
    /// Valida se o usuário pode criar um novo produto
    /// </summary>
    Task ValidateCanCreateMenuItemAsync(Guid kioskId);

    /// <summary>
    /// Valida se a assinatura está ativa (não expirada)
    /// </summary>
    Task ValidateSubscriptionActiveAsync(Guid kioskId);

    /// <summary>
    /// Obtém informações sobre os limites atuais do usuário
    /// </summary>
    Task<PlanLimitsInfo> GetPlanLimitsAsync(Guid userId);
}

/// <summary>
/// Informações sobre os limites do plano atual
/// </summary>
public class PlanLimitsInfo
{
    public string PlanName { get; set; } = string.Empty;
    public bool IsExpired { get; set; }
    public DateTime? ExpiryDate { get; set; }
    
    // Limites atuais vs máximos
    public int CurrentKiosks { get; set; }
    public int MaxKiosks { get; set; }
    
    public int CurrentEmployees { get; set; }
    public int MaxEmployees { get; set; }
    
    public int CurrentMenuItems { get; set; }
    public int MaxMenuItems { get; set; }
    
    // Funcionalidades disponíveis
    public bool CanCreateEmployees { get; set; }
    public bool HasStockManagement { get; set; }
    public bool HasAnalytics { get; set; }
    public bool HasPrioritySupport { get; set; }
}
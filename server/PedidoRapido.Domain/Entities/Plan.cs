namespace PedidoRapido.Domain.Entities;

/// <summary>
/// Plano de assinatura disponível no sistema.
/// Define limites e funcionalidades.
/// </summary>
public class Plan : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    // Preços
    public decimal MonthlyPrice { get; set; }
    public decimal SemiannualPrice { get; set; }
    public decimal AnnualPrice { get; set; }
    
    // Limites
    public int MaxKiosks { get; set; } = 1; // Novo campo para limitar quiosques
    public int MaxProducts { get; set; } = -1; // -1 = ilimitado
    public int MaxOrdersPerMonth { get; set; } = -1;
    public int MaxEmployees { get; set; } = -1;
    
    // Features
    public bool HasStockManagement { get; set; }
    public bool HasEmployeeManagement { get; set; }
    public bool HasPublicRanking { get; set; }
    public bool HasAnalytics { get; set; }
    public bool HasPrioritySupport { get; set; }
    public bool IsHighlightedInRanking { get; set; }
    
    // Ordem de exibição
    public int DisplayOrder { get; set; }
    public bool IsPopular { get; set; }
}


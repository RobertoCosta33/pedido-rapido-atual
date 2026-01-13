namespace PedidoRapido.Domain.Entities;

/// <summary>
/// Funcionário de um quiosque.
/// Pode ser garçom, cozinheiro, caixa, etc.
/// </summary>
public class Employee : BaseEntity
{
    public Guid KioskId { get; set; }
    public string Name { get; set; } = string.Empty;
    public EmployeeRole Role { get; set; } = EmployeeRole.Waiter;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Document { get; set; } = string.Empty;
    public DateTime HireDate { get; set; } = DateTime.UtcNow;
    public decimal Salary { get; set; }
    public string WorkSchedule { get; set; } = string.Empty;
    public string? Photo { get; set; }
    
    // Avaliação média (calculado)
    public double AverageRating { get; set; }
    public int TotalRatings { get; set; }
    
    // Navegação
    public Kiosk? Kiosk { get; set; }
    public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
}

/// <summary>
/// Cargos de funcionários
/// </summary>
public enum EmployeeRole
{
    Waiter = 0,
    Bartender = 1,
    Cook = 2,
    Cashier = 3,
    Manager = 4
}


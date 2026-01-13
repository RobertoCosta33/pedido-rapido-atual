namespace PedidoRapido.Domain.Entities;

/// <summary>
/// Entidade de quiosque.
/// Representa um estabelecimento que usa o sistema.
/// </summary>
public class Kiosk : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Logo { get; set; } = string.Empty;
    public string CoverImage { get; set; } = string.Empty;
    
    // Endereço
    public string Street { get; set; } = string.Empty;
    public string Number { get; set; } = string.Empty;
    public string Complement { get; set; } = string.Empty;
    public string Neighborhood { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    
    // Contato
    public string Phone { get; set; } = string.Empty;
    public string WhatsApp { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Instagram { get; set; } = string.Empty;
    
    // Configurações
    public bool AllowOnlineOrders { get; set; } = true;
    public int EstimatedPrepTime { get; set; } = 15;
    
    // Dono
    public Guid OwnerId { get; set; }
    
    // Navegações
    public User? Owner { get; set; }
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    public ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
    public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
    public Subscription? Subscription { get; set; }
}


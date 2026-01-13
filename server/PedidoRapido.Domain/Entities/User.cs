namespace PedidoRapido.Domain.Entities;

/// <summary>
/// Entidade de usuário do sistema.
/// Pode ser Super Admin, Admin de Quiosque ou Cliente.
/// </summary>
public class User : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Customer;
    public Guid? KioskId { get; set; }
    
    // Navegação
    public Kiosk? Kiosk { get; set; }
}

/// <summary>
/// Tipos de usuário no sistema
/// </summary>
public enum UserRole
{
    SuperAdmin = 0,
    Admin = 1,
    Customer = 2
}


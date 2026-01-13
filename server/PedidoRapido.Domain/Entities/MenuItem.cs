namespace PedidoRapido.Domain.Entities;

/// <summary>
/// Item do cardápio (prato ou bebida).
/// </summary>
public class MenuItem : BaseEntity
{
    public Guid KioskId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Image { get; set; } = string.Empty;
    public MenuItemCategory Category { get; set; } = MenuItemCategory.Dish;
    public bool IsAvailable { get; set; } = true;
    public int PreparationTime { get; set; } = 15;
    
    // Avaliação média (calculado)
    public double AverageRating { get; set; }
    public int TotalRatings { get; set; }
    
    // Navegação
    public Kiosk? Kiosk { get; set; }
    public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
}

/// <summary>
/// Categoria do item de menu
/// </summary>
public enum MenuItemCategory
{
    Dish = 0,
    Drink = 1,
    Appetizer = 2,
    Dessert = 3
}


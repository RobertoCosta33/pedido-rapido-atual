using PedidoRapido.Domain.Entities;

namespace PedidoRapido.Domain.Interfaces;

/// <summary>
/// Repositório específico para Itens de Menu.
/// </summary>
public interface IMenuItemRepository : IRepository<MenuItem>
{
    Task<IEnumerable<MenuItem>> GetByKioskIdAsync(Guid kioskId);
    Task<IEnumerable<MenuItem>> GetByCategoryAsync(MenuItemCategory category);
    Task<IEnumerable<MenuItem>> GetTopRatedAsync(int limit = 10);
    Task<IEnumerable<MenuItem>> GetTopRatedDrinksAsync(int limit = 10);
    Task<IEnumerable<MenuItem>> GetTopRatedDishesAsync(int limit = 10);
}


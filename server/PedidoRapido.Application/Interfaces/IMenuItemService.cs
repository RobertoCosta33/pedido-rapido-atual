using PedidoRapido.Application.DTOs;

namespace PedidoRapido.Application.Interfaces;

/// <summary>
/// Interface do serviço de Itens de Menu.
/// </summary>
public interface IMenuItemService
{
    Task<MenuItemDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<MenuItemDto>> GetAllAsync();
    Task<IEnumerable<MenuItemDto>> GetByKioskIdAsync(Guid kioskId);
    Task<MenuItemDto> CreateAsync(CreateMenuItemDto dto);
    Task<MenuItemDto> UpdateAsync(Guid id, UpdateMenuItemDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<IEnumerable<MenuItemRankingDto>> GetTopRatedDishesAsync(int limit = 10);
    Task<IEnumerable<MenuItemRankingDto>> GetTopRatedDrinksAsync(int limit = 10);
}


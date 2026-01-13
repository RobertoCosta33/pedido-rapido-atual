using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;

namespace PedidoRapido.Infrastructure.Repositories;

/// <summary>
/// Repositório in-memory para Itens de Menu.
/// </summary>
public class MenuItemRepository : InMemoryRepository<MenuItem>, IMenuItemRepository
{
    public Task<IEnumerable<MenuItem>> GetByKioskIdAsync(Guid kioskId)
    {
        lock (_lock)
        {
            var items = _data.Where(i => i.KioskId == kioskId);
            return Task.FromResult<IEnumerable<MenuItem>>(items.ToList());
        }
    }

    public Task<IEnumerable<MenuItem>> GetByCategoryAsync(MenuItemCategory category)
    {
        lock (_lock)
        {
            var items = _data.Where(i => i.Category == category);
            return Task.FromResult<IEnumerable<MenuItem>>(items.ToList());
        }
    }

    public Task<IEnumerable<MenuItem>> GetTopRatedAsync(int limit = 10)
    {
        lock (_lock)
        {
            var items = _data
                .Where(i => i.IsAvailable && i.TotalRatings >= 3)
                .OrderByDescending(i => i.AverageRating)
                .ThenByDescending(i => i.TotalRatings)
                .Take(limit);
            return Task.FromResult<IEnumerable<MenuItem>>(items.ToList());
        }
    }

    public Task<IEnumerable<MenuItem>> GetTopRatedDrinksAsync(int limit = 10)
    {
        lock (_lock)
        {
            var items = _data
                .Where(i => i.IsAvailable && i.Category == MenuItemCategory.Drink && i.TotalRatings >= 2)
                .OrderByDescending(i => i.AverageRating)
                .ThenByDescending(i => i.TotalRatings)
                .Take(limit);
            return Task.FromResult<IEnumerable<MenuItem>>(items.ToList());
        }
    }

    public Task<IEnumerable<MenuItem>> GetTopRatedDishesAsync(int limit = 10)
    {
        lock (_lock)
        {
            var items = _data
                .Where(i => i.IsAvailable && i.Category == MenuItemCategory.Dish && i.TotalRatings >= 2)
                .OrderByDescending(i => i.AverageRating)
                .ThenByDescending(i => i.TotalRatings)
                .Take(limit);
            return Task.FromResult<IEnumerable<MenuItem>>(items.ToList());
        }
    }
}


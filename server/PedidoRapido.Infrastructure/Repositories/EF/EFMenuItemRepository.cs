using Microsoft.EntityFrameworkCore;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;
using PedidoRapido.Infrastructure.Data;

namespace PedidoRapido.Infrastructure.Repositories.EF;

/// <summary>
/// Repositório EF Core para Itens de Menu.
/// Mantém compatibilidade total com IMenuItemRepository.
/// </summary>
public class EFMenuItemRepository : EFRepository<MenuItem>, IMenuItemRepository
{
    public EFMenuItemRepository(PedidoRapidoDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<MenuItem>> GetByKioskIdAsync(Guid kioskId)
    {
        return await _dbSet
            .Where(i => i.KioskId == kioskId)
            .ToListAsync();
    }

    public async Task<IEnumerable<MenuItem>> GetByCategoryAsync(MenuItemCategory category)
    {
        return await _dbSet
            .Where(i => i.Category == category)
            .ToListAsync();
    }

    public async Task<IEnumerable<MenuItem>> GetTopRatedAsync(int limit = 10)
    {
        return await _dbSet
            .Where(i => i.IsAvailable && i.TotalRatings >= 3)
            .OrderByDescending(i => i.AverageRating)
            .ThenByDescending(i => i.TotalRatings)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<IEnumerable<MenuItem>> GetTopRatedDrinksAsync(int limit = 10)
    {
        return await _dbSet
            .Where(i => i.IsAvailable && i.Category == MenuItemCategory.Drink && i.TotalRatings >= 2)
            .OrderByDescending(i => i.AverageRating)
            .ThenByDescending(i => i.TotalRatings)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<IEnumerable<MenuItem>> GetTopRatedDishesAsync(int limit = 10)
    {
        return await _dbSet
            .Where(i => i.IsAvailable && i.Category == MenuItemCategory.Dish && i.TotalRatings >= 2)
            .OrderByDescending(i => i.AverageRating)
            .ThenByDescending(i => i.TotalRatings)
            .Take(limit)
            .ToListAsync();
    }
}
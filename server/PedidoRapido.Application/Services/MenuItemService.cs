using PedidoRapido.Application.DTOs;
using PedidoRapido.Application.Interfaces;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;

namespace PedidoRapido.Application.Services;

/// <summary>
/// Serviço de Itens de Menu.
/// </summary>
public class MenuItemService : IMenuItemService
{
    private readonly IMenuItemRepository _menuItemRepository;
    private readonly IKioskRepository _kioskRepository;

    public MenuItemService(
        IMenuItemRepository menuItemRepository,
        IKioskRepository kioskRepository)
    {
        _menuItemRepository = menuItemRepository;
        _kioskRepository = kioskRepository;
    }

    public async Task<MenuItemDto?> GetByIdAsync(Guid id)
    {
        var item = await _menuItemRepository.GetByIdAsync(id);
        if (item == null) return null;
        
        return await ToDto(item);
    }

    public async Task<IEnumerable<MenuItemDto>> GetAllAsync()
    {
        var items = await _menuItemRepository.GetAllAsync();
        var result = new List<MenuItemDto>();
        
        foreach (var item in items)
        {
            result.Add(await ToDto(item));
        }
        
        return result;
    }

    public async Task<IEnumerable<MenuItemDto>> GetByKioskIdAsync(Guid kioskId)
    {
        var items = await _menuItemRepository.GetByKioskIdAsync(kioskId);
        var result = new List<MenuItemDto>();
        
        foreach (var item in items)
        {
            result.Add(await ToDto(item));
        }
        
        return result;
    }

    public async Task<MenuItemDto> CreateAsync(CreateMenuItemDto dto)
    {
        var kiosk = await _kioskRepository.GetByIdAsync(dto.KioskId)
            ?? throw new KeyNotFoundException($"Quiosque {dto.KioskId} não encontrado");

        var item = new MenuItem
        {
            KioskId = dto.KioskId,
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Image = dto.Image ?? string.Empty,
            Category = dto.Category,
            PreparationTime = dto.PreparationTime
        };

        var created = await _menuItemRepository.AddAsync(item);
        return await ToDto(created);
    }

    public async Task<MenuItemDto> UpdateAsync(Guid id, UpdateMenuItemDto dto)
    {
        var item = await _menuItemRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Item {id} não encontrado");

        if (dto.Name != null) item.Name = dto.Name;
        if (dto.Description != null) item.Description = dto.Description;
        if (dto.Price.HasValue) item.Price = dto.Price.Value;
        if (dto.Image != null) item.Image = dto.Image;
        if (dto.Category.HasValue) item.Category = dto.Category.Value;
        if (dto.IsAvailable.HasValue) item.IsAvailable = dto.IsAvailable.Value;
        if (dto.PreparationTime.HasValue) item.PreparationTime = dto.PreparationTime.Value;

        item.UpdatedAt = DateTime.UtcNow;

        var updated = await _menuItemRepository.UpdateAsync(item);
        return await ToDto(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _menuItemRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<MenuItemRankingDto>> GetTopRatedDishesAsync(int limit = 10)
    {
        var topItems = await _menuItemRepository.GetTopRatedDishesAsync(limit);
        return await ToRankingDtos(topItems);
    }

    public async Task<IEnumerable<MenuItemRankingDto>> GetTopRatedDrinksAsync(int limit = 10)
    {
        var topItems = await _menuItemRepository.GetTopRatedDrinksAsync(limit);
        return await ToRankingDtos(topItems);
    }

    private async Task<IEnumerable<MenuItemRankingDto>> ToRankingDtos(IEnumerable<MenuItem> items)
    {
        var result = new List<MenuItemRankingDto>();
        int position = 1;

        foreach (var item in items)
        {
            var kiosk = await _kioskRepository.GetByIdAsync(item.KioskId);
            
            result.Add(new MenuItemRankingDto(
                item.Id,
                item.Name,
                item.Category.ToString(),
                kiosk?.Name ?? "Desconhecido",
                item.Price,
                item.Image,
                Math.Round(item.AverageRating, 1),
                item.TotalRatings,
                position++
            ));
        }

        return result;
    }

    private async Task<MenuItemDto> ToDto(MenuItem item)
    {
        var kiosk = await _kioskRepository.GetByIdAsync(item.KioskId);

        return new MenuItemDto(
            item.Id,
            item.KioskId,
            kiosk?.Name ?? "Desconhecido",
            item.Name,
            item.Description,
            item.Price,
            item.Image,
            item.Category.ToString(),
            item.IsAvailable,
            item.PreparationTime,
            Math.Round(item.AverageRating, 1),
            item.TotalRatings,
            item.CreatedAt
        );
    }
}


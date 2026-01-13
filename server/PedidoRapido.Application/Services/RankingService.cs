using PedidoRapido.Application.DTOs;
using PedidoRapido.Application.Interfaces;

namespace PedidoRapido.Application.Services;

/// <summary>
/// Serviço de Rankings.
/// Centraliza consultas de ranking público.
/// </summary>
public class RankingService : IRankingService
{
    private readonly IKioskService _kioskService;
    private readonly IMenuItemService _menuItemService;
    private readonly IEmployeeService _employeeService;

    public RankingService(
        IKioskService kioskService,
        IMenuItemService menuItemService,
        IEmployeeService employeeService)
    {
        _kioskService = kioskService;
        _menuItemService = menuItemService;
        _employeeService = employeeService;
    }

    public async Task<IEnumerable<KioskRankingDto>> GetTopKiosksAsync(int limit = 10)
    {
        return await _kioskService.GetTopRatedAsync(limit);
    }

    public async Task<IEnumerable<MenuItemRankingDto>> GetTopDishesAsync(int limit = 10)
    {
        return await _menuItemService.GetTopRatedDishesAsync(limit);
    }

    public async Task<IEnumerable<MenuItemRankingDto>> GetTopDrinksAsync(int limit = 10)
    {
        return await _menuItemService.GetTopRatedDrinksAsync(limit);
    }

    public async Task<IEnumerable<EmployeeRankingDto>> GetTopEmployeesAsync(int limit = 10)
    {
        return await _employeeService.GetTopRatedAsync(limit);
    }
}


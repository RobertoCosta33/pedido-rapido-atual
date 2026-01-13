using PedidoRapido.Application.DTOs;

namespace PedidoRapido.Application.Interfaces;

/// <summary>
/// Interface do serviço de Rankings.
/// Centraliza consultas de ranking público.
/// </summary>
public interface IRankingService
{
    Task<IEnumerable<KioskRankingDto>> GetTopKiosksAsync(int limit = 10);
    Task<IEnumerable<MenuItemRankingDto>> GetTopDishesAsync(int limit = 10);
    Task<IEnumerable<MenuItemRankingDto>> GetTopDrinksAsync(int limit = 10);
    Task<IEnumerable<EmployeeRankingDto>> GetTopEmployeesAsync(int limit = 10);
}


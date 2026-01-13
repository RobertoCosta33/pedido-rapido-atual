using PedidoRapido.Application.DTOs;

namespace PedidoRapido.Application.Interfaces;

/// <summary>
/// Interface do serviço de Rankings.
/// Centraliza consultas de ranking público.
/// </summary>
public interface IRankingService
{
    Task<IEnumerable<RankingItemDto>> GetTopKiosksAsync(int limit = 10);
    Task<IEnumerable<RankingItemDto>> GetTopProductsAsync(int limit = 10);
    Task<IEnumerable<RankingItemDto>> GetTopStaffAsync(int limit = 10);
}


using PedidoRapido.Application.DTOs;

namespace PedidoRapido.Application.Interfaces;

/// <summary>
/// Interface do serviço de Quiosques.
/// Define as operações de negócio disponíveis.
/// </summary>
public interface IKioskService
{
    Task<KioskDto?> GetByIdAsync(Guid id);
    Task<KioskDto?> GetBySlugAsync(string slug);
    Task<IEnumerable<KioskDto>> GetAllAsync();
    Task<IEnumerable<KioskDto>> GetActiveAsync();
    Task<KioskDto> CreateAsync(CreateKioskDto dto);
    Task<KioskDto> UpdateAsync(Guid id, UpdateKioskDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<IEnumerable<KioskRankingDto>> GetTopRatedAsync(int limit = 10);
}


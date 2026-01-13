using PedidoRapido.Domain.Entities;

namespace PedidoRapido.Domain.Interfaces;

/// <summary>
/// Repositório específico para Quiosques.
/// Adiciona métodos de busca especializados.
/// </summary>
public interface IKioskRepository : IRepository<Kiosk>
{
    Task<Kiosk?> GetBySlugAsync(string slug);
    Task<IEnumerable<Kiosk>> GetByOwnerIdAsync(Guid ownerId);
    Task<IEnumerable<Kiosk>> GetByCityAsync(string city);
    Task<IEnumerable<Kiosk>> GetActiveKiosksAsync();
}


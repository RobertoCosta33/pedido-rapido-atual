using PedidoRapido.Domain.Entities;

namespace PedidoRapido.Domain.Interfaces;

/// <summary>
/// Interface genérica de repositório.
/// Define operações CRUD básicas que todos os repositórios implementam.
/// </summary>
public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task<T> UpdateAsync(T entity);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
}


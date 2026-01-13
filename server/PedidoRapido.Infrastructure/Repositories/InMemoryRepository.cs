using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;

namespace PedidoRapido.Infrastructure.Repositories;

/// <summary>
/// Repositório genérico in-memory.
/// Base para todos os repositórios específicos.
/// Facilita futura troca por EF Core.
/// </summary>
public class InMemoryRepository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly List<T> _data = new();
    protected readonly object _lock = new();

    public virtual Task<T?> GetByIdAsync(Guid id)
    {
        lock (_lock)
        {
            var entity = _data.FirstOrDefault(e => e.Id == id);
            return Task.FromResult(entity);
        }
    }

    public virtual Task<IEnumerable<T>> GetAllAsync()
    {
        lock (_lock)
        {
            return Task.FromResult<IEnumerable<T>>(_data.ToList());
        }
    }

    public virtual Task<T> AddAsync(T entity)
    {
        lock (_lock)
        {
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            _data.Add(entity);
            return Task.FromResult(entity);
        }
    }

    public virtual Task<T> UpdateAsync(T entity)
    {
        lock (_lock)
        {
            var index = _data.FindIndex(e => e.Id == entity.Id);
            if (index >= 0)
            {
                entity.UpdatedAt = DateTime.UtcNow;
                _data[index] = entity;
            }
            return Task.FromResult(entity);
        }
    }

    public virtual Task<bool> DeleteAsync(Guid id)
    {
        lock (_lock)
        {
            var entity = _data.FirstOrDefault(e => e.Id == id);
            if (entity != null)
            {
                _data.Remove(entity);
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }
    }

    public virtual Task<bool> ExistsAsync(Guid id)
    {
        lock (_lock)
        {
            return Task.FromResult(_data.Any(e => e.Id == id));
        }
    }

    /// <summary>
    /// Adiciona dados de seed (para uso interno)
    /// </summary>
    public void Seed(IEnumerable<T> entities)
    {
        lock (_lock)
        {
            _data.AddRange(entities);
        }
    }
}


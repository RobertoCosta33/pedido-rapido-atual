using Microsoft.EntityFrameworkCore;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;
using PedidoRapido.Infrastructure.Data;

namespace PedidoRapido.Infrastructure.Repositories;

/// <summary>
/// Repositório genérico usando Entity Framework Core.
/// Implementa IRepository<T> mantendo compatibilidade total com a interface existente.
/// </summary>
public class EFRepository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly PedidoRapidoDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public EFRepository(PedidoRapidoDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public virtual async Task<T?> GetByIdAsync(Guid id)
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public virtual async Task<T> AddAsync(T entity)
    {
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;
        
        _dbSet.Add(entity);
        await _context.SaveChangesAsync();
        
        return entity;
    }

    public virtual async Task<T> UpdateAsync(T entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
        
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
        
        return entity;
    }

    public virtual async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _dbSet.FindAsync(id);
        if (entity == null)
            return false;

        _dbSet.Remove(entity);
        await _context.SaveChangesAsync();
        
        return true;
    }

    public virtual async Task<bool> ExistsAsync(Guid id)
    {
        return await _dbSet.AnyAsync(e => e.Id == id);
    }
}
namespace PedidoRapido.Domain.Entities;

/// <summary>
/// Entidade base que todas as outras entidades herdam.
/// Contém propriedades comuns como Id, CreatedAt, UpdatedAt.
/// </summary>
public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}


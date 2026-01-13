using Microsoft.EntityFrameworkCore;
using PedidoRapido.Domain.Entities;

namespace PedidoRapido.Infrastructure.Data;

/// <summary>
/// DbContext principal do sistema Pedido Rápido.
/// Configura todas as entidades e relacionamentos usando Fluent API.
/// </summary>
public class PedidoRapidoDbContext : DbContext
{
    public PedidoRapidoDbContext(DbContextOptions<PedidoRapidoDbContext> options) : base(options)
    {
    }

    // DbSets para todas as entidades
    public DbSet<User> Users { get; set; }
    public DbSet<Kiosk> Kiosks { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<MenuItem> MenuItems { get; set; }
    public DbSet<Rating> Ratings { get; set; }
    public DbSet<Plan> Plans { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurar convenções globais
        ConfigureGlobalConventions(modelBuilder);

        // Configurar cada entidade
        ConfigureUser(modelBuilder);
        ConfigureKiosk(modelBuilder);
        ConfigureEmployee(modelBuilder);
        ConfigureMenuItem(modelBuilder);
        ConfigureRating(modelBuilder);
        ConfigurePlan(modelBuilder);
        ConfigureSubscription(modelBuilder);
    }

    /// <summary>
    /// Configurações globais aplicadas a todas as entidades
    /// </summary>
    private void ConfigureGlobalConventions(ModelBuilder modelBuilder)
    {
        // Usar snake_case para nomes de tabelas e colunas
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            // Nome da tabela em snake_case
            entity.SetTableName(ToSnakeCase(entity.GetTableName()));

            // Nomes das colunas em snake_case
            foreach (var property in entity.GetProperties())
            {
                property.SetColumnName(ToSnakeCase(property.Name));
            }

            // Nomes das chaves estrangeiras em snake_case
            foreach (var key in entity.GetKeys())
            {
                key.SetName(ToSnakeCase(key.GetName()));
            }

            // Nomes dos índices em snake_case
            foreach (var index in entity.GetIndexes())
            {
                index.SetDatabaseName(ToSnakeCase(index.GetDatabaseName()));
            }
        }
    }

    /// <summary>
    /// Configuração da entidade User
    /// </summary>
    private void ConfigureUser(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            // Chave primária
            entity.HasKey(e => e.Id);

            // Propriedades obrigatórias
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(e => e.PasswordHash)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(e => e.Phone)
                .HasMaxLength(20);

            // Enum como string
            entity.Property(e => e.Role)
                .HasConversion<string>()
                .IsRequired();

            // Índices
            entity.HasIndex(e => e.Email)
                .IsUnique()
                .HasDatabaseName("ix_users_email");

            entity.HasIndex(e => e.Role)
                .HasDatabaseName("ix_users_role");

            // Relacionamento com Kiosk (opcional)
            entity.HasOne(e => e.Kiosk)
                .WithMany()
                .HasForeignKey(e => e.KioskId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }

    /// <summary>
    /// Configuração da entidade Kiosk
    /// </summary>
    private void ConfigureKiosk(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Kiosk>(entity =>
        {
            // Chave primária
            entity.HasKey(e => e.Id);

            // Propriedades obrigatórias
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.Slug)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.Description)
                .HasMaxLength(1000);

            // URLs e imagens
            entity.Property(e => e.Logo)
                .HasMaxLength(500);

            entity.Property(e => e.CoverImage)
                .HasMaxLength(500);

            // Endereço
            entity.Property(e => e.Street)
                .HasMaxLength(200);

            entity.Property(e => e.Number)
                .HasMaxLength(20);

            entity.Property(e => e.Complement)
                .HasMaxLength(100);

            entity.Property(e => e.Neighborhood)
                .HasMaxLength(100);

            entity.Property(e => e.City)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.State)
                .IsRequired()
                .HasMaxLength(2);

            entity.Property(e => e.ZipCode)
                .HasMaxLength(10);

            // Contato
            entity.Property(e => e.Phone)
                .HasMaxLength(20);

            entity.Property(e => e.WhatsApp)
                .HasMaxLength(20);

            entity.Property(e => e.Email)
                .HasMaxLength(255);

            entity.Property(e => e.Instagram)
                .HasMaxLength(100);

            // Índices
            entity.HasIndex(e => e.Slug)
                .IsUnique()
                .HasDatabaseName("ix_kiosks_slug");

            entity.HasIndex(e => e.City)
                .HasDatabaseName("ix_kiosks_city");

            entity.HasIndex(e => e.OwnerId)
                .HasDatabaseName("ix_kiosks_owner_id");

            entity.HasIndex(e => e.IsActive)
                .HasDatabaseName("ix_kiosks_is_active");

            // Relacionamento com Owner (User)
            entity.HasOne(e => e.Owner)
                .WithMany()
                .HasForeignKey(e => e.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relacionamentos um-para-muitos
            entity.HasMany(e => e.Employees)
                .WithOne(e => e.Kiosk)
                .HasForeignKey(e => e.KioskId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.MenuItems)
                .WithOne(e => e.Kiosk)
                .HasForeignKey(e => e.KioskId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relacionamento um-para-um com Subscription
            entity.HasOne(e => e.Subscription)
                .WithOne(e => e.Kiosk)
                .HasForeignKey<Subscription>(e => e.KioskId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    /// <summary>
    /// Configuração da entidade Employee
    /// </summary>
    private void ConfigureEmployee(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Employee>(entity =>
        {
            // Chave primária
            entity.HasKey(e => e.Id);

            // Propriedades obrigatórias
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.Phone)
                .HasMaxLength(20);

            entity.Property(e => e.Email)
                .HasMaxLength(255);

            entity.Property(e => e.Document)
                .HasMaxLength(20);

            entity.Property(e => e.WorkSchedule)
                .HasMaxLength(100);

            entity.Property(e => e.Photo)
                .HasMaxLength(500);

            // Enum como string
            entity.Property(e => e.Role)
                .HasConversion<string>()
                .IsRequired();

            // Decimal com precisão
            entity.Property(e => e.Salary)
                .HasPrecision(10, 2);

            // Campos calculados (não mapeados no banco, calculados em runtime)
            entity.Property(e => e.AverageRating)
                .HasPrecision(3, 2);

            // Índices
            entity.HasIndex(e => e.KioskId)
                .HasDatabaseName("ix_employees_kiosk_id");

            entity.HasIndex(e => e.Role)
                .HasDatabaseName("ix_employees_role");

            entity.HasIndex(e => e.IsActive)
                .HasDatabaseName("ix_employees_is_active");
        });
    }

    /// <summary>
    /// Configuração da entidade MenuItem
    /// </summary>
    private void ConfigureMenuItem(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MenuItem>(entity =>
        {
            // Chave primária
            entity.HasKey(e => e.Id);

            // Propriedades obrigatórias
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.Description)
                .HasMaxLength(500);

            entity.Property(e => e.Image)
                .HasMaxLength(500);

            // Decimal com precisão
            entity.Property(e => e.Price)
                .HasPrecision(10, 2)
                .IsRequired();

            // Enum como string
            entity.Property(e => e.Category)
                .HasConversion<string>()
                .IsRequired();

            // Campos calculados
            entity.Property(e => e.AverageRating)
                .HasPrecision(3, 2);

            // Índices
            entity.HasIndex(e => e.KioskId)
                .HasDatabaseName("ix_menu_items_kiosk_id");

            entity.HasIndex(e => e.Category)
                .HasDatabaseName("ix_menu_items_category");

            entity.HasIndex(e => e.IsAvailable)
                .HasDatabaseName("ix_menu_items_is_available");

            entity.HasIndex(e => e.IsActive)
                .HasDatabaseName("ix_menu_items_is_active");
        });
    }

    /// <summary>
    /// Configuração da entidade Rating
    /// </summary>
    private void ConfigureRating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Rating>(entity =>
        {
            // Chave primária
            entity.HasKey(e => e.Id);

            // Propriedades obrigatórias
            entity.Property(e => e.UserId)
                .IsRequired();

            entity.Property(e => e.TargetId)
                .IsRequired();

            entity.Property(e => e.Score)
                .IsRequired();

            entity.Property(e => e.Comment)
                .HasMaxLength(1000);

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            // Enum como string
            entity.Property(e => e.TargetType)
                .HasConversion<string>()
                .IsRequired();

            // Índice único composto: um usuário não pode avaliar o mesmo alvo mais de uma vez
            entity.HasIndex(e => new { e.UserId, e.TargetType, e.TargetId })
                .IsUnique()
                .HasDatabaseName("ix_ratings_user_target_unique");

            // Índices para performance
            entity.HasIndex(e => new { e.TargetType, e.TargetId })
                .HasDatabaseName("ix_ratings_target_type_id");

            entity.HasIndex(e => e.UserId)
                .HasDatabaseName("ix_ratings_user_id");

            entity.HasIndex(e => e.CreatedAt)
                .HasDatabaseName("ix_ratings_created_at");

            entity.HasIndex(e => e.Score)
                .HasDatabaseName("ix_ratings_score");

            // Relacionamento com User
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    /// <summary>
    /// Configuração da entidade Plan
    /// </summary>
    private void ConfigurePlan(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Plan>(entity =>
        {
            // Chave primária
            entity.HasKey(e => e.Id);

            // Propriedades obrigatórias
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.Slug)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.Description)
                .HasMaxLength(500);

            // Preços com precisão
            entity.Property(e => e.MonthlyPrice)
                .HasPrecision(10, 2);

            entity.Property(e => e.SemiannualPrice)
                .HasPrecision(10, 2);

            entity.Property(e => e.AnnualPrice)
                .HasPrecision(10, 2);

            // Índices
            entity.HasIndex(e => e.Slug)
                .IsUnique()
                .HasDatabaseName("ix_plans_slug");

            entity.HasIndex(e => e.IsActive)
                .HasDatabaseName("ix_plans_is_active");

            entity.HasIndex(e => e.DisplayOrder)
                .HasDatabaseName("ix_plans_display_order");
        });
    }

    /// <summary>
    /// Configuração da entidade Subscription
    /// </summary>
    private void ConfigureSubscription(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Subscription>(entity =>
        {
            // Chave primária
            entity.HasKey(e => e.Id);

            // Enums como string
            entity.Property(e => e.Status)
                .HasConversion<string>()
                .IsRequired();

            entity.Property(e => e.BillingCycle)
                .HasConversion<string>()
                .IsRequired();

            // Preços com precisão
            entity.Property(e => e.Price)
                .HasPrecision(10, 2);

            entity.Property(e => e.TotalPaid)
                .HasPrecision(10, 2);

            // Índices
            entity.HasIndex(e => e.KioskId)
                .IsUnique()
                .HasDatabaseName("ix_subscriptions_kiosk_id");

            entity.HasIndex(e => e.PlanId)
                .HasDatabaseName("ix_subscriptions_plan_id");

            entity.HasIndex(e => e.Status)
                .HasDatabaseName("ix_subscriptions_status");

            entity.HasIndex(e => e.ExpiryDate)
                .HasDatabaseName("ix_subscriptions_expiry_date");

            // Relacionamento com Plan
            entity.HasOne(e => e.Plan)
                .WithMany()
                .HasForeignKey(e => e.PlanId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    /// <summary>
    /// Converte PascalCase para snake_case
    /// </summary>
    private static string ToSnakeCase(string? input)
    {
        if (string.IsNullOrEmpty(input))
            return string.Empty;

        var result = string.Empty;
        for (int i = 0; i < input.Length; i++)
        {
            if (char.IsUpper(input[i]) && i > 0)
                result += "_";
            result += char.ToLower(input[i]);
        }
        return result;
    }
}
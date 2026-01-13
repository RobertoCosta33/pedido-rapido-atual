using PedidoRapido.Domain.Entities;
using PedidoRapido.Infrastructure.Repositories;

namespace PedidoRapido.Infrastructure.Seed;

/// <summary>
/// Gera dados realistas para desenvolvimento e testes.
/// Simula um ambiente de produção com quiosques, funcionários, cardápio e avaliações.
/// </summary>
public static class DataSeeder
{
    private static readonly Random _random = new(42); // Seed fixo para reprodutibilidade

    private static readonly string[] Cities = 
    { 
        "Santos", "Guarujá", "Rio de Janeiro", "Florianópolis", 
        "Salvador", "Recife", "Fortaleza", "Natal", "Cabo Frio", "Búzios"
    };

    private static readonly string[] States = 
    { 
        "SP", "SP", "RJ", "SC", "BA", "PE", "CE", "RN", "RJ", "RJ"
    };

    private static readonly string[] KioskNames = 
    {
        "Quiosque Sol Nascente", "Bar do Coqueiro", "Recanto da Praia",
        "Onda Azul", "Areia Dourada", "Brisa do Mar", "Pôr do Sol",
        "Maré Alta", "Refúgio Tropical", "Baía Serena", "Costa Verde",
        "Horizonte Azul", "Pérola do Mar", "Vento Sul", "Estrela do Mar",
        "Sabor do Mar", "Maresia Bar", "Canto da Sereia", "Praia Viva", "Oásis Beach"
    };

    private static readonly string[] FirstNames = 
    {
        "João", "Maria", "Pedro", "Ana", "Carlos", "Juliana", "Lucas", "Fernanda",
        "Gabriel", "Amanda", "Rafael", "Camila", "Bruno", "Larissa", "Diego",
        "Patricia", "Thiago", "Beatriz", "Gustavo", "Mariana", "Felipe", "Carolina"
    };

    private static readonly string[] LastNames = 
    {
        "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Almeida",
        "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Araújo"
    };

    private static readonly string[] DishNames = 
    {
        "Moqueca de Peixe", "Camarão à Baiana", "Lagosta Grelhada",
        "Filé de Peixe", "Casquinha de Siri", "Bolinho de Bacalhau",
        "Peixe Frito", "Camarão Empanado", "Polvo à Vinagrete",
        "Isca de Peixe", "Arroz de Marisco", "Bobó de Camarão"
    };

    private static readonly string[] DrinkNames = 
    {
        "Caipirinha de Limão", "Caipirinha de Maracujá", "Água de Coco",
        "Cerveja Gelada", "Suco de Laranja", "Mojito",
        "Piña Colada", "Chopp Pilsen", "Vinho Branco Gelado"
    };

    private static readonly string[] Comments = 
    {
        "Excelente atendimento! Voltarei sempre.",
        "Comida deliciosa, ambiente agradável.",
        "Bom custo-benefício.",
        "Atendimento rápido e eficiente.",
        "Local muito bonito, recomendo!",
        "Garçom muito atencioso.",
        "Pratos bem servidos.",
        "Drinks maravilhosos!",
        "Preço justo pela qualidade.",
        "Vista incrível para o mar."
    };

    /// <summary>
    /// Popula todos os repositórios com dados realistas
    /// </summary>
    public static void SeedAll(
        InMemoryRepository<Plan> planRepo,
        InMemoryRepository<Kiosk> kioskRepo,
        InMemoryRepository<Employee> employeeRepo,
        InMemoryRepository<MenuItem> menuItemRepo,
        InMemoryRepository<Rating> ratingRepo,
        InMemoryRepository<Subscription> subscriptionRepo,
        InMemoryRepository<User> userRepo)
    {
        var plans = GeneratePlans();
        planRepo.Seed(plans);

        var users = GenerateUsers(100);
        userRepo.Seed(users);

        var kiosks = GenerateKiosks(20, users);
        kioskRepo.Seed(kiosks);

        var subscriptions = GenerateSubscriptions(kiosks, plans);
        subscriptionRepo.Seed(subscriptions);

        var employees = GenerateEmployees(kiosks);
        employeeRepo.Seed(employees);

        var menuItems = GenerateMenuItems(kiosks);
        menuItemRepo.Seed(menuItems);

        var ratings = GenerateRatings(kiosks, employees, menuItems, users);
        ratingRepo.Seed(ratings);

        // Atualizar médias de avaliação
        UpdateAverageRatings(employees, menuItems, ratings);
    }

    private static List<Plan> GeneratePlans()
    {
        return new List<Plan>
        {
            new Plan
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                Name = "Free",
                Slug = "free",
                Description = "Trial estendido - Experimente por 14 dias",
                MonthlyPrice = 0,
                SemiannualPrice = 0,
                AnnualPrice = 0,
                MaxKiosks = 1,
                MaxProducts = 20,
                MaxOrdersPerMonth = -1,
                MaxEmployees = 0,
                HasStockManagement = false,
                HasEmployeeManagement = false,
                HasPublicRanking = true, // Apenas ranking público
                HasAnalytics = false,
                HasPrioritySupport = false,
                IsHighlightedInRanking = false,
                DisplayOrder = 0,
                IsPopular = false
            },
            new Plan
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                Name = "Basic",
                Slug = "basic",
                Description = "Ideal para quiosques iniciantes",
                MonthlyPrice = 49.00m,
                SemiannualPrice = 259.00m,
                AnnualPrice = 499.00m,
                MaxKiosks = 1,
                MaxProducts = 100,
                MaxOrdersPerMonth = -1,
                MaxEmployees = 5,
                HasStockManagement = true, // Estoque básico
                HasEmployeeManagement = true,
                HasPublicRanking = true, // Ranking completo
                HasAnalytics = false,
                HasPrioritySupport = false,
                IsHighlightedInRanking = false,
                DisplayOrder = 1,
                IsPopular = false
            },
            new Plan
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                Name = "Pro",
                Slug = "pro",
                Description = "Recomendado - Para quiosques em crescimento",
                MonthlyPrice = 99.00m,
                SemiannualPrice = 529.00m,
                AnnualPrice = 999.00m,
                MaxKiosks = 3, // Até 3 quiosques
                MaxProducts = -1, // Ilimitado
                MaxOrdersPerMonth = -1,
                MaxEmployees = 15,
                HasStockManagement = true, // Alertas de estoque
                HasEmployeeManagement = true,
                HasPublicRanking = true,
                HasAnalytics = true, // Relatórios
                HasPrioritySupport = false,
                IsHighlightedInRanking = true, // Destaque no ranking
                DisplayOrder = 2,
                IsPopular = true // Recomendado
            },
            new Plan
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000004"),
                Name = "Premium",
                Slug = "premium",
                Description = "Solução completa para grandes operações",
                MonthlyPrice = 199.00m,
                SemiannualPrice = 0, // Não oferece semestral
                AnnualPrice = 1099.00m,
                MaxKiosks = -1, // Ilimitado
                MaxProducts = -1, // Ilimitado
                MaxOrdersPerMonth = -1,
                MaxEmployees = -1, // Ilimitado
                HasStockManagement = true,
                HasEmployeeManagement = true,
                HasPublicRanking = true,
                HasAnalytics = true,
                HasPrioritySupport = true, // Suporte prioritário
                IsHighlightedInRanking = true, // Destaque no ranking
                DisplayOrder = 3,
                IsPopular = false
            }
        };
    }

    private static List<User> GenerateUsers(int count)
    {
        var users = new List<User>();

        // Super Admin
        users.Add(new User
        {
            Id = Guid.Parse("00000000-0000-0000-0001-000000000001"),
            Name = "Admin Sistema",
            Email = "admin@pedidorapido.com",
            PasswordHash = "hashed_password",
            Role = UserRole.SuperAdmin
        });

        // Gerar usuários normais
        for (int i = 0; i < count - 1; i++)
        {
            var firstName = FirstNames[_random.Next(FirstNames.Length)];
            var lastName = LastNames[_random.Next(LastNames.Length)];

            users.Add(new User
            {
                Id = Guid.NewGuid(),
                Name = $"{firstName} {lastName}",
                Email = $"{firstName.ToLower()}.{lastName.ToLower()}{i}@email.com",
                PasswordHash = "hashed_password",
                Role = i < 20 ? UserRole.Admin : UserRole.Customer,
                Phone = $"(11) 9{_random.Next(1000, 9999)}-{_random.Next(1000, 9999)}"
            });
        }

        return users;
    }

    private static List<Kiosk> GenerateKiosks(int count, List<User> users)
    {
        var kiosks = new List<Kiosk>();
        var admins = users.Where(u => u.Role == UserRole.Admin).ToList();

        for (int i = 0; i < count; i++)
        {
            var cityIndex = i % Cities.Length;
            var name = $"{KioskNames[i % KioskNames.Length]} {Cities[cityIndex]}";
            var slug = GenerateSlug(name);

            var kiosk = new Kiosk
            {
                Id = Guid.NewGuid(),
                Name = name,
                Slug = slug,
                Description = $"O melhor quiosque de {Cities[cityIndex]}. Especializado em frutos do mar frescos e drinks tropicais.",
                Logo = $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(name)}&size=200&background=random",
                CoverImage = $"https://picsum.photos/seed/{slug}/1200/400",
                City = Cities[cityIndex],
                State = States[cityIndex],
                Street = "Av. Beira Mar",
                Number = _random.Next(100, 5000).ToString(),
                Neighborhood = "Centro",
                ZipCode = $"{_random.Next(10000, 99999)}-{_random.Next(100, 999)}",
                Phone = $"({_random.Next(11, 99)}) {_random.Next(3000, 3999)}-{_random.Next(1000, 9999)}",
                WhatsApp = $"({_random.Next(11, 99)}) 9{_random.Next(7000, 9999)}-{_random.Next(1000, 9999)}",
                Email = $"contato@{slug.Replace("-", "")[..Math.Min(15, slug.Replace("-", "").Length)]}.com.br",
                AllowOnlineOrders = true,
                EstimatedPrepTime = _random.Next(10, 30),
                OwnerId = admins[i % admins.Count].Id
            };

            // Atualizar o usuário com o kioskId
            admins[i % admins.Count].KioskId = kiosk.Id;

            kiosks.Add(kiosk);
        }

        return kiosks;
    }

    private static List<Subscription> GenerateSubscriptions(List<Kiosk> kiosks, List<Plan> plans)
    {
        var subscriptions = new List<Subscription>();

        foreach (var kiosk in kiosks)
        {
            // Distribuir planos: 10% Free, 30% Basic, 40% Pro, 20% Premium
            var planIndex = _random.NextDouble() switch
            {
                < 0.1 => 0,
                < 0.4 => 1,
                < 0.8 => 2,
                _ => 3
            };

            var plan = plans[planIndex];
            var billingCycle = (BillingCycle)_random.Next(3);

            subscriptions.Add(new Subscription
            {
                Id = Guid.NewGuid(),
                KioskId = kiosk.Id,
                PlanId = plan.Id,
                Plan = plan,
                Status = SubscriptionStatus.Active,
                BillingCycle = billingCycle,
                StartDate = DateTime.UtcNow.AddMonths(-_random.Next(1, 12)),
                ExpiryDate = DateTime.UtcNow.AddMonths(_random.Next(1, 12)),
                AutoRenew = _random.NextDouble() > 0.3,
                Price = billingCycle switch
                {
                    BillingCycle.Monthly => plan.MonthlyPrice,
                    BillingCycle.Semiannual => plan.SemiannualPrice,
                    _ => plan.AnnualPrice
                }
            });
        }

        return subscriptions;
    }

    private static List<Employee> GenerateEmployees(List<Kiosk> kiosks)
    {
        var employees = new List<Employee>();

        foreach (var kiosk in kiosks)
        {
            var empCount = _random.Next(2, 6);
            for (int i = 0; i < empCount; i++)
            {
                var firstName = FirstNames[_random.Next(FirstNames.Length)];
                var lastName = LastNames[_random.Next(LastNames.Length)];

                employees.Add(new Employee
                {
                    Id = Guid.NewGuid(),
                    KioskId = kiosk.Id,
                    Name = $"{firstName} {lastName}",
                    Role = (EmployeeRole)_random.Next(5),
                    Phone = $"(11) 9{_random.Next(1000, 9999)}-{_random.Next(1000, 9999)}",
                    Email = $"{firstName.ToLower()}.{lastName.ToLower()}@email.com",
                    Document = $"{_random.Next(100, 999)}.{_random.Next(100, 999)}.{_random.Next(100, 999)}-{_random.Next(10, 99)}",
                    HireDate = DateTime.UtcNow.AddMonths(-_random.Next(1, 36)),
                    Salary = _random.Next(1500, 4000),
                    WorkSchedule = "08:00 - 16:00",
                    Photo = $"https://i.pravatar.cc/150?u={Guid.NewGuid()}"
                });
            }
        }

        return employees;
    }

    private static List<MenuItem> GenerateMenuItems(List<Kiosk> kiosks)
    {
        var items = new List<MenuItem>();

        foreach (var kiosk in kiosks)
        {
            // Pratos
            foreach (var dish in DishNames)
            {
                items.Add(new MenuItem
                {
                    Id = Guid.NewGuid(),
                    KioskId = kiosk.Id,
                    Name = dish,
                    Description = $"Delicioso {dish.ToLower()} preparado com ingredientes frescos.",
                    Price = _random.Next(35, 120),
                    Image = $"https://picsum.photos/seed/{dish.Replace(" ", "")}{kiosk.Id}/400/300",
                    Category = MenuItemCategory.Dish,
                    PreparationTime = _random.Next(15, 40),
                    IsAvailable = _random.NextDouble() > 0.1
                });
            }

            // Bebidas
            foreach (var drink in DrinkNames)
            {
                items.Add(new MenuItem
                {
                    Id = Guid.NewGuid(),
                    KioskId = kiosk.Id,
                    Name = drink,
                    Description = $"Refrescante {drink.ToLower()}, perfeito para um dia de praia.",
                    Price = _random.Next(8, 35),
                    Image = $"https://picsum.photos/seed/{drink.Replace(" ", "")}{kiosk.Id}/400/300",
                    Category = MenuItemCategory.Drink,
                    PreparationTime = _random.Next(3, 10),
                    IsAvailable = true
                });
            }
        }

        return items;
    }

    private static List<Rating> GenerateRatings(
        List<Kiosk> kiosks, 
        List<Employee> employees, 
        List<MenuItem> menuItems,
        List<User> users)
    {
        var ratings = new List<Rating>();
        var customers = users.Where(u => u.Role == UserRole.Customer).ToList();

        // Avaliações de quiosques
        foreach (var kiosk in kiosks)
        {
            var ratingCount = _random.Next(3, 15);
            for (int i = 0; i < ratingCount; i++)
            {
                var customer = customers[_random.Next(customers.Count)];
                ratings.Add(new Rating
                {
                    Id = Guid.NewGuid(),
                    KioskId = kiosk.Id,
                    CustomerId = customer.Id,
                    CustomerName = customer.Name,
                    Type = RatingType.Kiosk,
                    TargetId = kiosk.Id,
                    TargetName = kiosk.Name,
                    Score = _random.Next(3, 6), // 3-5 estrelas
                    Comment = _random.NextDouble() > 0.3 ? Comments[_random.Next(Comments.Length)] : null,
                    CreatedAt = DateTime.UtcNow.AddDays(-_random.Next(1, 180))
                });
            }
        }

        // Avaliações de funcionários
        foreach (var emp in employees)
        {
            var ratingCount = _random.Next(2, 10);
            for (int i = 0; i < ratingCount; i++)
            {
                var customer = customers[_random.Next(customers.Count)];
                var kiosk = kiosks.First(k => k.Id == emp.KioskId);
                ratings.Add(new Rating
                {
                    Id = Guid.NewGuid(),
                    KioskId = emp.KioskId,
                    CustomerId = customer.Id,
                    CustomerName = customer.Name,
                    Type = RatingType.Employee,
                    TargetId = emp.Id,
                    TargetName = emp.Name,
                    Score = _random.Next(3, 6),
                    Comment = _random.NextDouble() > 0.5 ? "Ótimo atendimento!" : null,
                    CreatedAt = DateTime.UtcNow.AddDays(-_random.Next(1, 180))
                });
            }
        }

        // Avaliações de pratos/bebidas
        foreach (var item in menuItems.Take(100)) // Limitar para não explodir
        {
            var ratingCount = _random.Next(2, 8);
            for (int i = 0; i < ratingCount; i++)
            {
                var customer = customers[_random.Next(customers.Count)];
                var kiosk = kiosks.First(k => k.Id == item.KioskId);
                ratings.Add(new Rating
                {
                    Id = Guid.NewGuid(),
                    KioskId = item.KioskId,
                    CustomerId = customer.Id,
                    CustomerName = customer.Name,
                    Type = RatingType.MenuItem,
                    TargetId = item.Id,
                    TargetName = item.Name,
                    Score = _random.Next(3, 6),
                    Comment = _random.NextDouble() > 0.5 ? "Delicioso!" : null,
                    CreatedAt = DateTime.UtcNow.AddDays(-_random.Next(1, 180))
                });
            }
        }

        return ratings;
    }

    private static void UpdateAverageRatings(List<Employee> employees, List<MenuItem> items, List<Rating> ratings)
    {
        foreach (var emp in employees)
        {
            var empRatings = ratings.Where(r => r.Type == RatingType.Employee && r.TargetId == emp.Id).ToList();
            if (empRatings.Count > 0)
            {
                emp.AverageRating = empRatings.Average(r => r.Score);
                emp.TotalRatings = empRatings.Count;
            }
        }

        foreach (var item in items)
        {
            var itemRatings = ratings.Where(r => r.Type == RatingType.MenuItem && r.TargetId == item.Id).ToList();
            if (itemRatings.Count > 0)
            {
                item.AverageRating = itemRatings.Average(r => r.Score);
                item.TotalRatings = itemRatings.Count;
            }
        }
    }

    private static string GenerateSlug(string name)
    {
        return name.ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("ã", "a")
            .Replace("á", "a")
            .Replace("â", "a")
            .Replace("é", "e")
            .Replace("ê", "e")
            .Replace("í", "i")
            .Replace("ó", "o")
            .Replace("ô", "o")
            .Replace("õ", "o")
            .Replace("ú", "u")
            .Replace("ç", "c");
    }
}


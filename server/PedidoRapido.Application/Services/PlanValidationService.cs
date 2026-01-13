using PedidoRapido.Application.Interfaces;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Exceptions;
using PedidoRapido.Domain.Interfaces;

namespace PedidoRapido.Application.Services;

/// <summary>
/// Serviço para validar limites de planos e assinaturas.
/// Implementa as regras de negócio de monetização.
/// </summary>
public class PlanValidationService : IPlanValidationService
{
    private readonly IUserRepository _userRepository;
    private readonly IKioskRepository _kioskRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IMenuItemRepository _menuItemRepository;
    private readonly ISubscriptionRepository _subscriptionRepository;

    public PlanValidationService(
        IUserRepository userRepository,
        IKioskRepository kioskRepository,
        IEmployeeRepository employeeRepository,
        IMenuItemRepository menuItemRepository,
        ISubscriptionRepository subscriptionRepository)
    {
        _userRepository = userRepository;
        _kioskRepository = kioskRepository;
        _employeeRepository = employeeRepository;
        _menuItemRepository = menuItemRepository;
        _subscriptionRepository = subscriptionRepository;
    }

    public async Task ValidateCanCreateKioskAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            throw new ArgumentException("Usuário não encontrado");

        // SuperAdmin pode criar quantos quiosques quiser
        if (user.Role == UserRole.SuperAdmin)
            return;

        // Buscar quiosques do usuário
        var userKiosks = await _kioskRepository.GetByOwnerIdAsync(userId);
        var currentKioskCount = userKiosks.Count();

        if (currentKioskCount == 0)
        {
            // Primeiro quiosque - sempre permitido (vai ter trial automático)
            return;
        }

        // Para quiosques adicionais, verificar plano
        var firstKiosk = userKiosks.First();
        var subscription = await _subscriptionRepository.GetByKioskIdAsync(firstKiosk.Id);
        
        if (subscription?.Plan == null)
            throw new InvalidOperationException("Plano não encontrado");

        // Verificar se assinatura está ativa
        if (subscription.ExpiryDate < DateTime.UtcNow)
            throw new SubscriptionExpiredException(subscription.ExpiryDate, subscription.Plan.Name);

        // Verificar limite de quiosques
        if (subscription.Plan.MaxKiosks != -1 && currentKioskCount >= subscription.Plan.MaxKiosks)
        {
            throw new PlanLimitExceededException(
                "Quiosques", 
                currentKioskCount, 
                subscription.Plan.MaxKiosks, 
                subscription.Plan.Name);
        }
    }

    public async Task ValidateCanCreateEmployeeAsync(Guid kioskId)
    {
        var subscription = await _subscriptionRepository.GetByKioskIdAsync(kioskId);
        if (subscription?.Plan == null)
            throw new InvalidOperationException("Plano não encontrado");

        // Verificar se assinatura está ativa
        if (subscription.ExpiryDate < DateTime.UtcNow)
            throw new SubscriptionExpiredException(subscription.ExpiryDate, subscription.Plan.Name);

        // Verificar se o plano permite funcionários
        if (subscription.Plan.MaxEmployees == 0)
        {
            throw new PlanLimitExceededException("Funcionários", subscription.Plan.Name);
        }

        // Verificar limite de funcionários
        if (subscription.Plan.MaxEmployees != -1)
        {
            var currentEmployees = await _employeeRepository.GetByKioskIdAsync(kioskId);
            var currentCount = currentEmployees.Count();

            if (currentCount >= subscription.Plan.MaxEmployees)
            {
                throw new PlanLimitExceededException(
                    "Funcionários", 
                    currentCount, 
                    subscription.Plan.MaxEmployees, 
                    subscription.Plan.Name);
            }
        }
    }

    public async Task ValidateCanCreateMenuItemAsync(Guid kioskId)
    {
        var subscription = await _subscriptionRepository.GetByKioskIdAsync(kioskId);
        if (subscription?.Plan == null)
            throw new InvalidOperationException("Plano não encontrado");

        // Verificar se assinatura está ativa
        if (subscription.ExpiryDate < DateTime.UtcNow)
            throw new SubscriptionExpiredException(subscription.ExpiryDate, subscription.Plan.Name);

        // Verificar limite de produtos
        if (subscription.Plan.MaxProducts != -1)
        {
            var currentMenuItems = await _menuItemRepository.GetByKioskIdAsync(kioskId);
            var currentCount = currentMenuItems.Count();

            if (currentCount >= subscription.Plan.MaxProducts)
            {
                throw new PlanLimitExceededException(
                    "Produtos", 
                    currentCount, 
                    subscription.Plan.MaxProducts, 
                    subscription.Plan.Name);
            }
        }
    }

    public async Task ValidateSubscriptionActiveAsync(Guid kioskId)
    {
        var subscription = await _subscriptionRepository.GetByKioskIdAsync(kioskId);
        if (subscription?.Plan == null)
            throw new InvalidOperationException("Assinatura não encontrada");

        if (subscription.ExpiryDate < DateTime.UtcNow)
            throw new SubscriptionExpiredException(subscription.ExpiryDate, subscription.Plan.Name);
    }

    public async Task<PlanLimitsInfo> GetPlanLimitsAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            throw new ArgumentException("Usuário não encontrado");

        // SuperAdmin tem limites ilimitados
        if (user.Role == UserRole.SuperAdmin)
        {
            return new PlanLimitsInfo
            {
                PlanName = "Super Admin",
                IsExpired = false,
                MaxKiosks = -1,
                MaxEmployees = -1,
                MaxMenuItems = -1,
                CanCreateEmployees = true,
                HasStockManagement = true,
                HasAnalytics = true,
                HasPrioritySupport = true
            };
        }

        // Buscar quiosques do usuário
        var userKiosks = await _kioskRepository.GetByOwnerIdAsync(userId);
        var kiosksList = userKiosks.ToList();

        if (!kiosksList.Any())
        {
            // Usuário sem quiosques - retornar limites do plano Free
            return new PlanLimitsInfo
            {
                PlanName = "Free (Trial)",
                IsExpired = false,
                CurrentKiosks = 0,
                MaxKiosks = 1,
                CurrentEmployees = 0,
                MaxEmployees = 0,
                CurrentMenuItems = 0,
                MaxMenuItems = 20,
                CanCreateEmployees = false,
                HasStockManagement = false,
                HasAnalytics = false,
                HasPrioritySupport = false
            };
        }

        // Pegar assinatura do primeiro quiosque (representa o plano do usuário)
        var firstKiosk = kiosksList.First();
        var subscription = await _subscriptionRepository.GetByKioskIdAsync(firstKiosk.Id);
        
        if (subscription?.Plan == null)
            throw new InvalidOperationException("Plano não encontrado");

        // Contar recursos atuais
        var totalEmployees = 0;
        var totalMenuItems = 0;

        foreach (var kiosk in kiosksList)
        {
            var employees = await _employeeRepository.GetByKioskIdAsync(kiosk.Id);
            var menuItems = await _menuItemRepository.GetByKioskIdAsync(kiosk.Id);
            
            totalEmployees += employees.Count();
            totalMenuItems += menuItems.Count();
        }

        return new PlanLimitsInfo
        {
            PlanName = subscription.Plan.Name,
            IsExpired = subscription.ExpiryDate < DateTime.UtcNow,
            ExpiryDate = subscription.ExpiryDate,
            
            CurrentKiosks = kiosksList.Count,
            MaxKiosks = subscription.Plan.MaxKiosks,
            
            CurrentEmployees = totalEmployees,
            MaxEmployees = subscription.Plan.MaxEmployees,
            
            CurrentMenuItems = totalMenuItems,
            MaxMenuItems = subscription.Plan.MaxProducts,
            
            CanCreateEmployees = subscription.Plan.MaxEmployees != 0,
            HasStockManagement = subscription.Plan.HasStockManagement,
            HasAnalytics = subscription.Plan.HasAnalytics,
            HasPrioritySupport = subscription.Plan.HasPrioritySupport
        };
    }
}
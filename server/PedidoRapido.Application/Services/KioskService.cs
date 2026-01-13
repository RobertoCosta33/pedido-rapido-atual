using PedidoRapido.Application.DTOs;
using PedidoRapido.Application.Interfaces;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;

namespace PedidoRapido.Application.Services;

/// <summary>
/// Serviço de Quiosques.
/// Contém regras de negócio e orquestra operações.
/// </summary>
public class KioskService : IKioskService
{
    private readonly IKioskRepository _kioskRepository;
    private readonly IRatingRepository _ratingRepository;
    private readonly ISubscriptionRepository _subscriptionRepository;
    private readonly IPlanValidationService _planValidationService;

    public KioskService(
        IKioskRepository kioskRepository,
        IRatingRepository ratingRepository,
        ISubscriptionRepository subscriptionRepository,
        IPlanValidationService planValidationService)
    {
        _kioskRepository = kioskRepository;
        _ratingRepository = ratingRepository;
        _subscriptionRepository = subscriptionRepository;
        _planValidationService = planValidationService;
    }

    public async Task<KioskDto?> GetByIdAsync(Guid id)
    {
        var kiosk = await _kioskRepository.GetByIdAsync(id);
        if (kiosk == null) return null;
        
        return await ToDto(kiosk);
    }

    public async Task<KioskDto?> GetBySlugAsync(string slug)
    {
        var kiosk = await _kioskRepository.GetBySlugAsync(slug);
        if (kiosk == null) return null;
        
        return await ToDto(kiosk);
    }

    public async Task<IEnumerable<KioskDto>> GetAllAsync()
    {
        var kiosks = await _kioskRepository.GetAllAsync();
        var result = new List<KioskDto>();
        
        foreach (var kiosk in kiosks)
        {
            result.Add(await ToDto(kiosk));
        }
        
        return result;
    }

    public async Task<IEnumerable<KioskDto>> GetActiveAsync()
    {
        var kiosks = await _kioskRepository.GetActiveKiosksAsync();
        var result = new List<KioskDto>();
        
        foreach (var kiosk in kiosks)
        {
            result.Add(await ToDto(kiosk));
        }
        
        return result;
    }

    public async Task<KioskDto> CreateAsync(CreateKioskDto dto)
    {
        // Validar se o usuário pode criar um novo quiosque
        await _planValidationService.ValidateCanCreateKioskAsync(dto.OwnerId);

        var kiosk = new Kiosk
        {
            Name = dto.Name,
            Slug = GenerateSlug(dto.Name),
            Description = dto.Description,
            Logo = dto.Logo ?? string.Empty,
            CoverImage = dto.CoverImage ?? string.Empty,
            Street = dto.Street,
            Number = dto.Number,
            Complement = dto.Complement ?? string.Empty,
            Neighborhood = dto.Neighborhood,
            City = dto.City,
            State = dto.State,
            ZipCode = dto.ZipCode,
            Phone = dto.Phone,
            WhatsApp = dto.WhatsApp ?? string.Empty,
            Email = dto.Email,
            Instagram = dto.Instagram ?? string.Empty,
            OwnerId = dto.OwnerId
        };

        var created = await _kioskRepository.AddAsync(kiosk);
        
        // Se é o primeiro quiosque do usuário, criar assinatura trial automática
        var userKiosks = await _kioskRepository.GetByOwnerIdAsync(dto.OwnerId);
        if (userKiosks.Count() == 1) // Primeiro quiosque
        {
            await CreateTrialSubscriptionAsync(created.Id);
        }
        
        return await ToDto(created);
    }

    public async Task<KioskDto> UpdateAsync(Guid id, UpdateKioskDto dto)
    {
        var kiosk = await _kioskRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Quiosque {id} não encontrado");

        if (dto.Name != null) kiosk.Name = dto.Name;
        if (dto.Description != null) kiosk.Description = dto.Description;
        if (dto.Logo != null) kiosk.Logo = dto.Logo;
        if (dto.CoverImage != null) kiosk.CoverImage = dto.CoverImage;
        if (dto.Phone != null) kiosk.Phone = dto.Phone;
        if (dto.WhatsApp != null) kiosk.WhatsApp = dto.WhatsApp;
        if (dto.Email != null) kiosk.Email = dto.Email;
        if (dto.Instagram != null) kiosk.Instagram = dto.Instagram;
        if (dto.AllowOnlineOrders.HasValue) kiosk.AllowOnlineOrders = dto.AllowOnlineOrders.Value;
        if (dto.EstimatedPrepTime.HasValue) kiosk.EstimatedPrepTime = dto.EstimatedPrepTime.Value;

        kiosk.UpdatedAt = DateTime.UtcNow;

        var updated = await _kioskRepository.UpdateAsync(kiosk);
        return await ToDto(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _kioskRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<KioskRankingDto>> GetTopRatedAsync(int limit = 10)
    {
        var topRated = await _ratingRepository.GetTopRatedAsync(RatingTargetType.Kiosk, limit);
        var result = new List<KioskRankingDto>();
        int position = 1;

        foreach (var (targetId, average, count) in topRated)
        {
            var kiosk = await _kioskRepository.GetByIdAsync(targetId);
            if (kiosk == null) continue;

            var subscription = await _subscriptionRepository.GetByKioskIdAsync(targetId);
            var isPremium = subscription?.Plan?.IsHighlightedInRanking ?? false;

            result.Add(new KioskRankingDto(
                kiosk.Id,
                kiosk.Name,
                kiosk.Slug,
                kiosk.Logo,
                kiosk.City,
                kiosk.State,
                Math.Round(average, 1),
                count,
                isPremium,
                position++
            ));
        }

        return result;
    }

    private async Task<KioskDto> ToDto(Kiosk kiosk)
    {
        var ratings = await _ratingRepository.GetByTargetAsync(RatingTargetType.Kiosk, kiosk.Id);
        var ratingsList = ratings.ToList();
        var average = ratingsList.Count > 0 ? ratingsList.Average(r => r.Score) : 0;
        
        var subscription = await _subscriptionRepository.GetByKioskIdAsync(kiosk.Id);
        var isPremium = subscription?.Plan?.IsHighlightedInRanking ?? false;

        return new KioskDto(
            kiosk.Id,
            kiosk.Name,
            kiosk.Slug,
            kiosk.Description,
            kiosk.Logo,
            kiosk.CoverImage,
            kiosk.City,
            kiosk.State,
            kiosk.Phone,
            kiosk.WhatsApp,
            kiosk.AllowOnlineOrders,
            kiosk.EstimatedPrepTime,
            Math.Round(average, 1),
            ratingsList.Count,
            isPremium,
            kiosk.CreatedAt
        );
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

    /// <summary>
    /// Cria uma assinatura trial automática de 14 dias para o primeiro quiosque
    /// </summary>
    private async Task CreateTrialSubscriptionAsync(Guid kioskId)
    {
        // Plano Free (trial de 14 dias)
        var freePlanId = Guid.Parse("00000000-0000-0000-0000-000000000001");
        
        var subscription = new Subscription
        {
            KioskId = kioskId,
            PlanId = freePlanId,
            Status = SubscriptionStatus.Active,
            BillingCycle = BillingCycle.Monthly,
            StartDate = DateTime.UtcNow,
            ExpiryDate = DateTime.UtcNow.AddDays(14), // Trial de 14 dias
            AutoRenew = false, // Trial não renova automaticamente
            Price = 0
        };

        await _subscriptionRepository.AddAsync(subscription);
    }
}


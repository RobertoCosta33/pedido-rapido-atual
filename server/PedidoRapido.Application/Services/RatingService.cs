using PedidoRapido.Application.DTOs;
using PedidoRapido.Application.Interfaces;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;

namespace PedidoRapido.Application.Services;

/// <summary>
/// Serviço de Avaliações.
/// </summary>
public class RatingService : IRatingService
{
    private readonly IRatingRepository _ratingRepository;
    private readonly IKioskRepository _kioskRepository;
    private readonly IMenuItemRepository _menuItemRepository;
    private readonly IEmployeeRepository _employeeRepository;

    public RatingService(
        IRatingRepository ratingRepository,
        IKioskRepository kioskRepository,
        IMenuItemRepository menuItemRepository,
        IEmployeeRepository employeeRepository)
    {
        _ratingRepository = ratingRepository;
        _kioskRepository = kioskRepository;
        _menuItemRepository = menuItemRepository;
        _employeeRepository = employeeRepository;
    }

    public async Task<RatingDto?> GetByIdAsync(Guid id)
    {
        var rating = await _ratingRepository.GetByIdAsync(id);
        if (rating == null) return null;
        
        return ToDto(rating);
    }

    public async Task<IEnumerable<RatingDto>> GetByKioskIdAsync(Guid kioskId)
    {
        var ratings = await _ratingRepository.GetByKioskIdAsync(kioskId);
        return ratings.Select(ToDto);
    }

    public async Task<IEnumerable<RatingDto>> GetByTargetAsync(RatingType type, Guid targetId)
    {
        var ratings = await _ratingRepository.GetByTargetAsync(type, targetId);
        return ratings.Select(ToDto);
    }

    public async Task<RatingDto> CreateAsync(CreateRatingDto dto)
    {
        // Validar que o quiosque existe
        var kiosk = await _kioskRepository.GetByIdAsync(dto.KioskId)
            ?? throw new KeyNotFoundException($"Quiosque {dto.KioskId} não encontrado");

        // Validar score
        if (dto.Score < 1 || dto.Score > 5)
            throw new ArgumentException("Score deve ser entre 1 e 5");

        var rating = new Rating
        {
            KioskId = dto.KioskId,
            CustomerId = dto.CustomerId,
            CustomerName = dto.CustomerName,
            Type = dto.Type,
            TargetId = dto.TargetId,
            TargetName = dto.TargetName,
            Score = dto.Score,
            Comment = dto.Comment
        };

        var created = await _ratingRepository.AddAsync(rating);

        // Atualizar média do alvo
        await UpdateTargetAverageAsync(dto.Type, dto.TargetId);

        return ToDto(created);
    }

    public async Task<RatingStatsDto> GetStatsAsync(Guid kioskId)
    {
        var ratings = (await _ratingRepository.GetByKioskIdAsync(kioskId)).ToList();
        
        var average = ratings.Count > 0 ? ratings.Average(r => r.Score) : 0;
        var distribution = Enumerable.Range(1, 5)
            .ToDictionary(i => i, i => ratings.Count(r => r.Score == i));
        
        var recent = ratings
            .OrderByDescending(r => r.CreatedAt)
            .Take(5)
            .Select(ToDto)
            .ToList();

        return new RatingStatsDto(
            Math.Round(average, 1),
            ratings.Count,
            distribution,
            recent
        );
    }

    public async Task<double> GetAverageAsync(RatingType type, Guid targetId)
    {
        return await _ratingRepository.GetAverageByTargetAsync(type, targetId);
    }

    private async Task UpdateTargetAverageAsync(RatingType type, Guid targetId)
    {
        var average = await _ratingRepository.GetAverageByTargetAsync(type, targetId);
        var ratings = await _ratingRepository.GetByTargetAsync(type, targetId);
        var count = ratings.Count();

        switch (type)
        {
            case RatingType.MenuItem:
                var item = await _menuItemRepository.GetByIdAsync(targetId);
                if (item != null)
                {
                    item.AverageRating = average;
                    item.TotalRatings = count;
                    await _menuItemRepository.UpdateAsync(item);
                }
                break;
            case RatingType.Employee:
                var emp = await _employeeRepository.GetByIdAsync(targetId);
                if (emp != null)
                {
                    emp.AverageRating = average;
                    emp.TotalRatings = count;
                    await _employeeRepository.UpdateAsync(emp);
                }
                break;
        }
    }

    private static RatingDto ToDto(Rating rating)
    {
        return new RatingDto(
            rating.Id,
            rating.KioskId,
            rating.Kiosk?.Name ?? "Desconhecido",
            rating.CustomerName,
            rating.Type.ToString(),
            rating.TargetId,
            rating.TargetName,
            rating.Score,
            rating.Comment,
            rating.CreatedAt
        );
    }
}


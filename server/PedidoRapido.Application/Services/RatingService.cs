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
    private readonly IUserRepository _userRepository;

    public RatingService(
        IRatingRepository ratingRepository,
        IKioskRepository kioskRepository,
        IMenuItemRepository menuItemRepository,
        IEmployeeRepository employeeRepository,
        IUserRepository userRepository)
    {
        _ratingRepository = ratingRepository;
        _kioskRepository = kioskRepository;
        _menuItemRepository = menuItemRepository;
        _employeeRepository = employeeRepository;
        _userRepository = userRepository;
    }

    public async Task<RatingDto?> GetByIdAsync(Guid id)
    {
        var rating = await _ratingRepository.GetByIdAsync(id);
        if (rating == null) return null;
        
        return await ToDtoAsync(rating);
    }

    public async Task<IEnumerable<RatingDto>> GetByTargetAsync(RatingTargetType targetType, Guid targetId)
    {
        var ratings = await _ratingRepository.GetByTargetAsync(targetType, targetId);
        var dtos = new List<RatingDto>();
        
        foreach (var rating in ratings)
        {
            dtos.Add(await ToDtoAsync(rating));
        }
        
        return dtos;
    }

    public async Task<RatingDto> CreateAsync(Guid userId, CreateRatingDto dto)
    {
        // Validar score
        if (dto.Score < 1 || dto.Score > 5)
            throw new ArgumentException("Score deve ser entre 1 e 5");

        // Verificar se usuário já avaliou este alvo
        var hasRated = await _ratingRepository.HasUserRatedTargetAsync(userId, dto.TargetType, dto.TargetId);
        if (hasRated)
            throw new InvalidOperationException("Usuário já avaliou este item");

        // Verificar se o alvo existe
        await ValidateTargetExistsAsync(dto.TargetType, dto.TargetId);

        var rating = new Rating
        {
            UserId = userId,
            TargetType = dto.TargetType,
            TargetId = dto.TargetId,
            Score = dto.Score,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _ratingRepository.AddAsync(rating);
        return await ToDtoAsync(created);
    }

    public async Task<RatingStatsDto> GetStatsAsync(RatingTargetType targetType, Guid targetId)
    {
        var ratings = (await _ratingRepository.GetByTargetAsync(targetType, targetId)).ToList();
        
        var average = ratings.Count > 0 ? ratings.Average(r => r.Score) : 0;
        var distribution = Enumerable.Range(1, 5)
            .ToDictionary(i => i, i => ratings.Count(r => r.Score == i));
        
        var recent = new List<RatingDto>();
        foreach (var rating in ratings.OrderByDescending(r => r.CreatedAt).Take(5))
        {
            recent.Add(await ToDtoAsync(rating));
        }

        return new RatingStatsDto(
            Math.Round(average, 1),
            ratings.Count,
            distribution,
            recent
        );
    }

    public async Task<double> GetAverageAsync(RatingTargetType targetType, Guid targetId)
    {
        return await _ratingRepository.GetAverageByTargetAsync(targetType, targetId);
    }

    public async Task<int> GetCountAsync(RatingTargetType targetType, Guid targetId)
    {
        return await _ratingRepository.GetCountByTargetAsync(targetType, targetId);
    }

    private async Task ValidateTargetExistsAsync(RatingTargetType targetType, Guid targetId)
    {
        switch (targetType)
        {
            case RatingTargetType.Kiosk:
                var kiosk = await _kioskRepository.GetByIdAsync(targetId);
                if (kiosk == null)
                    throw new KeyNotFoundException($"Quiosque {targetId} não encontrado");
                break;
            
            case RatingTargetType.Product:
                var product = await _menuItemRepository.GetByIdAsync(targetId);
                if (product == null)
                    throw new KeyNotFoundException($"Produto {targetId} não encontrado");
                break;
            
            case RatingTargetType.Staff:
                var staff = await _employeeRepository.GetByIdAsync(targetId);
                if (staff == null)
                    throw new KeyNotFoundException($"Funcionário {targetId} não encontrado");
                break;
            
            default:
                throw new ArgumentException($"Tipo de alvo inválido: {targetType}");
        }
    }

    private async Task<RatingDto> ToDtoAsync(Rating rating)
    {
        var user = await _userRepository.GetByIdAsync(rating.UserId);
        
        return new RatingDto(
            rating.Id,
            rating.UserId,
            user?.Name ?? "Usuário Desconhecido",
            rating.TargetType,
            rating.TargetId,
            rating.Score,
            rating.Comment,
            rating.CreatedAt
        );
    }
}


using PedidoRapido.Application.DTOs;
using PedidoRapido.Application.Interfaces;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;

namespace PedidoRapido.Application.Services;

/// <summary>
/// Serviço de Rankings.
/// Centraliza consultas de ranking público.
/// </summary>
public class RankingService : IRankingService
{
    private readonly IRatingRepository _ratingRepository;
    private readonly IKioskRepository _kioskRepository;
    private readonly IMenuItemRepository _menuItemRepository;
    private readonly IEmployeeRepository _employeeRepository;

    public RankingService(
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

    public async Task<IEnumerable<RankingItemDto>> GetTopKiosksAsync(int limit = 10)
    {
        var topRated = await _ratingRepository.GetTopRatedAsync(RatingTargetType.Kiosk, limit);
        var result = new List<RankingItemDto>();

        foreach (var (targetId, average, count) in topRated)
        {
            var kiosk = await _kioskRepository.GetByIdAsync(targetId);
            if (kiosk != null)
            {
                result.Add(new RankingItemDto(
                    kiosk.Id,
                    kiosk.Name,
                    Math.Round(average, 1),
                    count,
                    kiosk.Description,
                    kiosk.Logo
                ));
            }
        }

        return result;
    }

    public async Task<IEnumerable<RankingItemDto>> GetTopProductsAsync(int limit = 10)
    {
        var topRated = await _ratingRepository.GetTopRatedAsync(RatingTargetType.Product, limit);
        var result = new List<RankingItemDto>();

        foreach (var (targetId, average, count) in topRated)
        {
            var product = await _menuItemRepository.GetByIdAsync(targetId);
            if (product != null)
            {
                result.Add(new RankingItemDto(
                    product.Id,
                    product.Name,
                    Math.Round(average, 1),
                    count,
                    product.Description,
                    product.Image
                ));
            }
        }

        return result;
    }

    public async Task<IEnumerable<RankingItemDto>> GetTopStaffAsync(int limit = 10)
    {
        var topRated = await _ratingRepository.GetTopRatedAsync(RatingTargetType.Staff, limit);
        var result = new List<RankingItemDto>();

        foreach (var (targetId, average, count) in topRated)
        {
            var staff = await _employeeRepository.GetByIdAsync(targetId);
            if (staff != null)
            {
                result.Add(new RankingItemDto(
                    staff.Id,
                    staff.Name,
                    Math.Round(average, 1),
                    count,
                    $"{staff.Role} - {staff.Kiosk?.Name}",
                    staff.Photo
                ));
            }
        }

        return result;
    }
}


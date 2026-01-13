using Microsoft.AspNetCore.Mvc;
using PedidoRapido.Application.DTOs;
using PedidoRapido.Application.Interfaces;

namespace PedidoRapido.API.Controllers;

/// <summary>
/// Controller de Rankings Públicos.
/// Retorna os melhores avaliados em cada categoria.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class RankingController : ControllerBase
{
    private readonly IRankingService _rankingService;

    public RankingController(IRankingService rankingService)
    {
        _rankingService = rankingService;
    }

    /// <summary>
    /// Obtém ranking completo (todos os tipos)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] int limit = 10)
    {
        var kiosks = await _rankingService.GetTopKiosksAsync(limit);
        var dishes = await _rankingService.GetTopDishesAsync(limit);
        var drinks = await _rankingService.GetTopDrinksAsync(limit);
        var employees = await _rankingService.GetTopEmployeesAsync(limit);

        return Ok(new
        {
            kiosks,
            dishes,
            drinks,
            employees
        });
    }

    /// <summary>
    /// Obtém ranking dos melhores quiosques
    /// </summary>
    [HttpGet("kiosks")]
    [ProducesResponseType(typeof(IEnumerable<KioskRankingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<KioskRankingDto>>> GetTopKiosks([FromQuery] int limit = 10)
    {
        var ranking = await _rankingService.GetTopKiosksAsync(limit);
        return Ok(ranking);
    }

    /// <summary>
    /// Obtém ranking dos melhores pratos
    /// </summary>
    [HttpGet("dishes")]
    [ProducesResponseType(typeof(IEnumerable<MenuItemRankingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MenuItemRankingDto>>> GetTopDishes([FromQuery] int limit = 10)
    {
        var ranking = await _rankingService.GetTopDishesAsync(limit);
        return Ok(ranking);
    }

    /// <summary>
    /// Obtém ranking das melhores bebidas
    /// </summary>
    [HttpGet("drinks")]
    [ProducesResponseType(typeof(IEnumerable<MenuItemRankingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MenuItemRankingDto>>> GetTopDrinks([FromQuery] int limit = 10)
    {
        var ranking = await _rankingService.GetTopDrinksAsync(limit);
        return Ok(ranking);
    }

    /// <summary>
    /// Obtém ranking dos melhores funcionários
    /// </summary>
    [HttpGet("employees")]
    [ProducesResponseType(typeof(IEnumerable<EmployeeRankingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<EmployeeRankingDto>>> GetTopEmployees([FromQuery] int limit = 10)
    {
        var ranking = await _rankingService.GetTopEmployeesAsync(limit);
        return Ok(ranking);
    }
}


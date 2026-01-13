using Microsoft.AspNetCore.Mvc;
using PedidoRapido.Application.DTOs;
using PedidoRapido.Application.Interfaces;

namespace PedidoRapido.API.Controllers;

/// <summary>
/// Controller de Rankings Públicos.
/// Todos os endpoints são públicos e retornam Top 10.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class RankingsController : ControllerBase
{
    private readonly IRankingService _rankingService;
    private readonly ILogger<RankingsController> _logger;

    public RankingsController(IRankingService rankingService, ILogger<RankingsController> logger)
    {
        _rankingService = rankingService;
        _logger = logger;
    }

    /// <summary>
    /// Obtém ranking dos melhores quiosques (público)
    /// </summary>
    [HttpGet("kiosks")]
    [ProducesResponseType(typeof(IEnumerable<RankingItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<RankingItemDto>>> GetTopKiosks([FromQuery] int limit = 10)
    {
        try
        {
            if (limit <= 0 || limit > 50) limit = 10; // Limitar entre 1 e 50
            
            var rankings = await _rankingService.GetTopKiosksAsync(limit);
            return Ok(rankings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter ranking de quiosques");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Obtém ranking dos melhores produtos (público)
    /// </summary>
    [HttpGet("products")]
    [ProducesResponseType(typeof(IEnumerable<RankingItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<RankingItemDto>>> GetTopProducts([FromQuery] int limit = 10)
    {
        try
        {
            if (limit <= 0 || limit > 50) limit = 10; // Limitar entre 1 e 50
            
            var rankings = await _rankingService.GetTopProductsAsync(limit);
            return Ok(rankings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter ranking de produtos");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Obtém ranking dos melhores funcionários (público)
    /// </summary>
    [HttpGet("staff")]
    [ProducesResponseType(typeof(IEnumerable<RankingItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<RankingItemDto>>> GetTopStaff([FromQuery] int limit = 10)
    {
        try
        {
            if (limit <= 0 || limit > 50) limit = 10; // Limitar entre 1 e 50
            
            var rankings = await _rankingService.GetTopStaffAsync(limit);
            return Ok(rankings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter ranking de funcionários");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using PedidoRapido.Application.DTOs;
using PedidoRapido.Application.Interfaces;
using PedidoRapido.Domain.Entities;

namespace PedidoRapido.API.Controllers;

/// <summary>
/// Controller de Avaliações.
/// Gerencia criação e consulta de avaliações.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class RatingsController : ControllerBase
{
    private readonly IRatingService _ratingService;
    private readonly ILogger<RatingsController> _logger;

    public RatingsController(IRatingService ratingService, ILogger<RatingsController> logger)
    {
        _ratingService = ratingService;
        _logger = logger;
    }

    /// <summary>
    /// Lista avaliações de um quiosque
    /// </summary>
    [HttpGet("kiosk/{kioskId:guid}")]
    [ProducesResponseType(typeof(IEnumerable<RatingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<RatingDto>>> GetByKiosk(Guid kioskId)
    {
        var ratings = await _ratingService.GetByKioskIdAsync(kioskId);
        return Ok(ratings);
    }

    /// <summary>
    /// Lista avaliações de um alvo específico
    /// </summary>
    [HttpGet("target")]
    [ProducesResponseType(typeof(IEnumerable<RatingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<RatingDto>>> GetByTarget(
        [FromQuery] RatingType type, 
        [FromQuery] Guid targetId)
    {
        var ratings = await _ratingService.GetByTargetAsync(type, targetId);
        return Ok(ratings);
    }

    /// <summary>
    /// Obtém uma avaliação por ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(RatingDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RatingDto>> GetById(Guid id)
    {
        var rating = await _ratingService.GetByIdAsync(id);
        if (rating == null)
            return NotFound(new { message = "Avaliação não encontrada" });
        
        return Ok(rating);
    }

    /// <summary>
    /// Cria uma nova avaliação
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(RatingDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RatingDto>> Create([FromBody] CreateRatingDto dto)
    {
        try
        {
            var rating = await _ratingService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = rating.Id }, rating);
        }
        catch (KeyNotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar avaliação");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Obtém estatísticas de avaliações de um quiosque
    /// </summary>
    [HttpGet("stats/{kioskId:guid}")]
    [ProducesResponseType(typeof(RatingStatsDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<RatingStatsDto>> GetStats(Guid kioskId)
    {
        var stats = await _ratingService.GetStatsAsync(kioskId);
        return Ok(stats);
    }

    /// <summary>
    /// Obtém média de avaliação de um alvo
    /// </summary>
    [HttpGet("average")]
    [ProducesResponseType(typeof(double), StatusCodes.Status200OK)]
    public async Task<ActionResult<double>> GetAverage(
        [FromQuery] RatingType type, 
        [FromQuery] Guid targetId)
    {
        var average = await _ratingService.GetAverageAsync(type, targetId);
        return Ok(new { average = Math.Round(average, 1) });
    }
}


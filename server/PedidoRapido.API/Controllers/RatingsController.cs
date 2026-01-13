using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PedidoRapido.Application.DTOs;
using PedidoRapido.Application.Interfaces;
using PedidoRapido.Domain.Entities;
using System.Security.Claims;

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
    /// Lista avaliações de um alvo específico
    /// </summary>
    [HttpGet("target")]
    [ProducesResponseType(typeof(IEnumerable<RatingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<RatingDto>>> GetByTarget(
        [FromQuery] RatingTargetType targetType, 
        [FromQuery] Guid targetId)
    {
        var ratings = await _ratingService.GetByTargetAsync(targetType, targetId);
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
    /// Cria uma nova avaliação (requer autenticação)
    /// </summary>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(RatingDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<RatingDto>> Create([FromBody] CreateRatingDto dto)
    {
        try
        {
            // Obter userId do token JWT
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "Token inválido" });

            var rating = await _ratingService.CreateAsync(userId, dto);
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
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar avaliação");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Obtém estatísticas de avaliações de um alvo
    /// </summary>
    [HttpGet("stats")]
    [ProducesResponseType(typeof(RatingStatsDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<RatingStatsDto>> GetStats(
        [FromQuery] RatingTargetType targetType,
        [FromQuery] Guid targetId)
    {
        var stats = await _ratingService.GetStatsAsync(targetType, targetId);
        return Ok(stats);
    }

    /// <summary>
    /// Obtém média de avaliação de um alvo
    /// </summary>
    [HttpGet("average")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetAverage(
        [FromQuery] RatingTargetType targetType, 
        [FromQuery] Guid targetId)
    {
        var average = await _ratingService.GetAverageAsync(targetType, targetId);
        var count = await _ratingService.GetCountAsync(targetType, targetId);
        
        return Ok(new { 
            average = Math.Round(average, 1),
            count = count
        });
    }
}


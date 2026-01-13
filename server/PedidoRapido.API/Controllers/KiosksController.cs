using Microsoft.AspNetCore.Mvc;
using PedidoRapido.Application.DTOs;
using PedidoRapido.Application.Interfaces;

namespace PedidoRapido.API.Controllers;

/// <summary>
/// Controller de Quiosques.
/// Gerencia operações CRUD e consultas de quiosques.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class KiosksController : ControllerBase
{
    private readonly IKioskService _kioskService;
    private readonly ILogger<KiosksController> _logger;

    public KiosksController(IKioskService kioskService, ILogger<KiosksController> logger)
    {
        _kioskService = kioskService;
        _logger = logger;
    }

    /// <summary>
    /// Lista todos os quiosques
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<KioskDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<KioskDto>>> GetAll()
    {
        var kiosks = await _kioskService.GetAllAsync();
        return Ok(kiosks);
    }

    /// <summary>
    /// Lista quiosques ativos
    /// </summary>
    [HttpGet("active")]
    [ProducesResponseType(typeof(IEnumerable<KioskDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<KioskDto>>> GetActive()
    {
        var kiosks = await _kioskService.GetActiveAsync();
        return Ok(kiosks);
    }

    /// <summary>
    /// Obtém um quiosque por ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(KioskDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<KioskDto>> GetById(Guid id)
    {
        var kiosk = await _kioskService.GetByIdAsync(id);
        if (kiosk == null)
            return NotFound(new { message = "Quiosque não encontrado" });
        
        return Ok(kiosk);
    }

    /// <summary>
    /// Obtém um quiosque por slug
    /// </summary>
    [HttpGet("slug/{slug}")]
    [ProducesResponseType(typeof(KioskDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<KioskDto>> GetBySlug(string slug)
    {
        var kiosk = await _kioskService.GetBySlugAsync(slug);
        if (kiosk == null)
            return NotFound(new { message = "Quiosque não encontrado" });
        
        return Ok(kiosk);
    }

    /// <summary>
    /// Cria um novo quiosque
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(KioskDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<KioskDto>> Create([FromBody] CreateKioskDto dto)
    {
        try
        {
            var kiosk = await _kioskService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = kiosk.Id }, kiosk);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar quiosque");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Atualiza um quiosque
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(KioskDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<KioskDto>> Update(Guid id, [FromBody] UpdateKioskDto dto)
    {
        try
        {
            var kiosk = await _kioskService.UpdateAsync(id, dto);
            return Ok(kiosk);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Quiosque não encontrado" });
        }
    }

    /// <summary>
    /// Remove um quiosque
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _kioskService.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { message = "Quiosque não encontrado" });
        
        return NoContent();
    }

    /// <summary>
    /// Obtém ranking dos quiosques mais bem avaliados
    /// </summary>
    [HttpGet("ranking")]
    [ProducesResponseType(typeof(IEnumerable<KioskRankingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<KioskRankingDto>>> GetRanking([FromQuery] int limit = 10)
    {
        var ranking = await _kioskService.GetTopRatedAsync(limit);
        return Ok(ranking);
    }
}


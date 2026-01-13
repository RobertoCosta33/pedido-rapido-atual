using Microsoft.AspNetCore.Mvc;
using PedidoRapido.Application.DTOs;
using PedidoRapido.Application.Interfaces;

namespace PedidoRapido.API.Controllers;

/// <summary>
/// Controller de Planos.
/// Retorna informações sobre os planos disponíveis.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class PlansController : ControllerBase
{
    private readonly IPlanService _planService;

    public PlansController(IPlanService planService)
    {
        _planService = planService;
    }

    /// <summary>
    /// Lista todos os planos
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<PlanDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PlanDto>>> GetAll()
    {
        var plans = await _planService.GetAllAsync();
        return Ok(plans);
    }

    /// <summary>
    /// Lista planos ativos
    /// </summary>
    [HttpGet("active")]
    [ProducesResponseType(typeof(IEnumerable<PlanDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PlanDto>>> GetActive()
    {
        var plans = await _planService.GetActiveAsync();
        return Ok(plans);
    }

    /// <summary>
    /// Obtém um plano por ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(PlanDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PlanDto>> GetById(Guid id)
    {
        var plan = await _planService.GetByIdAsync(id);
        if (plan == null)
            return NotFound(new { message = "Plano não encontrado" });
        
        return Ok(plan);
    }

    /// <summary>
    /// Obtém um plano por slug
    /// </summary>
    [HttpGet("slug/{slug}")]
    [ProducesResponseType(typeof(PlanDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PlanDto>> GetBySlug(string slug)
    {
        var plan = await _planService.GetBySlugAsync(slug);
        if (plan == null)
            return NotFound(new { message = "Plano não encontrado" });
        
        return Ok(plan);
    }
}


using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PedidoRapido.Application.Interfaces;

namespace PedidoRapido.API.Controllers;

/// <summary>
/// Controller para gerenciar planos de assinatura.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PlansController : ControllerBase
{
    private readonly IPlanService _planService;

    public PlansController(IPlanService planService)
    {
        _planService = planService;
    }

    /// <summary>
    /// Lista todos os planos disponíveis
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetPlans()
    {
        try
        {
            var plans = await _planService.GetActiveAsync();
            return Ok(plans);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Obtém um plano específico por slug
    /// </summary>
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetPlanBySlug(string slug)
    {
        try
        {
            var plan = await _planService.GetBySlugAsync(slug);
            if (plan == null)
                return NotFound(new { message = "Plano não encontrado" });

            return Ok(plan);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }
}
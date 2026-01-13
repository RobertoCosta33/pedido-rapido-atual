using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PedidoRapido.Application.Interfaces;
using PedidoRapido.Domain.Exceptions;
using System.Security.Claims;

namespace PedidoRapido.API.Controllers;

/// <summary>
/// Controller para gerenciar assinaturas.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SubscriptionController : ControllerBase
{
    private readonly IPlanValidationService _planValidationService;

    public SubscriptionController(IPlanValidationService planValidationService)
    {
        _planValidationService = planValidationService;
    }

    /// <summary>
    /// Obtém informações sobre os limites do plano atual do usuário
    /// </summary>
    [HttpGet("current")]
    public async Task<IActionResult> GetCurrentSubscription()
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "Token inválido" });

            var planLimits = await _planValidationService.GetPlanLimitsAsync(userId);
            return Ok(planLimits);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Simula um upgrade de plano (sem pagamento real)
    /// </summary>
    [HttpPost("upgrade")]
    public async Task<IActionResult> UpgradePlan([FromBody] UpgradeRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "Token inválido" });

            // Por enquanto, apenas simular o upgrade
            // Em uma implementação real, aqui seria integrado com gateway de pagamento
            
            return Ok(new 
            { 
                message = "Upgrade simulado com sucesso! Em breve você receberá instruções de pagamento.",
                planRequested = request.PlanSlug,
                billingCycle = request.BillingCycle,
                status = "pending_payment"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Valida se o usuário pode executar uma ação específica
    /// </summary>
    [HttpPost("validate")]
    public async Task<IActionResult> ValidateAction([FromBody] ValidationRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "Token inválido" });

            switch (request.Action.ToLower())
            {
                case "create_kiosk":
                    await _planValidationService.ValidateCanCreateKioskAsync(userId);
                    break;
                case "create_employee":
                    if (!request.KioskId.HasValue)
                        return BadRequest(new { message = "KioskId é obrigatório para validar criação de funcionário" });
                    await _planValidationService.ValidateCanCreateEmployeeAsync(request.KioskId.Value);
                    break;
                case "create_menuitem":
                    if (!request.KioskId.HasValue)
                        return BadRequest(new { message = "KioskId é obrigatório para validar criação de produto" });
                    await _planValidationService.ValidateCanCreateMenuItemAsync(request.KioskId.Value);
                    break;
                default:
                    return BadRequest(new { message = "Ação não reconhecida" });
            }

            return Ok(new { canExecute = true, message = "Ação permitida" });
        }
        catch (PlanLimitExceededException ex)
        {
            return BadRequest(new 
            { 
                canExecute = false,
                message = ex.Message,
                limitType = ex.LimitType,
                currentCount = ex.CurrentCount,
                maxAllowed = ex.MaxAllowed,
                planName = ex.PlanName
            });
        }
        catch (SubscriptionExpiredException ex)
        {
            return BadRequest(new 
            { 
                canExecute = false,
                message = ex.Message,
                expiryDate = ex.ExpiryDate,
                planName = ex.PlanName,
                isExpired = true
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }
}

/// <summary>
/// Request para upgrade de plano
/// </summary>
public class UpgradeRequest
{
    public string PlanSlug { get; set; } = string.Empty;
    public string BillingCycle { get; set; } = "monthly"; // monthly, semiannual, annual
}

/// <summary>
/// Request para validação de ação
/// </summary>
public class ValidationRequest
{
    public string Action { get; set; } = string.Empty; // create_kiosk, create_employee, create_menuitem
    public Guid? KioskId { get; set; }
}
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PedidoRapido.Application.Interfaces;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Exceptions;
using PedidoRapido.Domain.Interfaces;
using System.Security.Claims;

namespace PedidoRapido.API.Controllers;

/// <summary>
/// Controller para gerenciar cobrança e pagamentos
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class BillingController : ControllerBase
{
    private readonly IStripeService _stripeService;
    private readonly IUserRepository _userRepository;

    public BillingController(IStripeService stripeService, IUserRepository userRepository)
    {
        _stripeService = stripeService;
        _userRepository = userRepository;
    }

    /// <summary>
    /// Cria sessão de checkout no Stripe
    /// </summary>
    [HttpPost("checkout")]
    [Authorize]
    public async Task<IActionResult> CreateCheckout([FromBody] CheckoutRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "Token inválido" });

            // Buscar usuário para obter email
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                return NotFound(new { message = "Usuário não encontrado" });

            // Validar ciclo de cobrança
            if (!Enum.TryParse<BillingCycle>(request.BillingCycle, true, out var billingCycle))
                return BadRequest(new { message = "Ciclo de cobrança inválido" });

            // Criar sessão de checkout
            var checkoutUrl = await _stripeService.CreateCheckoutSessionAsync(
                request.PlanSlug, 
                billingCycle, 
                userId, 
                user.Email
            );

            return Ok(new { checkoutUrl });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Webhook do Stripe (CRÍTICO - única fonte de verdade para pagamentos)
    /// </summary>
    [HttpPost("webhook")]
    public async Task<IActionResult> StripeWebhook()
    {
        try
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var stripeSignature = Request.Headers["Stripe-Signature"].ToString();

            if (string.IsNullOrEmpty(stripeSignature))
                return BadRequest(new { message = "Assinatura Stripe ausente" });

            await _stripeService.ProcessWebhookAsync(json, stripeSignature);

            return Ok(new { received = true });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[BILLING WEBHOOK] Erro: {ex.Message}");
            return BadRequest(new { message = "Erro no processamento do webhook" });
        }
    }

    /// <summary>
    /// Página de sucesso após pagamento (informativa)
    /// </summary>
    [HttpGet("success")]
    public IActionResult PaymentSuccess([FromQuery] string? session_id)
    {
        return Ok(new 
        { 
            message = "Pagamento processado com sucesso!",
            sessionId = session_id,
            note = "Sua assinatura será ativada em alguns minutos."
        });
    }

    /// <summary>
    /// Página de cancelamento (informativa)
    /// </summary>
    [HttpGet("cancel")]
    public IActionResult PaymentCancel()
    {
        return Ok(new 
        { 
            message = "Pagamento cancelado",
            note = "Você pode tentar novamente a qualquer momento."
        });
    }
}

/// <summary>
/// Request para criar checkout
/// </summary>
public class CheckoutRequest
{
    public string PlanSlug { get; set; } = string.Empty;
    public string BillingCycle { get; set; } = "monthly"; // monthly, semiannual, annual
}
using PedidoRapido.Domain.Entities;

namespace PedidoRapido.Application.Interfaces;

/// <summary>
/// Serviço para integração com Stripe
/// </summary>
public interface IStripeService
{
    /// <summary>
    /// Cria uma sessão de checkout no Stripe
    /// </summary>
    Task<string> CreateCheckoutSessionAsync(string planSlug, BillingCycle billingCycle, Guid userId, string userEmail);

    /// <summary>
    /// Processa webhook do Stripe
    /// </summary>
    Task ProcessWebhookAsync(string json, string stripeSignature);

    /// <summary>
    /// Obtém o Price ID do Stripe baseado no plano e ciclo
    /// </summary>
    string GetStripePriceId(string planSlug, BillingCycle billingCycle);
}
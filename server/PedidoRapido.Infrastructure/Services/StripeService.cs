using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;
using PedidoRapido.Application.Interfaces;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;
using PedidoRapido.Infrastructure.Configuration;

namespace PedidoRapido.Infrastructure.Services;

/// <summary>
/// Serviço para integração com Stripe
/// </summary>
public class StripeService : IStripeService
{
    private readonly StripeSettings _stripeSettings;
    private readonly ISubscriptionRepository _subscriptionRepository;
    private readonly IPlanRepository _planRepository;
    private readonly IKioskRepository _kioskRepository;

    public StripeService(
        IOptions<StripeSettings> stripeSettings,
        ISubscriptionRepository subscriptionRepository,
        IPlanRepository planRepository,
        IKioskRepository kioskRepository)
    {
        _stripeSettings = stripeSettings.Value;
        _subscriptionRepository = subscriptionRepository;
        _planRepository = planRepository;
        _kioskRepository = kioskRepository;

        // Configurar Stripe API Key
        StripeConfiguration.ApiKey = _stripeSettings.SecretKey;
    }

    public async Task<string> CreateCheckoutSessionAsync(string planSlug, BillingCycle billingCycle, Guid userId, string userEmail)
    {
        // Validar se o plano existe
        var plan = await _planRepository.GetBySlugAsync(planSlug);
        if (plan == null)
            throw new ArgumentException($"Plano '{planSlug}' não encontrado");

        // Obter Price ID do Stripe
        var priceId = GetStripePriceId(planSlug, billingCycle);
        if (string.IsNullOrEmpty(priceId))
            throw new ArgumentException($"Price ID não configurado para plano '{planSlug}' e ciclo '{billingCycle}'");

        // Criar sessão de checkout
        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    Price = priceId,
                    Quantity = 1,
                }
            },
            Mode = "subscription",
            SuccessUrl = "http://localhost:3000/billing/success?session_id={CHECKOUT_SESSION_ID}",
            CancelUrl = "http://localhost:3000/billing/cancel",
            CustomerEmail = userEmail,
            Metadata = new Dictionary<string, string>
            {
                { "userId", userId.ToString() },
                { "planSlug", planSlug },
                { "billingCycle", billingCycle.ToString() }
            },
            SubscriptionData = new SessionSubscriptionDataOptions
            {
                Metadata = new Dictionary<string, string>
                {
                    { "userId", userId.ToString() },
                    { "planSlug", planSlug },
                    { "billingCycle", billingCycle.ToString() }
                }
            }
        };

        var service = new SessionService();
        var session = await service.CreateAsync(options);

        return session.Url;
    }

    public async Task ProcessWebhookAsync(string json, string stripeSignature)
    {
        try
        {
            var stripeEvent = EventUtility.ConstructEvent(
                json,
                stripeSignature,
                _stripeSettings.WebhookSecret
            );

            Console.WriteLine($"[STRIPE WEBHOOK] Evento recebido: {stripeEvent.Type}");

            switch (stripeEvent.Type)
            {
                case Events.CheckoutSessionCompleted:
                    await HandleCheckoutSessionCompleted(stripeEvent);
                    break;

                case Events.InvoicePaymentSucceeded:
                    await HandleInvoicePaymentSucceeded(stripeEvent);
                    break;

                case Events.CustomerSubscriptionDeleted:
                    await HandleSubscriptionDeleted(stripeEvent);
                    break;

                default:
                    Console.WriteLine($"[STRIPE WEBHOOK] Evento não tratado: {stripeEvent.Type}");
                    break;
            }
        }
        catch (StripeException ex)
        {
            Console.WriteLine($"[STRIPE WEBHOOK] Erro na validação: {ex.Message}");
            throw;
        }
    }

    public string GetStripePriceId(string planSlug, BillingCycle billingCycle)
    {
        return planSlug.ToLower() switch
        {
            "basic" => billingCycle switch
            {
                BillingCycle.Monthly => _stripeSettings.PriceIds.Basic.Monthly,
                BillingCycle.Semiannual => _stripeSettings.PriceIds.Basic.Semiannual,
                BillingCycle.Annual => _stripeSettings.PriceIds.Basic.Annual,
                _ => string.Empty
            },
            "pro" => billingCycle switch
            {
                BillingCycle.Monthly => _stripeSettings.PriceIds.Pro.Monthly,
                BillingCycle.Semiannual => _stripeSettings.PriceIds.Pro.Semiannual,
                BillingCycle.Annual => _stripeSettings.PriceIds.Pro.Annual,
                _ => string.Empty
            },
            "premium" => billingCycle switch
            {
                BillingCycle.Monthly => _stripeSettings.PriceIds.Premium.Monthly,
                BillingCycle.Annual => _stripeSettings.PriceIds.Premium.Annual,
                _ => string.Empty
            },
            _ => string.Empty
        };
    }

    /// <summary>
    /// Trata evento de checkout completado (primeira assinatura)
    /// </summary>
    private async Task HandleCheckoutSessionCompleted(Event stripeEvent)
    {
        var session = stripeEvent.Data.Object as Session;
        if (session?.Metadata == null) return;

        if (!session.Metadata.TryGetValue("userId", out var userIdStr) ||
            !Guid.TryParse(userIdStr, out var userId))
        {
            Console.WriteLine("[STRIPE WEBHOOK] UserId não encontrado nos metadados");
            return;
        }

        if (!session.Metadata.TryGetValue("planSlug", out var planSlug) ||
            !session.Metadata.TryGetValue("billingCycle", out var billingCycleStr) ||
            !Enum.TryParse<BillingCycle>(billingCycleStr, out var billingCycle))
        {
            Console.WriteLine("[STRIPE WEBHOOK] Metadados do plano inválidos");
            return;
        }

        await ActivateSubscription(userId, planSlug, billingCycle, session.SubscriptionId);
    }

    /// <summary>
    /// Trata evento de pagamento de fatura (renovação)
    /// </summary>
    private async Task HandleInvoicePaymentSucceeded(Event stripeEvent)
    {
        var invoice = stripeEvent.Data.Object as Invoice;
        if (invoice?.SubscriptionId == null) return;

        // Buscar assinatura no Stripe para obter metadados
        var subscriptionService = new SubscriptionService();
        var stripeSubscription = await subscriptionService.GetAsync(invoice.SubscriptionId);

        if (stripeSubscription?.Metadata == null) return;

        if (!stripeSubscription.Metadata.TryGetValue("userId", out var userIdStr) ||
            !Guid.TryParse(userIdStr, out var userId))
        {
            Console.WriteLine("[STRIPE WEBHOOK] UserId não encontrado na assinatura");
            return;
        }

        await RenewSubscription(userId, stripeSubscription);
    }

    /// <summary>
    /// Trata evento de assinatura cancelada
    /// </summary>
    private async Task HandleSubscriptionDeleted(Event stripeEvent)
    {
        var subscription = stripeEvent.Data.Object as Stripe.Subscription;
        if (subscription?.Metadata == null) return;

        if (!subscription.Metadata.TryGetValue("userId", out var userIdStr) ||
            !Guid.TryParse(userIdStr, out var userId))
        {
            Console.WriteLine("[STRIPE WEBHOOK] UserId não encontrado na assinatura cancelada");
            return;
        }

        await CancelSubscription(userId);
    }

    /// <summary>
    /// Ativa uma nova assinatura
    /// </summary>
    private async Task ActivateSubscription(Guid userId, string planSlug, BillingCycle billingCycle, string? stripeSubscriptionId)
    {
        try
        {
            // Buscar plano
            var plan = await _planRepository.GetBySlugAsync(planSlug);
            if (plan == null)
            {
                Console.WriteLine($"[STRIPE WEBHOOK] Plano '{planSlug}' não encontrado");
                return;
            }

            // Buscar primeiro quiosque do usuário
            var userKiosks = await _kioskRepository.GetByOwnerIdAsync(userId);
            var firstKiosk = userKiosks.FirstOrDefault();
            if (firstKiosk == null)
            {
                Console.WriteLine($"[STRIPE WEBHOOK] Usuário {userId} não possui quiosques");
                return;
            }

            // Buscar assinatura existente
            var existingSubscription = await _subscriptionRepository.GetByKioskIdAsync(firstKiosk.Id);

            if (existingSubscription != null)
            {
                // Atualizar assinatura existente
                existingSubscription.PlanId = plan.Id;
                existingSubscription.Status = SubscriptionStatus.Active;
                existingSubscription.BillingCycle = billingCycle;
                existingSubscription.StartDate = DateTime.UtcNow;
                existingSubscription.ExpiryDate = CalculateExpiryDate(billingCycle);
                existingSubscription.AutoRenew = true;
                existingSubscription.Price = GetPlanPrice(plan, billingCycle);
                existingSubscription.UpdatedAt = DateTime.UtcNow;

                await _subscriptionRepository.UpdateAsync(existingSubscription);
            }
            else
            {
                // Criar nova assinatura
                var newSubscription = new Domain.Entities.Subscription
                {
                    KioskId = firstKiosk.Id,
                    PlanId = plan.Id,
                    Status = SubscriptionStatus.Active,
                    BillingCycle = billingCycle,
                    StartDate = DateTime.UtcNow,
                    ExpiryDate = CalculateExpiryDate(billingCycle),
                    AutoRenew = true,
                    Price = GetPlanPrice(plan, billingCycle)
                };

                await _subscriptionRepository.AddAsync(newSubscription);
            }

            Console.WriteLine($"[STRIPE WEBHOOK] Assinatura ativada: Usuário {userId}, Plano {planSlug}, Ciclo {billingCycle}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[STRIPE WEBHOOK] Erro ao ativar assinatura: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Renova uma assinatura existente
    /// </summary>
    private async Task RenewSubscription(Guid userId, Stripe.Subscription stripeSubscription)
    {
        try
        {
            // Buscar primeiro quiosque do usuário
            var userKiosks = await _kioskRepository.GetByOwnerIdAsync(userId);
            var firstKiosk = userKiosks.FirstOrDefault();
            if (firstKiosk == null) return;

            // Buscar assinatura no banco
            var subscription = await _subscriptionRepository.GetByKioskIdAsync(firstKiosk.Id);
            if (subscription == null) return;

            // Estender data de expiração
            subscription.ExpiryDate = CalculateExpiryDate(subscription.BillingCycle);
            subscription.Status = SubscriptionStatus.Active;
            subscription.UpdatedAt = DateTime.UtcNow;

            await _subscriptionRepository.UpdateAsync(subscription);

            Console.WriteLine($"[STRIPE WEBHOOK] Assinatura renovada: Usuário {userId}, Nova expiração: {subscription.ExpiryDate}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[STRIPE WEBHOOK] Erro ao renovar assinatura: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Cancela uma assinatura
    /// </summary>
    private async Task CancelSubscription(Guid userId)
    {
        try
        {
            // Buscar primeiro quiosque do usuário
            var userKiosks = await _kioskRepository.GetByOwnerIdAsync(userId);
            var firstKiosk = userKiosks.FirstOrDefault();
            if (firstKiosk == null) return;

            // Buscar assinatura no banco
            var subscription = await _subscriptionRepository.GetByKioskIdAsync(firstKiosk.Id);
            if (subscription == null) return;

            // Marcar como cancelada (mas continua ativa até expirar)
            subscription.Status = SubscriptionStatus.Cancelled;
            subscription.AutoRenew = false;
            subscription.UpdatedAt = DateTime.UtcNow;

            await _subscriptionRepository.UpdateAsync(subscription);

            Console.WriteLine($"[STRIPE WEBHOOK] Assinatura cancelada: Usuário {userId}, Expira em: {subscription.ExpiryDate}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[STRIPE WEBHOOK] Erro ao cancelar assinatura: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Calcula data de expiração baseada no ciclo de cobrança
    /// </summary>
    private static DateTime CalculateExpiryDate(BillingCycle billingCycle)
    {
        return billingCycle switch
        {
            BillingCycle.Monthly => DateTime.UtcNow.AddMonths(1),
            BillingCycle.Semiannual => DateTime.UtcNow.AddMonths(6),
            BillingCycle.Annual => DateTime.UtcNow.AddYears(1),
            _ => DateTime.UtcNow.AddMonths(1)
        };
    }

    /// <summary>
    /// Obtém preço do plano baseado no ciclo
    /// </summary>
    private static decimal GetPlanPrice(Domain.Entities.Plan plan, BillingCycle billingCycle)
    {
        return billingCycle switch
        {
            BillingCycle.Monthly => plan.MonthlyPrice,
            BillingCycle.Semiannual => plan.SemiannualPrice,
            BillingCycle.Annual => plan.AnnualPrice,
            _ => plan.MonthlyPrice
        };
    }
}
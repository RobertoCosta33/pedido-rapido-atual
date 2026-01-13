/**
 * Service de Billing
 * Consome endpoints de cobrança e Stripe da FASE E
 */

import { apiClient } from "./api";

// ============================================================================
// Types - FASE E
// ============================================================================

export interface CheckoutRequest {
  planSlug: string;
  billingCycle: "monthly" | "semiannual" | "annual";
}

export interface CheckoutResponse {
  checkoutUrl: string;
}

export interface PaymentResult {
  message: string;
  sessionId?: string;
  note?: string;
}

// ============================================================================
// Service
// ============================================================================

export const billingService = {
  /**
   * Cria sessão de checkout no Stripe (requer autenticação)
   * Endpoint: POST /api/billing/checkout
   */
  createCheckout: async (data: CheckoutRequest): Promise<CheckoutResponse> => {
    return apiClient.post<CheckoutResponse>("/billing/checkout", data);
  },

  /**
   * Página de sucesso após pagamento
   * Endpoint: GET /api/billing/success
   */
  getPaymentSuccess: async (sessionId?: string): Promise<PaymentResult> => {
    return apiClient.get<PaymentResult>("/billing/success", {
      session_id: sessionId,
    });
  },

  /**
   * Página de cancelamento
   * Endpoint: GET /api/billing/cancel
   */
  getPaymentCancel: async (): Promise<PaymentResult> => {
    return apiClient.get<PaymentResult>("/billing/cancel");
  },

  /**
   * Redireciona para checkout do Stripe
   */
  redirectToCheckout: (checkoutUrl: string): void => {
    if (typeof window !== "undefined") {
      window.location.href = checkoutUrl;
    }
  },
};

export default billingService;

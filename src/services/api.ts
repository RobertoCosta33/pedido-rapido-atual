/**
 * Cliente HTTP centralizado
 * Usa Axios com interceptors preparados para JWT futuro
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// URL base da API (variável de ambiente)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Instância do Axios configurada
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de Request
 * Adiciona token JWT quando disponível (preparado para futuro)
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obter token do localStorage (quando implementar autenticação)
    if (typeof window !== 'undefined') {
      const tokens = localStorage.getItem('pedido-rapido-tokens');
      if (tokens) {
        try {
          const parsed = JSON.parse(tokens);
          if (parsed.accessToken) {
            config.headers.Authorization = `Bearer ${parsed.accessToken}`;
          }
        } catch {
          // Token inválido, ignora
        }
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Response
 * Trata erros globais (401, 403, 500, etc)
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    // Log do erro para debug
    console.error('[API Error]', error.response?.status, error.message);

    // Tratar erros específicos
    if (error.response?.status === 401) {
      console.warn('Não autorizado - token pode estar expirado');
      
      // Limpa tokens e redireciona para login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pedido-rapido-auth');
        localStorage.removeItem('pedido-rapido-tokens');
        
        // Só redireciona se não estiver já na página de login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    if (error.response?.status === 403) {
      console.warn('Acesso negado - permissão insuficiente');
    }

    // Propagar erro com mensagem amigável
    const message = error.response?.data?.message || error.message || 'Erro na requisição';
    return Promise.reject(new Error(message));
  }
);

/**
 * API Client exportado
 * Wrapper sobre o Axios para padronizar retornos
 */
export const apiClient = {
  /**
   * GET request
   */
  get: async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
    const response = await axiosInstance.get<T>(url, { params });
    return response.data;
  },

  /**
   * POST request
   */
  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await axiosInstance.post<T>(url, data);
    return response.data;
  },

  /**
   * PUT request
   */
  put: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await axiosInstance.put<T>(url, data);
    return response.data;
  },

  /**
   * PATCH request
   */
  patch: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await axiosInstance.patch<T>(url, data);
    return response.data;
  },

  /**
   * DELETE request
   */
  delete: async <T>(url: string): Promise<T> => {
    const response = await axiosInstance.delete<T>(url);
    return response.data;
  },
};

// Manter export default para compatibilidade com código antigo
export const api = apiClient;
export default apiClient;

/**
 * Configuração base da API
 * Cliente HTTP para comunicação com backend
 */

import { ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Obtém o token de acesso do localStorage
 */
const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const tokens = localStorage.getItem('pedido-rapido-tokens');
  if (!tokens) return null;
  
  try {
    const parsed = JSON.parse(tokens);
    return parsed.accessToken;
  } catch {
    return null;
  }
};

/**
 * Constrói URL com query params
 */
const buildUrl = (endpoint: string, params?: Record<string, string | number | boolean | undefined>): string => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
};

/**
 * Cliente HTTP base
 */
const httpClient = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const { params, ...fetchOptions } = options;
  
  const token = getAccessToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  const url = buildUrl(endpoint, params);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data as ApiResponse<T>;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro desconhecido na requisição');
  }
};

/**
 * Métodos HTTP exportados
 */
export const api = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>) =>
    httpClient<T>(endpoint, { method: 'GET', params }),
  
  /**
   * POST request
   */
  post: <T>(endpoint: string, body?: unknown) =>
    httpClient<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  
  /**
   * PUT request
   */
  put: <T>(endpoint: string, body?: unknown) =>
    httpClient<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  
  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, body?: unknown) =>
    httpClient<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
  
  /**
   * DELETE request
   */
  delete: <T>(endpoint: string) =>
    httpClient<T>(endpoint, { method: 'DELETE' }),
  
  /**
   * Upload de arquivos
   */
  upload: async <T>(endpoint: string, file: File, fieldName: string = 'file'): Promise<ApiResponse<T>> => {
    const token = getAccessToken();
    const formData = new FormData();
    formData.append(fieldName, file);
    
    const headers: HeadersInit = {};
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erro no upload');
    }
    
    return data as ApiResponse<T>;
  },
};

export default api;


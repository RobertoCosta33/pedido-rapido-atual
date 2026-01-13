/**
 * Serviço de autenticação
 * Conecta com backend ASP.NET Core via JWT
 */

import { apiClient } from "./api";
import {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "@/types";

class AuthService {
  private readonly baseUrl = "/auth";

  /**
   * Realiza login com email e senha
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        `${this.baseUrl}/login`,
        credentials
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Erro ao fazer login"
      );
    }
  }

  /**
   * Registra novo usuário
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        `${this.baseUrl}/register`,
        data
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Erro ao criar conta"
      );
    }
  }

  /**
   * Valida token JWT
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      // Cria uma instância temporária do axios para não usar interceptors
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}${
          this.baseUrl
        }/validate`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Refresh do token JWT
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const response = await apiClient.post<AuthTokens>(
        `${this.baseUrl}/refresh`,
        {
          refreshToken,
        }
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Erro ao renovar token"
      );
    }
  }

  /**
   * Obtém dados do usuário atual
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>(`${this.baseUrl}/me`);
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Erro ao obter dados do usuário"
      );
    }
  }

  /**
   * Atualiza dados do usuário
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>(
        `${this.baseUrl}/profile`,
        data
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Erro ao atualizar perfil"
      );
    }
  }

  /**
   * Altera senha do usuário
   */
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/change-password`, data);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Erro ao alterar senha"
      );
    }
  }

  /**
   * Solicita reset de senha
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/forgot-password`, { email });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Erro ao solicitar reset de senha"
      );
    }
  }

  /**
   * Confirma reset de senha
   */
  async resetPassword(data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/reset-password`, data);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Erro ao redefinir senha"
      );
    }
  }

  /**
   * Logout (limpa dados locais)
   */
  logout(): void {
    // Remove dados do localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("pedido-rapido-auth");
      localStorage.removeItem("pedido-rapido-tokens");
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;

    const tokens = localStorage.getItem("pedido-rapido-tokens");
    return !!tokens;
  }

  /**
   * Obtém token atual do localStorage
   */
  getToken(): string | null {
    if (typeof window === "undefined") return null;

    try {
      const tokens = localStorage.getItem("pedido-rapido-tokens");
      if (tokens) {
        const parsed = JSON.parse(tokens);
        return parsed.accessToken || null;
      }
    } catch {
      // Token inválido
    }

    return null;
  }
}

export const authService = new AuthService();
export default authService;

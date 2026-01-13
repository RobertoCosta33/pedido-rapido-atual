'use client';

/**
 * Context para gerenciamento de autenticação
 * Implementa RBAC (Role-Based Access Control) com 3 níveis
 * Conecta com backend real via JWT
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  UserRole,
  AuthState,
  LoginCredentials,
  RegisterData,
  AuthTokens,
} from '@/types';
import { authService } from '@/services/auth.service';

interface AuthContextData extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

const AUTH_STORAGE_KEY = 'pedido-rapido-auth';
const TOKEN_STORAGE_KEY = 'pedido-rapido-tokens';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const [token, setToken] = useState<string | null>(null);

  // Carrega usuário do localStorage na inicialização
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        const storedTokens = localStorage.getItem(TOKEN_STORAGE_KEY);

        if (storedUser && storedTokens) {
          const user = JSON.parse(storedUser) as User;
          const tokens = JSON.parse(storedTokens) as AuthTokens;

          // Verifica se o token ainda é válido
          const isValid = await authService.validateToken(tokens.accessToken);

          if (isValid) {
            setToken(tokens.accessToken);
            setState({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            // Token inválido, limpa dados
            clearAuthData();
            setState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch {
        clearAuthData();
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    };

    loadStoredAuth();
  }, []);

  /**
   * Limpa dados de autenticação do localStorage
   */
  const clearAuthData = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
  };

  /**
   * Realiza login com credenciais
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const { user, tokens } = await authService.login(credentials);

      // Salva no localStorage
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
      setToken(tokens.accessToken);

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Redireciona baseado na role
      switch (user.role) {
        case 'super_admin':
          router.push('/super-admin');
          break;
        case 'admin':
          router.push('/admin');
          break;
        case 'customer':
          router.push('/menu');
          break;
        default:
          router.push('/');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [router]);

  /**
   * Registra novo usuário
   */
  const register = useCallback(async (data: RegisterData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const { user, tokens } = await authService.register(data);

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
      setToken(tokens.accessToken);

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      router.push('/menu');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [router]);

  /**
   * Realiza logout
   */
  const logout = useCallback(() => {
    // Limpa dados do localStorage
    clearAuthData();
    authService.logout();

    // Atualiza estado
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    // Redireciona para login
    router.push('/login');
  }, [router]);

  /**
   * Atualiza dados do usuário
   */
  const updateUser = useCallback((userData: Partial<User>) => {
    setState((prev) => {
      if (!prev.user) return prev;

      const updatedUser = { ...prev.user, ...userData };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));

      return {
        ...prev,
        user: updatedUser,
      };
    });
  }, []);

  /**
   * Verifica se o usuário tem permissão baseado nas roles
   */
  const hasPermission = useCallback(
    (requiredRoles: UserRole[]): boolean => {
      if (!state.user) return false;
      return requiredRoles.includes(state.user.role);
    },
    [state.user]
  );

  // Computed properties para verificação rápida de role
  const isSuperAdmin = useMemo(() => state.user?.role === 'super_admin', [state.user]);
  const isAdmin = useMemo(() => state.user?.role === 'admin', [state.user]);
  const isCustomer = useMemo(() => state.user?.role === 'customer', [state.user]);

  const contextValue = useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      updateUser,
      hasPermission,
      isSuperAdmin,
      isAdmin,
      isCustomer,
      token,
    }),
    [state, login, register, logout, updateUser, hasPermission, isSuperAdmin, isAdmin, isCustomer, token]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

/**
 * Hook para acessar o contexto de autenticação
 */
export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};

/**
 * HOC para proteger rotas baseado em roles
 */
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: UserRole[]
) => {
  const WithAuthComponent: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading, hasPermission } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated) {
          router.push('/login');
        } else if (!hasPermission(allowedRoles)) {
          router.push('/unauthorized');
        }
      }
    }, [isAuthenticated, isLoading, hasPermission, router]);

    if (isLoading) {
      return null;
    }

    if (!isAuthenticated || !hasPermission(allowedRoles)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default AuthContext;

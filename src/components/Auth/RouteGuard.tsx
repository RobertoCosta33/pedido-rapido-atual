'use client';

/**
 * Componente de proteção de rotas
 * Redireciona para login se não autenticado
 * Redireciona para unauthorized se sem permissão
 */

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

/**
 * Guard de rotas com verificação de autenticação e autorização
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  allowedRoles,
  requireAuth = true,
}) => {
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Aguarda carregamento inicial
    if (isLoading) return;

    // Se não requer autenticação, autoriza
    if (!requireAuth) {
      setAuthorized(true);
      return;
    }

    // Verifica autenticação
    if (!isAuthenticated) {
      // Salva URL atual para redirecionar após login
      sessionStorage.setItem('redirectAfterLogin', pathname);
      router.push('/login');
      return;
    }

    // Verifica permissão de role
    if (allowedRoles && allowedRoles.length > 0) {
      if (!hasPermission(allowedRoles)) {
        router.push('/unauthorized');
        return;
      }
    }

    // Tudo ok, autoriza
    setAuthorized(true);
  }, [isAuthenticated, isLoading, user, allowedRoles, hasPermission, router, pathname, requireAuth]);

  // Enquanto carrega, mostra loading
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Verificando autenticação...
        </Typography>
      </Box>
    );
  }

  // Se não autorizado, não renderiza nada (já está redirecionando)
  if (!authorized) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Redirecionando...
        </Typography>
      </Box>
    );
  }

  // Renderiza children
  return <>{children}</>;
};

/**
 * Guard específico para rotas de Super Admin
 */
export const SuperAdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RouteGuard allowedRoles={['super_admin']}>{children}</RouteGuard>
);

/**
 * Guard específico para rotas de Admin (Admin ou Super Admin)
 */
export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RouteGuard allowedRoles={['admin', 'super_admin']}>{children}</RouteGuard>
);

/**
 * Guard específico para rotas de usuários autenticados (qualquer role)
 */
export const AuthenticatedGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RouteGuard allowedRoles={['super_admin', 'admin', 'customer']}>{children}</RouteGuard>
);

export default RouteGuard;


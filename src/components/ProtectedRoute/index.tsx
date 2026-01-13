/**
 * Componente ProtectedRoute
 * Guard de autenticação baseado em roles
 */

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  requireAuth = true,
  fallbackPath = "/login",
}) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, hasPermission } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Se requer autenticação mas não está autenticado
      if (requireAuth && !isAuthenticated) {
        router.push(fallbackPath);
        return;
      }

      // Se tem roles específicas mas não tem permissão
      if (allowedRoles.length > 0 && !hasPermission(allowedRoles)) {
        router.push("/unauthorized");
        return;
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    hasPermission,
    allowedRoles,
    requireAuth,
    fallbackPath,
    router,
  ]);

  // Loading state
  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">
          Carregando...
        </Typography>
      </Box>
    );
  }

  // Se requer autenticação mas não está autenticado
  if (requireAuth && !isAuthenticated) {
    return null; // Vai redirecionar
  }

  // Se tem roles específicas mas não tem permissão
  if (allowedRoles.length > 0 && !hasPermission(allowedRoles)) {
    return null; // Vai redirecionar
  }

  // Renderiza o conteúdo protegido
  return <>{children}</>;
};

/**
 * HOC para proteger componentes
 */
export const withProtectedRoute = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, "children"> = {}
) => {
  const ProtectedComponent: React.FC<P> = (props) => {
    return (
      <ProtectedRoute {...options}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };

  ProtectedComponent.displayName = `withProtectedRoute(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return ProtectedComponent;
};

/**
 * Componentes pré-configurados para roles específicas
 */
export const SuperAdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute allowedRoles={["super_admin"]}>{children}</ProtectedRoute>
);

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
    {children}
  </ProtectedRoute>
);

export const CustomerRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ProtectedRoute allowedRoles={["customer"]}>{children}</ProtectedRoute>;

export default ProtectedRoute;

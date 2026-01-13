"use client";

/**
 * Context para gerenciamento de notificações/toasts
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Snackbar,
  Alert,
  AlertTitle,
  Button,
  Slide,
  SlideProps,
} from "@mui/material";
import { Notification, NotificationState, NotificationType } from "@/types";

const NotificationContext = createContext<NotificationState | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: React.ReactNode;
}

// Componente de transição para o Snackbar
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /**
   * Remove notificação específica
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  /**
   * Adiciona nova notificação
   */
  const addNotification = useCallback(
    (notification: Omit<Notification, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newNotification: Notification = {
        ...notification,
        id,
        duration: notification.duration || 5000,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Remove automaticamente após o tempo especificado
      if (newNotification.duration && newNotification.duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }
    },
    [removeNotification]
  );

  /**
   * Limpa todas as notificações
   */
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  /**
   * Helpers para tipos específicos de notificação
   */
  const showSuccess = useCallback(
    (title: string, message?: string, duration?: number) => {
      addNotification({ type: "success", title, message, duration });
    },
    [addNotification]
  );

  const showError = useCallback(
    (title: string, message?: string, duration?: number) => {
      addNotification({ type: "error", title, message, duration });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (title: string, message?: string, duration?: number) => {
      addNotification({ type: "warning", title, message, duration });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (title: string, message?: string, duration?: number) => {
      addNotification({ type: "info", title, message, duration });
    },
    [addNotification]
  );

  const contextValue = useMemo(
    () => ({
      notifications,
      addNotification,
      removeNotification,
      clearNotifications,
      showSuccess,
      showError,
      showWarning,
      showInfo,
    }),
    [
      notifications,
      addNotification,
      removeNotification,
      clearNotifications,
      showSuccess,
      showError,
      showWarning,
      showInfo,
    ]
  );

  // Renderiza apenas a primeira notificação (FIFO)
  const currentNotification = notifications[0];

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}

      {/* Snackbar para exibir notificações */}
      <Snackbar
        open={!!currentNotification}
        autoHideDuration={currentNotification?.duration || 5000}
        onClose={() =>
          currentNotification && removeNotification(currentNotification.id)
        }
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {currentNotification && (
          <Alert
            onClose={() => removeNotification(currentNotification.id)}
            severity={currentNotification.type}
            variant="filled"
            sx={{ width: "100%", minWidth: 300 }}
            action={
              currentNotification.action && (
                <Button
                  color="inherit"
                  size="small"
                  onClick={currentNotification.action.onClick}
                >
                  {currentNotification.action.label}
                </Button>
              )
            }
          >
            <AlertTitle>{currentNotification.title}</AlertTitle>
            {currentNotification.message}
          </Alert>
        )}
      </Snackbar>
    </NotificationContext.Provider>
  );
};

/**
 * Hook para acessar o contexto de notificações
 */
export const useNotification = (): NotificationState & {
  showSuccess: (title: string, message?: string, duration?: number) => void;
  showError: (title: string, message?: string, duration?: number) => void;
  showWarning: (title: string, message?: string, duration?: number) => void;
  showInfo: (title: string, message?: string, duration?: number) => void;
} => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification deve ser usado dentro de um NotificationProvider"
    );
  }

  return context as any;
};

export default NotificationContext;

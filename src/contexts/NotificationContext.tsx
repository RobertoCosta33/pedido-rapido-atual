'use client';

/**
 * Context para gerenciamento de notificações
 * Exibe toasts/snackbars para feedback ao usuário
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import styled from 'styled-components';

interface Notification {
  id: string;
  message: string;
  type: AlertColor;
  duration?: number;
}

interface NotificationContextData {
  showNotification: (message: string, type?: AlertColor, duration?: number) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextData | undefined>(undefined);

const NotificationContainer = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showNotification = useCallback(
    (message: string, type: AlertColor = 'info', duration: number = 5000) => {
      const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const newNotification: Notification = {
        id,
        message,
        type,
        duration,
      };

      setNotifications((prev) => [...prev, newNotification]);

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    [removeNotification]
  );

  const showSuccess = useCallback(
    (message: string) => showNotification(message, 'success'),
    [showNotification]
  );

  const showError = useCallback(
    (message: string) => showNotification(message, 'error'),
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string) => showNotification(message, 'warning'),
    [showNotification]
  );

  const showInfo = useCallback(
    (message: string) => showNotification(message, 'info'),
    [showNotification]
  );

  const contextValue = useMemo(
    () => ({
      showNotification,
      showSuccess,
      showError,
      showWarning,
      showInfo,
    }),
    [showNotification, showSuccess, showError, showWarning, showInfo]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer>
        {notifications.map((notification) => (
          <Snackbar
            key={notification.id}
            open
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ position: 'relative', top: 0, right: 0 }}
          >
            <Alert
              severity={notification.type}
              onClose={() => removeNotification(notification.id)}
              variant="filled"
              sx={{ minWidth: 300 }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        ))}
      </NotificationContainer>
    </NotificationContext.Provider>
  );
};

/**
 * Hook para acessar o contexto de notificações
 */
export const useNotification = (): NotificationContextData => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
  }

  return context;
};

export default NotificationContext;


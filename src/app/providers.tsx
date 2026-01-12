'use client';

/**
 * Providers da aplicação
 * Agrupa todos os Context Providers necessários
 */

import React from 'react';
import { ThemeProvider, AuthProvider, NotificationProvider } from '@/contexts';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>{children}</AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};


'use client';

/**
 * Context para gerenciamento de tema (Dark/Light)
 * Persiste preferência do usuário no localStorage
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme, muiLightTheme, muiDarkTheme, AppTheme } from '@/styles/theme';
import { GlobalStyles } from '@/styles/GlobalStyles';

type ThemeMode = 'light' | 'dark';

interface ThemeContextData {
  theme: AppTheme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

const THEME_STORAGE_KEY = 'pedido-rapido-theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  // Carrega tema do localStorage na inicialização
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    
    if (storedTheme) {
      setThemeModeState(storedTheme);
    } else {
      // Detecta preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeModeState(prefersDark ? 'dark' : 'light');
    }
    
    setMounted(true);
  }, []);

  // Persiste mudanças de tema no localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(THEME_STORAGE_KEY, themeMode);
      
      // Atualiza meta tag de cor do tema
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      const color = themeMode === 'dark' ? '#0F172A' : '#F8FAFC';
      
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', color);
      }
    }
  }, [themeMode, mounted]);

  // Escuta mudanças na preferência do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (!storedTheme) {
        setThemeModeState(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
  }, []);

  const theme = useMemo(() => (themeMode === 'dark' ? darkTheme : lightTheme), [themeMode]);
  const muiTheme = useMemo(() => (themeMode === 'dark' ? muiDarkTheme : muiLightTheme), [themeMode]);
  const isDarkMode = themeMode === 'dark';

  const contextValue = useMemo(
    () => ({
      theme,
      themeMode,
      toggleTheme,
      setThemeMode,
      isDarkMode,
    }),
    [theme, themeMode, toggleTheme, setThemeMode, isDarkMode]
  );

  // Evita flash de tema incorreto
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={muiTheme}>
        <StyledThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles />
          {children}
        </StyledThemeProvider>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

/**
 * Hook para acessar o contexto de tema
 */
export const useTheme = (): ThemeContextData => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  
  return context;
};

export default ThemeContext;


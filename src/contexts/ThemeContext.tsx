"use client";

/**
 * Context para gerenciamento de tema (dark/light mode)
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  Theme,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ThemeMode, ThemeState } from "@/types";
import { STORAGE_KEYS } from "@/utils/constants";

const ThemeContext = createContext<ThemeState | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>("light");

  // Carrega tema do localStorage na inicialização
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode;
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      setMode(savedTheme);
    } else {
      // Detecta preferência do sistema
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setMode(prefersDark ? "dark" : "light");
    }
  }, []);

  // Salva tema no localStorage quando muda
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // Cria tema do Material-UI
  const theme: Theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "light" ? "#1976d2" : "#90caf9",
            light: mode === "light" ? "#42a5f5" : "#e3f2fd",
            dark: mode === "light" ? "#1565c0" : "#42a5f5",
          },
          secondary: {
            main: mode === "light" ? "#dc004e" : "#f48fb1",
          },
          background: {
            default: mode === "light" ? "#f5f5f5" : "#121212",
            paper: mode === "light" ? "#ffffff" : "#1e1e1e",
          },
          text: {
            primary: mode === "light" ? "#212121" : "#ffffff",
            secondary: mode === "light" ? "#757575" : "#b0b0b0",
          },
        },
        typography: {
          fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 700,
          },
          h2: {
            fontWeight: 600,
          },
          h3: {
            fontWeight: 600,
          },
          h4: {
            fontWeight: 500,
          },
          h5: {
            fontWeight: 500,
          },
          h6: {
            fontWeight: 500,
          },
          button: {
            textTransform: "none",
            fontWeight: 500,
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                padding: "8px 16px",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow:
                  mode === "light"
                    ? "0 2px 8px rgba(0,0,0,0.1)"
                    : "0 2px 8px rgba(0,0,0,0.3)",
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "light" ? "#1976d2" : "#1e1e1e",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              },
            },
          },
        },
      }),
    [mode]
  );

  const contextValue = useMemo(
    () => ({
      mode,
      toggleMode,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

/**
 * Hook para acessar o contexto de tema
 */
export const useTheme = (): ThemeState => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }

  return context;
};

export default ThemeContext;

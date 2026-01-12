/**
 * Configuração de tema para styled-components e Material UI
 * Suporte a tema claro e escuro com cores, espaçamentos e tipografia centralizados
 */

import { createTheme, Theme as MuiTheme } from '@mui/material/styles';

// Cores base do sistema
const colors = {
  // Cores primárias - Laranja vibrante inspirado em delivery
  primary: {
    main: '#FF6B35',
    light: '#FF8F66',
    dark: '#E65100',
    contrastText: '#FFFFFF',
  },
  // Cores secundárias - Verde para sucesso/confirmação
  secondary: {
    main: '#2ECC71',
    light: '#58D68D',
    dark: '#27AE60',
    contrastText: '#FFFFFF',
  },
  // Cores de status
  success: {
    main: '#00C851',
    light: '#33D375',
    dark: '#00A843',
  },
  warning: {
    main: '#FFBB33',
    light: '#FFC966',
    dark: '#FF8800',
  },
  error: {
    main: '#FF4444',
    light: '#FF6B6B',
    dark: '#CC0000',
  },
  info: {
    main: '#33B5E5',
    light: '#5CC4EB',
    dark: '#0099CC',
  },
};

// Definição de breakpoints
export const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '900px',
  lg: '1200px',
  xl: '1536px',
};

// Espaçamentos padronizados
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

// Tipografia
export const typography = {
  fontFamily: "'Outfit', 'Segoe UI', 'Roboto', sans-serif",
  fontFamilyMono: "'JetBrains Mono', 'Fira Code', monospace",
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.5,
  },
};

// Border radius
export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

// Sombras
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

// Transições
export const transitions = {
  fast: '150ms ease-in-out',
  normal: '250ms ease-in-out',
  slow: '350ms ease-in-out',
};

// Tema claro para styled-components
export const lightTheme = {
  name: 'light' as const,
  colors: {
    ...colors,
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
      elevated: '#FFFFFF',
      subtle: '#F1F5F9',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
      disabled: '#94A3B8',
      inverse: '#FFFFFF',
    },
    border: {
      default: '#E2E8F0',
      light: '#F1F5F9',
      dark: '#CBD5E1',
    },
    divider: '#E2E8F0',
  },
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
};

// Tema escuro para styled-components
export const darkTheme = {
  name: 'dark' as const,
  colors: {
    ...colors,
    background: {
      default: '#0F172A',
      paper: '#1E293B',
      elevated: '#334155',
      subtle: '#1E293B',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      disabled: '#64748B',
      inverse: '#1E293B',
    },
    border: {
      default: '#334155',
      light: '#1E293B',
      dark: '#475569',
    },
    divider: '#334155',
  },
  spacing,
  typography,
  borderRadius,
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
  },
  transitions,
  breakpoints,
};

export type AppTheme = typeof lightTheme;

// Criação do tema MUI Light
export const muiLightTheme: MuiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    background: {
      default: lightTheme.colors.background.default,
      paper: lightTheme.colors.background.paper,
    },
    text: {
      primary: lightTheme.colors.text.primary,
      secondary: lightTheme.colors.text.secondary,
      disabled: lightTheme.colors.text.disabled,
    },
    divider: lightTheme.colors.divider,
  },
  typography: {
    fontFamily: typography.fontFamily,
    h1: typography.h1,
    h2: typography.h2,
    h3: typography.h3,
    h4: typography.h4,
    h5: typography.h5,
    h6: typography.h6,
    body1: typography.body1,
    body2: typography.body2,
    caption: typography.caption,
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: borderRadius.md,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
          boxShadow: shadows.md,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: borderRadius.md,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
        },
      },
    },
  },
});

// Criação do tema MUI Dark
export const muiDarkTheme: MuiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    background: {
      default: darkTheme.colors.background.default,
      paper: darkTheme.colors.background.paper,
    },
    text: {
      primary: darkTheme.colors.text.primary,
      secondary: darkTheme.colors.text.secondary,
      disabled: darkTheme.colors.text.disabled,
    },
    divider: darkTheme.colors.divider,
  },
  typography: {
    fontFamily: typography.fontFamily,
    h1: typography.h1,
    h2: typography.h2,
    h3: typography.h3,
    h4: typography.h4,
    h5: typography.h5,
    h6: typography.h6,
    body1: typography.body1,
    body2: typography.body2,
    caption: typography.caption,
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: borderRadius.md,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
          boxShadow: shadows.md,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: borderRadius.md,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
        },
      },
    },
  },
});

// Declaração de tipos para styled-components
declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}


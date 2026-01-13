/**
 * Barrel export para todos os contexts
 */

export { AuthProvider, useAuth, withAuth } from "./AuthContext";
export { ThemeProvider, useTheme } from "./ThemeContext";
export { NotificationProvider, useNotification } from "./NotificationContext";

export type { default as AuthContext } from "./AuthContext";
export type { default as ThemeContext } from "./ThemeContext";
export type { default as NotificationContext } from "./NotificationContext";

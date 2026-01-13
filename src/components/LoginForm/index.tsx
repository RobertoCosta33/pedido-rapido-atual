/**
 * Componente LoginForm
 * Formulário de login com validação
 */

"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/contexts/NotificationContext";
import { LoginCredentials } from "@/types";

export const LoginForm: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const { showError, showSuccess } = useNotification();

  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Partial<LoginCredentials>
  >({});

  const validateForm = (): boolean => {
    const errors: Partial<LoginCredentials> = {};

    // Email validation
    if (!formData.email) {
      errors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email inválido";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      errors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange =
    (field: keyof LoginCredentials) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));

      // Clear validation error when user starts typing
      if (validationErrors[field]) {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      showSuccess("Login realizado com sucesso!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao fazer login";
      showError("Erro no login", errorMessage);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {/* Global error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Email */}
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange("email")}
        error={!!validationErrors.email}
        helperText={validationErrors.email}
        disabled={isLoading}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Password */}
      <TextField
        fullWidth
        label="Senha"
        type={showPassword ? "text" : "password"}
        value={formData.password}
        onChange={handleChange("password")}
        error={!!validationErrors.password}
        helperText={validationErrors.password}
        disabled={isLoading}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isLoading}
        sx={{ mt: 3, mb: 2, py: 1.5 }}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
      </Button>
    </Box>
  );
};

export default LoginForm;

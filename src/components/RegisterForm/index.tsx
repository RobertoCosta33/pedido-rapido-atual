/**
 * Componente RegisterForm
 * Formulário de registro com validação
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
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/contexts/NotificationContext";
import { RegisterData } from "@/types";

export const RegisterForm: React.FC = () => {
  const { register, isLoading, error } = useAuth();
  const { showError, showSuccess } = useNotification();

  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Partial<RegisterData>
  >({});

  const validateForm = (): boolean => {
    const errors: Partial<RegisterData> = {};

    // Name validation
    if (!formData.name) {
      errors.name = "Nome é obrigatório";
    } else if (formData.name.length < 2) {
      errors.name = "Nome deve ter pelo menos 2 caracteres";
    }

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

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirmação de senha é obrigatória";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Senhas não coincidem";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange =
    (field: keyof RegisterData) =>
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
      await register(formData);
      showSuccess("Conta criada com sucesso!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar conta";
      showError("Erro no cadastro", errorMessage);
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

      {/* Name */}
      <TextField
        fullWidth
        label="Nome completo"
        value={formData.name}
        onChange={handleChange("name")}
        error={!!validationErrors.name}
        helperText={validationErrors.name}
        disabled={isLoading}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

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

      {/* Confirm Password */}
      <TextField
        fullWidth
        label="Confirmar senha"
        type={showConfirmPassword ? "text" : "password"}
        value={formData.confirmPassword}
        onChange={handleChange("confirmPassword")}
        error={!!validationErrors.confirmPassword}
        helperText={validationErrors.confirmPassword}
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
                aria-label="toggle confirm password visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Criar conta"
        )}
      </Button>
    </Box>
  );
};

export default RegisterForm;

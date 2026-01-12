/**
 * Componente Button reutilizável
 * Suporta múltiplas variantes, tamanhos e estados
 */

import React from 'react';
import { StyledButton, LoadingSpinner, IconWrapper } from './styles';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $isLoading={isLoading}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
      {children}
      {rightIcon && <IconWrapper>{rightIcon}</IconWrapper>}
    </StyledButton>
  );
};

export default Button;


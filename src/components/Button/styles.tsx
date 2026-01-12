/**
 * Estilos do componente Button
 */

import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface StyledButtonProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $isLoading: boolean;
}

const variantStyles = {
  primary: css`
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary.main} 0%, ${({ theme }) => theme.colors.primary.dark} 100%);
    color: ${({ theme }) => theme.colors.primary.contrastText};
    border: none;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary.light} 0%, ${({ theme }) => theme.colors.primary.main} 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px ${({ theme }) => theme.colors.primary.main}40;
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
  secondary: css`
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondary.main} 0%, ${({ theme }) => theme.colors.secondary.dark} 100%);
    color: ${({ theme }) => theme.colors.secondary.contrastText};
    border: none;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondary.light} 0%, ${({ theme }) => theme.colors.secondary.main} 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px ${({ theme }) => theme.colors.secondary.main}40;
    }
  `,
  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary.main};
    border: 2px solid ${({ theme }) => theme.colors.primary.main};
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primary.main}10;
      border-color: ${({ theme }) => theme.colors.primary.dark};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text.primary};
    border: none;
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.background.subtle};
    }
  `,
  danger: css`
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.error.main} 0%, ${({ theme }) => theme.colors.error.dark} 100%);
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, ${({ theme }) => theme.colors.error.light} 0%, ${({ theme }) => theme.colors.error.main} 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px ${({ theme }) => theme.colors.error.main}40;
    }
  `,
};

const sizeStyles = {
  small: css`
    padding: 8px 16px;
    font-size: 0.875rem;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  `,
  medium: css`
    padding: 12px 24px;
    font-size: 1rem;
    border-radius: ${({ theme }) => theme.borderRadius.md};
  `,
  large: css`
    padding: 16px 32px;
    font-size: 1.125rem;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
  `,
};

export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  overflow: hidden;
  
  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}
  
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}
  
  ${({ $isLoading }) =>
    $isLoading &&
    css`
      color: transparent !important;
      pointer-events: none;
    `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.main};
    outline-offset: 2px;
  }
`;

export const LoadingSpinner = styled.span`
  position: absolute;
  display: inline-flex;
  
  &::after {
    content: '';
    width: 20px;
    height: 20px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 1.2em;
    height: 1.2em;
  }
`;


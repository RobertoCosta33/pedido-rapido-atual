/**
 * Estilos do componente Input
 */

import styled, { css } from 'styled-components';

interface InputContainerProps {
  $hasError: boolean;
  $disabled: boolean;
  $focused: boolean;
}

export const InputContainer = styled.div<InputContainerProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
  
  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
    `}
`;

export const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  
  span {
    color: ${({ theme }) => theme.colors.error.main};
    margin-left: 2px;
  }
`;

interface InputWrapperProps {
  $hasError: boolean;
  $focused: boolean;
}

export const InputWrapper = styled.div<InputWrapperProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background.paper};
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0 ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  ${({ $focused, theme }) =>
    $focused &&
    css`
      border-color: ${theme.colors.primary.main};
      box-shadow: 0 0 0 3px ${theme.colors.primary.main}20;
    `}
  
  ${({ $hasError, theme }) =>
    $hasError &&
    css`
      border-color: ${theme.colors.error.main};
      
      &:focus-within {
        box-shadow: 0 0 0 3px ${theme.colors.error.main}20;
      }
    `}
  
  &:hover:not(:focus-within) {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error.main : theme.colors.border.dark};
  }
`;

export const StyledInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  font-size: 1rem;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.text.primary};
  outline: none;
  width: 100%;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
  
  &:disabled {
    cursor: not-allowed;
  }
  
  /* Remove spinners de input number */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

export const IconContainer = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.error.main};
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const HelperText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const CharacterCount = styled.span<{ $isOverLimit: boolean }>`
  font-size: 0.75rem;
  color: ${({ theme, $isOverLimit }) =>
    $isOverLimit ? theme.colors.error.main : theme.colors.text.secondary};
  margin-left: auto;
`;


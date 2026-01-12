/**
 * Componente Input reutilizável
 */

import React, { useState, forwardRef } from 'react';
import {
  InputContainer,
  Label,
  InputWrapper,
  StyledInput,
  IconContainer,
  ErrorMessage,
  HelperText,
  CharacterCount,
} from './styles';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      required,
      maxLength,
      showCharacterCount = false,
      disabled = false,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [internalValue, setInternalValue] = useState('');
    
    const currentValue = value !== undefined ? String(value) : internalValue;
    const characterCount = currentValue.length;
    const isOverLimit = maxLength ? characterCount > maxLength : false;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };
    
    return (
      <InputContainer
        $hasError={!!error}
        $disabled={disabled}
        $focused={focused}
      >
        {label && (
          <Label>
            {label}
            {required && <span>*</span>}
          </Label>
        )}
        
        <InputWrapper $hasError={!!error} $focused={focused}>
          {leftIcon && <IconContainer>{leftIcon}</IconContainer>}
          
          <StyledInput
            ref={ref}
            disabled={disabled}
            maxLength={maxLength}
            value={currentValue}
            onChange={handleChange}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
          
          {rightIcon && <IconContainer>{rightIcon}</IconContainer>}
        </InputWrapper>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {error ? (
            <ErrorMessage id={`${props.id}-error`} role="alert">
              {error}
            </ErrorMessage>
          ) : helperText ? (
            <HelperText>{helperText}</HelperText>
          ) : (
            <span />
          )}
          
          {showCharacterCount && maxLength && (
            <CharacterCount $isOverLimit={isOverLimit}>
              {characterCount}/{maxLength}
            </CharacterCount>
          )}
        </div>
      </InputContainer>
    );
  }
);

Input.displayName = 'Input';

export default Input;


'use client';

/**
 * Componente da página de login
 */

import React, { useState } from 'react';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Button, Input } from '@/components';
import { useAuth, useNotification } from '@/contexts';
import { validateLoginForm } from '@/utils/validators';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.default};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      ${({ theme }) => theme.colors.primary.main}08 0%,
      transparent 50%
    );
    animation: pulse 8s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 440px;
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary.main} 0%, ${({ theme }) => theme.colors.primary.dark} 100%);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PasswordToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ForgotPassword = styled(Link)`
  display: block;
  text-align: right;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.primary.main};
  margin-top: -${({ theme }) => theme.spacing.xs};
  
  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border.default};
  }
  
  span {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const RegisterLink = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.9375rem;
  
  a {
    color: ${({ theme }) => theme.colors.primary.main};
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const DemoCredentials = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.secondary};
    
    &:first-child {
      font-weight: 600;
      color: ${({ theme }) => theme.colors.text.primary};
      margin-bottom: ${({ theme }) => theme.spacing.xs};
    }
  }
  
  code {
    background: ${({ theme }) => theme.colors.background.paper};
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
  }
`;

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const { showError } = useNotification();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const validation = validateLoginForm(email, password);
    
    if (!validation.isValid) {
      const newErrors: Record<string, string> = {};
      validation.errors.forEach((error) => {
        if (error.toLowerCase().includes('email')) {
          newErrors.email = error;
        } else if (error.toLowerCase().includes('senha')) {
          newErrors.password = error;
        }
      });
      setErrors(newErrors);
      return;
    }
    
    try {
      await login({ email, password });
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erro ao fazer login');
    }
  };
  
  return (
    <Container>
      <Card>
        <Logo>
          <LogoIcon>PR</LogoIcon>
          <LogoText>Pedido Rápido</LogoText>
        </Logo>
        
        <Title>Bem-vindo de volta!</Title>
        <Subtitle>Entre com suas credenciais para acessar</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leftIcon={<EmailIcon />}
            required
            autoComplete="email"
          />
          
          <Input
            type={showPassword ? 'text' : 'password'}
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            leftIcon={<LockIcon />}
            rightIcon={
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </PasswordToggle>
            }
            required
            autoComplete="current-password"
          />
          
          <ForgotPassword href="/forgot-password">
            Esqueceu a senha?
          </ForgotPassword>
          
          <Button type="submit" fullWidth isLoading={isLoading}>
            Entrar
          </Button>
        </Form>
        
        <Divider>
          <span>ou</span>
        </Divider>
        
        <RegisterLink>
          Não tem uma conta? <Link href="/register">Criar conta</Link>
        </RegisterLink>
        
        <DemoCredentials>
          <p>Credenciais de demonstração:</p>
          <p>Super Admin: <code>admin@pedidorapido.com</code> / <code>123456</code></p>
          <p>Admin: use qualquer email de admin seedado / <code>123456</code></p>
        </DemoCredentials>
      </Card>
    </Container>
  );
};


"use client";

/**
 * Componente da página de registro
 */

import React, { useState } from "react";
import Link from "next/link";
import styled, { keyframes } from "styled-components";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button, Input } from "@/components";
import { useAuth, useNotification } from "@/contexts";
import { validateRegisterForm, getPasswordStrength } from "@/utils/validators";

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
    content: "";
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      ${({ theme }) => theme.colors.secondary.main}08 0%,
      transparent 50%
    );
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 480px;
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
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.main} 0%,
    ${({ theme }) => theme.colors.primary.dark} 100%
  );
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
  margin-bottom: ${({ theme }) => theme.spacing.lg};
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

const PasswordStrength = styled.div`
  display: flex;
  gap: 4px;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const StrengthBar = styled.div<{ $active: boolean; $color: string }>`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: ${({ theme, $active, $color }) =>
    $active ? $color : theme.colors.border.default};
  transition: background ${({ theme }) => theme.transitions.fast};
`;

const StrengthText = styled.span<{ $color: string }>`
  font-size: 0.75rem;
  color: ${({ $color }) => $color};
  margin-top: 4px;
  display: block;
`;

const Benefits = styled.div`
  margin: ${({ theme }) => theme.spacing.lg} 0;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;

  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  svg {
    width: 18px;
    height: 18px;
    color: ${({ theme }) => theme.colors.secondary.main};
  }
`;

const LoginLink = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.9375rem;
  margin-top: ${({ theme }) => theme.spacing.md};

  a {
    color: ${({ theme }) => theme.colors.primary.main};
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const RegisterPage: React.FC = () => {
  const { register, isLoading } = useAuth();
  const { showError } = useNotification();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = validateRegisterForm(
      name,
      email,
      password,
      confirmPassword
    );

    if (!validation.isValid) {
      const newErrors: Record<string, string> = {};
      validation.errors.forEach((error) => {
        if (error.toLowerCase().includes("nome")) {
          newErrors.name = error;
        } else if (error.toLowerCase().includes("email")) {
          newErrors.email = error;
        } else if (error.toLowerCase().includes("senhas não conferem")) {
          newErrors.confirmPassword = error;
        } else if (error.toLowerCase().includes("senha")) {
          newErrors.password = error;
        }
      });
      setErrors(newErrors);
      return;
    }

    try {
      await register({ name, email, password, confirmPassword: password });
    } catch (error) {
      showError(error instanceof Error ? error.message : "Erro ao criar conta");
    }
  };

  return (
    <Container>
      <Card>
        <Logo>
          <LogoIcon>PR</LogoIcon>
          <LogoText>Pedido Rápido</LogoText>
        </Logo>

        <Title>Crie sua conta</Title>
        <Subtitle>Comece a usar o Pedido Rápido gratuitamente</Subtitle>

        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            label="Nome completo"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            leftIcon={<PersonIcon />}
            required
            autoComplete="name"
          />

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
            type="tel"
            label="Telefone (opcional)"
            placeholder="(00) 00000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<PhoneIcon />}
            autoComplete="tel"
          />

          <div>
            <Input
              type={showPassword ? "text" : "password"}
              label="Senha"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<LockIcon />}
              rightIcon={
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </PasswordToggle>
              }
              required
              autoComplete="new-password"
            />

            {password && (
              <>
                <PasswordStrength>
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <StrengthBar
                      key={level}
                      $active={passwordStrength.score >= level}
                      $color={passwordStrength.color}
                    />
                  ))}
                </PasswordStrength>
                <StrengthText $color={passwordStrength.color}>
                  Força da senha: {passwordStrength.label}
                </StrengthText>
              </>
            )}
          </div>

          <Input
            type={showPassword ? "text" : "password"}
            label="Confirmar senha"
            placeholder="Digite a senha novamente"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            leftIcon={<LockIcon />}
            required
            autoComplete="new-password"
          />

          <Benefits>
            <BenefitItem>
              <CheckCircleIcon />
              <span>Cardápio digital ilimitado</span>
            </BenefitItem>
            <BenefitItem>
              <CheckCircleIcon />
              <span>QR Code personalizado</span>
            </BenefitItem>
            <BenefitItem>
              <CheckCircleIcon />
              <span>Controle de estoque integrado</span>
            </BenefitItem>
            <BenefitItem>
              <CheckCircleIcon />
              <span>Suporte dedicado</span>
            </BenefitItem>
          </Benefits>

          <Button type="submit" fullWidth isLoading={isLoading}>
            Criar conta
          </Button>
        </Form>

        <LoginLink>
          Já tem uma conta? <Link href="/login">Fazer login</Link>
        </LoginLink>
      </Card>
    </Container>
  );
};

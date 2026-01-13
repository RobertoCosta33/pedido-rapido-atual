'use client';

/**
 * Página de acesso não autorizado
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@/components';
import { useAuth } from '@/contexts';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.default};
`;

const IconWrapper = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.error.light}20;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  svg {
    font-size: 4rem;
    color: ${({ theme }) => theme.colors.error.main};
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-align: center;
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  max-width: 400px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
`;

const UnauthorizedPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Container>
      <IconWrapper>
        <LockOutlinedIcon />
      </IconWrapper>
      
      <Title>Acesso Negado</Title>
      <Description>
        Você não tem permissão para acessar esta página. 
        Se você acredita que isso é um erro, entre em contato com o administrador.
      </Description>
      
      <ButtonGroup>
        <Button
          variant="outlined"
          onClick={handleGoBack}
          leftIcon={<ArrowBackIcon />}
        >
          Voltar
        </Button>
        
        <Button
          onClick={handleGoHome}
          leftIcon={<HomeIcon />}
        >
          Ir para Home
        </Button>
        
        {isAuthenticated && (
          <Button
            variant="text"
            onClick={handleLogout}
          >
            Sair e fazer login com outra conta
          </Button>
        )}
      </ButtonGroup>
    </Container>
  );
};

export default UnauthorizedPage;


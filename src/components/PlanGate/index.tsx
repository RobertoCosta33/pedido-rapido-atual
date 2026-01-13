'use client';

/**
 * Componente de bloqueio por plano
 * Exibe conteúdo alternativo quando feature não está disponível
 */

import React from 'react';
import styled from 'styled-components';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Lock as LockIcon,
  Upgrade as UpgradeIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { usePlanFeatures, PlanFeatures } from '@/hooks';

const BlockedContainer = styled(Card)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.backgroundLight};
  border: 2px dashed ${({ theme }) => theme.colors.border};
`;

const LockIconStyled = styled(LockIcon)`
  font-size: 64px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PlanBadges = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

interface PlanGateProps {
  /** Feature necessária para acessar o conteúdo */
  feature: keyof PlanFeatures;
  /** Conteúdo a ser renderizado se feature disponível */
  children: React.ReactNode;
  /** Título da mensagem de bloqueio */
  title?: string;
  /** Descrição da mensagem de bloqueio */
  description?: string;
  /** Planos que possuem a feature */
  requiredPlans?: ('professional' | 'premium')[];
  /** Callback ao clicar em "Fazer Upgrade" */
  onUpgradeClick?: () => void;
  /** Exibe loading enquanto carrega dados do plano */
  showLoading?: boolean;
  /** KioskId para verificar (opcional, usa o do usuário logado) */
  kioskId?: string;
}

/**
 * Componente que bloqueia conteúdo baseado no plano do quiosque
 */
export const PlanGate: React.FC<PlanGateProps> = ({
  feature,
  children,
  title = 'Funcionalidade Premium',
  description = 'Esta funcionalidade não está disponível no seu plano atual.',
  requiredPlans = ['professional', 'premium'],
  onUpgradeClick,
  showLoading = true,
  kioskId,
}) => {
  const { hasFeature, loading, planName } = usePlanFeatures(kioskId);

  // Loading state
  if (loading && showLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <Typography color="textSecondary">Verificando permissões...</Typography>
      </Box>
    );
  }

  // Feature disponível - renderiza children
  if (hasFeature(feature)) {
    return <>{children}</>;
  }

  // Feature bloqueada - exibe mensagem
  return (
    <BlockedContainer elevation={0}>
      <CardContent>
        <LockIconStyled />
        
        <Typography variant="h5" fontWeight={600} gutterBottom>
          {title}
        </Typography>
        
        <Typography color="textSecondary" paragraph>
          {description}
        </Typography>

        {planName && (
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Seu plano atual: <strong>{planName}</strong>
          </Typography>
        )}

        <PlanBadges>
          {requiredPlans.map((plan) => (
            <Chip
              key={plan}
              icon={plan === 'premium' ? <StarIcon /> : undefined}
              label={plan.charAt(0).toUpperCase() + plan.slice(1)}
              color={plan === 'premium' ? 'secondary' : 'primary'}
              variant="outlined"
            />
          ))}
        </PlanBadges>

        <Typography variant="body2" color="textSecondary" gutterBottom>
          Disponível nos planos acima
        </Typography>

        {onUpgradeClick && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<UpgradeIcon />}
            onClick={onUpgradeClick}
            sx={{ mt: 2 }}
          >
            Fazer Upgrade
          </Button>
        )}
      </CardContent>
    </BlockedContainer>
  );
};

export default PlanGate;


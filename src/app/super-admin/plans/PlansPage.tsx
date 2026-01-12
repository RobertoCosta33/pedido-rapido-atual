'use client';

/**
 * Página de Gerenciamento de Planos
 * Visualiza todos os planos disponíveis e suas features
 */

import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { planService, Plan } from '@/services';
import { formatCurrency } from '@/utils/formatters';

// Styled Components
const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PlanCard = styled(Card)<{ $isPremium?: boolean; $isPopular?: boolean }>`
  position: relative;
  overflow: visible;
  
  ${({ $isPremium, theme }) => $isPremium && `
    border: 2px solid ${theme.colors.primary};
  `}
  
  ${({ $isPopular, theme }) => $isPopular && `
    border: 2px solid ${theme.colors.secondary};
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  `}
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.secondary};
  color: white;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
`;

const PriceSection = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

const FeatureRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs} 0;
`;

const PlansPage = () => {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [comparison, setComparison] = useState<{
    features: Array<{
      name: string;
      key: string;
      basic: boolean;
      professional: boolean;
      premium: boolean;
    }>;
    limits: Array<{
      name: string;
      key: string;
      basic: string;
      professional: string;
      premium: string;
    }>;
  } | null>(null);

  /**
   * Carrega dados de planos
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [plansData, comparisonData] = await Promise.all([
        planService.getAll(),
        planService.comparePlans(),
      ]);
      
      setPlans(plansData);
      setComparison(comparisonData);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Loading state
  if (loading) {
    return (
      <PageContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <Typography variant="h4" fontWeight={600}>
          Planos de Assinatura
        </Typography>
        <Typography color="textSecondary">
          Visualize e gerencie os planos disponíveis no sistema
        </Typography>
      </PageHeader>

      {/* Cards de Planos */}
      <PlansGrid>
        {plans.map((plan) => (
          <PlanCard 
            key={plan.id} 
            elevation={plan.isPopular ? 8 : 2}
            $isPremium={plan.slug === 'premium'}
            $isPopular={plan.isPopular}
          >
            {plan.isPopular && <PopularBadge>{plan.badge}</PopularBadge>}
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
                {plan.slug === 'premium' && <TrophyIcon color="primary" />}
                <Typography variant="h5" fontWeight={700}>
                  {plan.name}
                </Typography>
              </Box>
              <Typography color="textSecondary" textAlign="center" gutterBottom>
                {plan.description}
              </Typography>

              <PriceSection>
                <Box display="flex" alignItems="baseline" justifyContent="center" gap={0.5}>
                  <Typography variant="h3" fontWeight={700} color="primary">
                    {formatCurrency(plan.pricing.monthly)}
                  </Typography>
                  <Typography color="textSecondary">/mês</Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  ou {formatCurrency(plan.pricing.annual / 12)}/mês no anual
                </Typography>
                <Chip 
                  label={`Economize ${plan.pricing.monthlyDiscount.annual}% no anual`}
                  color="success"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </PriceSection>

              <Divider sx={{ my: 2 }} />

              {/* Limites */}
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Limites
              </Typography>
              <FeatureRow>
                <Typography variant="body2">
                  Produtos: {plan.limits.products === -1 ? 'Ilimitado' : plan.limits.products}
                </Typography>
              </FeatureRow>
              <FeatureRow>
                <Typography variant="body2">
                  Pedidos/mês: {plan.limits.ordersPerMonth === -1 ? 'Ilimitado' : plan.limits.ordersPerMonth}
                </Typography>
              </FeatureRow>
              <FeatureRow>
                <Typography variant="body2">
                  Funcionários: {plan.limits.employees === -1 ? 'Ilimitado' : plan.limits.employees === 0 ? 'Não disponível' : plan.limits.employees}
                </Typography>
              </FeatureRow>

              <Divider sx={{ my: 2 }} />

              {/* Features Principais */}
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Principais Recursos
              </Typography>
              {Object.entries(plan.features).slice(0, 8).map(([key, enabled]) => (
                <FeatureRow key={key}>
                  {enabled ? (
                    <CheckIcon color="success" fontSize="small" />
                  ) : (
                    <CloseIcon color="disabled" fontSize="small" />
                  )}
                  <Typography 
                    variant="body2" 
                    color={enabled ? 'textPrimary' : 'textSecondary'}
                    sx={{ textDecoration: enabled ? 'none' : 'line-through' }}
                  >
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </Typography>
                </FeatureRow>
              ))}
            </CardContent>
          </PlanCard>
        ))}
      </PlansGrid>

      {/* Tabela Comparativa de Features */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Comparação de Recursos
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Recurso</TableCell>
              <TableCell align="center">Basic</TableCell>
              <TableCell align="center">Professional</TableCell>
              <TableCell align="center">Premium</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comparison?.features.map((feature) => (
              <TableRow key={feature.key}>
                <TableCell>{feature.name}</TableCell>
                <TableCell align="center">
                  {feature.basic ? (
                    <CheckIcon color="success" />
                  ) : (
                    <CloseIcon color="disabled" />
                  )}
                </TableCell>
                <TableCell align="center">
                  {feature.professional ? (
                    <CheckIcon color="success" />
                  ) : (
                    <CloseIcon color="disabled" />
                  )}
                </TableCell>
                <TableCell align="center">
                  {feature.premium ? (
                    <CheckIcon color="success" />
                  ) : (
                    <CloseIcon color="disabled" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tabela Comparativa de Limites */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Comparação de Limites
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Limite</TableCell>
              <TableCell align="center">Basic</TableCell>
              <TableCell align="center">Professional</TableCell>
              <TableCell align="center">Premium</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comparison?.limits.map((limit) => (
              <TableRow key={limit.key}>
                <TableCell>{limit.name}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={limit.basic} 
                    size="small" 
                    color={limit.basic === 'Ilimitado' ? 'success' : 'default'}
                    variant={limit.basic === '—' ? 'outlined' : 'filled'}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={limit.professional} 
                    size="small" 
                    color={limit.professional === 'Ilimitado' ? 'success' : 'default'}
                    variant={limit.professional === '—' ? 'outlined' : 'filled'}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={limit.premium} 
                    size="small" 
                    color={limit.premium === 'Ilimitado' ? 'success' : 'default'}
                    variant={limit.premium === '—' ? 'outlined' : 'filled'}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
};

export default PlansPage;


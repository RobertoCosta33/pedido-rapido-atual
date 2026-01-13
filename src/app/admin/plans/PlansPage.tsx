'use client';

/**
 * Página de Planos do Quiosque
 * Exibe o plano atual e opções de upgrade
 */

import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
  TrendingUp as UpgradeIcon,
  CalendarToday as CalendarIcon,
  CreditCard as PaymentIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { planService, licenseService, Plan, License } from '@/services';
import { formatCurrency } from '@/utils';

// Styled Components
const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const CurrentPlanCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary.main}15 0%, 
    ${({ theme }) => theme.colors.secondary.main}15 100%
  );
  border: 2px solid ${({ theme }) => theme.colors.primary.main};
`;

const PlanCard = styled(Card)<{ $isPopular?: boolean; $isCurrent?: boolean }>`
  height: 100%;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  
  ${({ $isPopular, theme }) => $isPopular && `
    border: 2px solid ${theme.colors.primary.main};
    transform: scale(1.02);
  `}
  
  ${({ $isCurrent, theme }) => $isCurrent && `
    border: 2px solid ${theme.colors.success.main};
    background: ${theme.colors.success.main}10;
  `}
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.primary.main};
  color: white;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const PriceContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

const Price = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
`;

const UsageSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const UsageItem = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

type BillingCycle = 'monthly' | 'semiannual' | 'annual';

const PlansPage = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentLicense, setCurrentLicense] = useState<License | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  
  // Dados simulados de uso (em produção viria do backend)
  const usage = {
    products: { current: 35, limit: 50 },
    ordersThisMonth: { current: 287, limit: 500 },
    employees: { current: 3, limit: 5 },
  };

  /**
   * Carrega planos e licença atual
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [plansData, licenseData] = await Promise.all([
        planService.getAll(),
        user?.kioskId ? licenseService.getByKiosk(user.kioskId) : null,
      ]);
      
      setPlans(plansData.filter(p => p.isActive).sort((a, b) => a.order - b.order));
      setCurrentLicense(licenseData);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      showNotification('Erro ao carregar planos', 'error');
    } finally {
      setLoading(false);
    }
  }, [user?.kioskId, showNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Simula upgrade de plano
   */
  const handleUpgrade = (planId: string) => {
    showNotification('Redirecionando para pagamento...', 'info');
    // Em produção: redirecionar para checkout
    console.log('Upgrade para:', planId, 'Ciclo:', billingCycle);
  };

  /**
   * Calcula preço com desconto
   */
  const getPrice = (plan: Plan) => {
    const pricing = plan.pricing;
    switch (billingCycle) {
      case 'semiannual':
        return pricing.semiannual / 6;
      case 'annual':
        return pricing.annual / 12;
      default:
        return pricing.monthly;
    }
  };

  /**
   * Calcula porcentagem de uso
   */
  const getUsagePercent = (current: number, limit: number): number => {
    if (limit === -1) return 0; // Ilimitado
    return Math.min((current / limit) * 100, 100);
  };

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
      <Header>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Planos e Assinatura
        </Typography>
        <Typography color="textSecondary">
          Gerencie seu plano e desbloqueie mais funcionalidades
        </Typography>
      </Header>

      {/* Plano Atual */}
      {currentLicense && (
        <CurrentPlanCard>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
              <Box>
                <Typography variant="overline" color="textSecondary">
                  Seu plano atual
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h4" fontWeight={700}>
                    {currentLicense.plan?.toUpperCase() || 'BASIC'}
                  </Typography>
                  {currentLicense.plan === 'premium' && (
                    <Chip icon={<VerifiedIcon />} label="Premium" color="primary" size="small" />
                  )}
                </Box>
                <Box display="flex" alignItems="center" gap={2} mt={1}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="textSecondary">
                      Válido até: {new Date(currentLicense.expiryDate).toLocaleDateString('pt-BR')}
                    </Typography>
                  </Box>
                  <Chip
                    label={currentLicense.status === 'active' ? 'Ativo' : 'Expirando'}
                    color={currentLicense.status === 'active' ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
              </Box>
              <Box textAlign="right">
                <Typography variant="h5" fontWeight={600}>
                  {formatCurrency(currentLicense.price)}/mês
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Ciclo: {currentLicense.billingCycle === 'monthly' ? 'Mensal' : 
                         currentLicense.billingCycle === 'semiannual' ? 'Semestral' : 'Anual'}
                </Typography>
              </Box>
            </Box>

            {/* Uso do plano */}
            <UsageSection>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Uso do seu plano
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <UsageItem>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2">Produtos</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {usage.products.current} / {currentLicense.limits.products === -1 ? '∞' : currentLicense.limits.products}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={getUsagePercent(usage.products.current, currentLicense.limits.products)}
                      color={getUsagePercent(usage.products.current, currentLicense.limits.products) > 80 ? 'warning' : 'primary'}
                    />
                  </UsageItem>
                </Grid>
                <Grid item xs={12} md={4}>
                  <UsageItem>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2">Pedidos/mês</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {usage.ordersThisMonth.current} / {currentLicense.limits.ordersPerMonth === -1 ? '∞' : currentLicense.limits.ordersPerMonth}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={getUsagePercent(usage.ordersThisMonth.current, currentLicense.limits.ordersPerMonth)}
                      color={getUsagePercent(usage.ordersThisMonth.current, currentLicense.limits.ordersPerMonth) > 80 ? 'warning' : 'primary'}
                    />
                  </UsageItem>
                </Grid>
                <Grid item xs={12} md={4}>
                  <UsageItem>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2">Funcionários</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {usage.employees.current} / {currentLicense.limits.employees === -1 ? '∞' : currentLicense.limits.employees}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={getUsagePercent(usage.employees.current, currentLicense.limits.employees)}
                      color={getUsagePercent(usage.employees.current, currentLicense.limits.employees) > 80 ? 'warning' : 'primary'}
                    />
                  </UsageItem>
                </Grid>
              </Grid>
            </UsageSection>
          </CardContent>
        </CurrentPlanCard>
      )}

      {/* Seletor de ciclo */}
      <Box display="flex" justifyContent="center" mb={4}>
        <ToggleButtonGroup
          value={billingCycle}
          exclusive
          onChange={(_, value) => value && setBillingCycle(value)}
          size="small"
        >
          <ToggleButton value="monthly">Mensal</ToggleButton>
          <ToggleButton value="semiannual">
            Semestral <Chip label="-10%" size="small" color="success" sx={{ ml: 1 }} />
          </ToggleButton>
          <ToggleButton value="annual">
            Anual <Chip label="-20%" size="small" color="success" sx={{ ml: 1 }} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Grid de Planos */}
      <Grid container spacing={3}>
        {plans.map((plan) => {
          const isCurrent = currentLicense?.planId === plan.id;
          const price = getPrice(plan);
          
          return (
            <Grid item xs={12} sm={6} md={3} key={plan.id}>
              <PlanCard $isPopular={plan.isPopular} $isCurrent={isCurrent}>
                {plan.isPopular && <PopularBadge>Mais Popular</PopularBadge>}
                
                <CardContent>
                  <Box textAlign="center" mb={2}>
                    <Typography variant="h5" fontWeight={700}>
                      {plan.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {plan.description}
                    </Typography>
                  </Box>

                  <PriceContainer>
                    {price === 0 ? (
                      <Typography variant="h3" fontWeight={700} color="success.main">
                        Grátis
                      </Typography>
                    ) : (
                      <Price>
                        <Typography variant="h3" fontWeight={700}>
                          {formatCurrency(price)}
                        </Typography>
                        <Typography color="textSecondary">/mês</Typography>
                      </Price>
                    )}
                    {billingCycle !== 'monthly' && price > 0 && (
                      <Typography variant="caption" color="textSecondary">
                        cobrado {billingCycle === 'semiannual' ? 'a cada 6 meses' : 'anualmente'}
                      </Typography>
                    )}
                  </PriceContainer>

                  {/* Limites */}
                  <Box mb={2}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Limites
                    </Typography>
                    <Typography variant="body2">
                      • {plan.limits.products === -1 ? 'Ilimitado' : plan.limits.products} produtos
                    </Typography>
                    <Typography variant="body2">
                      • {plan.limits.ordersPerMonth === -1 ? 'Ilimitado' : plan.limits.ordersPerMonth} pedidos/mês
                    </Typography>
                    <Typography variant="body2">
                      • {plan.limits.employees === -1 ? 'Ilimitado' : plan.limits.employees === 0 ? 'Sem' : plan.limits.employees} funcionários
                    </Typography>
                  </Box>

                  {/* Features principais */}
                  <List dense>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {plan.features.stockManagement ? (
                          <CheckIcon color="success" fontSize="small" />
                        ) : (
                          <CloseIcon color="disabled" fontSize="small" />
                        )}
                      </ListItemIcon>
                      <ListItemText primary="Controle de estoque" />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {plan.features.employeeManagement ? (
                          <CheckIcon color="success" fontSize="small" />
                        ) : (
                          <CloseIcon color="disabled" fontSize="small" />
                        )}
                      </ListItemIcon>
                      <ListItemText primary="Gestão de funcionários" />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {plan.features.publicRanking ? (
                          <CheckIcon color="success" fontSize="small" />
                        ) : (
                          <CloseIcon color="disabled" fontSize="small" />
                        )}
                      </ListItemIcon>
                      <ListItemText primary="Ranking público" />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {plan.features.analytics ? (
                          <CheckIcon color="success" fontSize="small" />
                        ) : (
                          <CloseIcon color="disabled" fontSize="small" />
                        )}
                      </ListItemIcon>
                      <ListItemText primary="Relatórios e análises" />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {plan.features.prioritySupport ? (
                          <CheckIcon color="success" fontSize="small" />
                        ) : (
                          <CloseIcon color="disabled" fontSize="small" />
                        )}
                      </ListItemIcon>
                      <ListItemText primary="Suporte prioritário" />
                    </ListItem>
                  </List>

                  <Box mt={2}>
                    {isCurrent ? (
                      <Button
                        fullWidth
                        variant="outlined"
                        color="success"
                        disabled
                        startIcon={<CheckIcon />}
                      >
                        Plano Atual
                      </Button>
                    ) : plan.pricing.monthly === 0 ? (
                      <Button
                        fullWidth
                        variant="outlined"
                        disabled
                      >
                        Período de teste
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant={plan.isPopular ? 'contained' : 'outlined'}
                        color="primary"
                        startIcon={<UpgradeIcon />}
                        onClick={() => handleUpgrade(plan.id)}
                      >
                        {currentLicense && plan.order > (plans.find(p => p.id === currentLicense.planId)?.order || 0)
                          ? 'Fazer Upgrade'
                          : 'Escolher Plano'}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </PlanCard>
            </Grid>
          );
        })}
      </Grid>

      {/* Info adicional */}
      <Box mt={4}>
        <Alert severity="info" icon={<PaymentIcon />}>
          <Typography variant="subtitle2" fontWeight={600}>
            Pagamento seguro
          </Typography>
          <Typography variant="body2">
            Aceitamos cartão de crédito, PIX e boleto. Cancele quando quiser, sem taxas.
          </Typography>
        </Alert>
      </Box>
    </PageContainer>
  );
};

export default PlansPage;


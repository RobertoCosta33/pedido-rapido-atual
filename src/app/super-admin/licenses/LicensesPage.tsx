'use client';

/**
 * Componente de gestão de licenças
 * Lista e gerencia licenças dos quiosques
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { Card, DataTable } from '@/components';
import { licenseService, License } from '@/services';
import { formatCurrency, formatDate } from '@/utils';

// Styled Components
const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatsCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled(Card)<{ $variant?: 'success' | 'warning' | 'error' | 'info' }>`
  padding: ${({ theme }) => theme.spacing.lg};
  border-left: 4px solid ${({ theme, $variant }) => {
    switch ($variant) {
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  }};
`;

const StatValue = styled(Typography)`
  font-size: 1.75rem;
  font-weight: 700;
`;

const Filters = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PlanBadge = styled(Chip)<{ $plan: string }>`
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.7rem;
`;

const ExpiryBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 120px;
`;

const statusLabels: Record<License['status'], string> = {
  active: 'Ativa',
  expiring_soon: 'Expirando',
  expired: 'Expirada',
  suspended: 'Suspensa',
};

const statusColors: Record<License['status'], 'success' | 'warning' | 'error' | 'default'> = {
  active: 'success',
  expiring_soon: 'warning',
  expired: 'error',
  suspended: 'default',
};

const statusIcons: Record<License['status'], React.ReactNode> = {
  active: <CheckIcon fontSize="small" />,
  expiring_soon: <WarningIcon fontSize="small" />,
  expired: <ErrorIcon fontSize="small" />,
  suspended: <ErrorIcon fontSize="small" />,
};

const planColors: Record<string, 'default' | 'primary' | 'secondary'> = {
  basic: 'default',
  professional: 'primary',
  premium: 'secondary',
};

interface LicenseStats {
  total: number;
  active: number;
  expiringSoon: number;
  expired: number;
  totalRevenue: number;
  byPlan: Record<string, number>;
}

const LicensesPage: React.FC = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [filteredLicenses, setFilteredLicenses] = useState<License[]>([]);
  const [stats, setStats] = useState<LicenseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<License['status'] | 'all'>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLicenseId, setSelectedLicenseId] = useState<string | null>(null);

  // Carrega licenças
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [licensesData, statsData] = await Promise.all([
        licenseService.getAll(),
        licenseService.getStats(),
      ]);
      setLicenses(licensesData);
      setFilteredLicenses(licensesData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar licenças');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtra licenças
  useEffect(() => {
    let result = [...licenses];

    if (statusFilter !== 'all') {
      result = result.filter((l) => l.status === statusFilter);
    }

    if (planFilter !== 'all') {
      result = result.filter((l) => l.plan === planFilter);
    }

    setFilteredLicenses(result);
  }, [licenses, statusFilter, planFilter]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, licenseId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedLicenseId(licenseId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedLicenseId(null);
  };

  const handleRenew = async () => {
    if (!selectedLicenseId) return;

    try {
      await licenseService.renew(selectedLicenseId, 1);
      await loadData();
    } catch (err) {
      console.error('Erro ao renovar licença:', err);
    }

    handleMenuClose();
  };

  // Calcula dias restantes
  const getDaysRemaining = (expiryDate: Date): number => {
    const now = new Date();
    const diff = expiryDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Calcula progresso de expiração
  const getExpiryProgress = (startDate: Date, expiryDate: Date): number => {
    const now = new Date();
    const total = expiryDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  // Colunas da tabela
  const columns = [
    {
      key: 'kioskName' as keyof License,
      label: 'Quiosque',
      render: (name: License['kioskName']) => (
        <Typography variant="body2" fontWeight={600}>
          {name}
        </Typography>
      ),
    },
    {
      key: 'plan' as keyof License,
      label: 'Plano',
      render: (plan: License['plan']) => (
        <PlanBadge
          label={plan}
          $plan={plan}
          color={planColors[plan]}
          size="small"
        />
      ),
    },
    {
      key: 'price' as keyof License,
      label: 'Valor/Mês',
      render: (price: License['price']) => formatCurrency(price),
    },
    {
      key: 'status' as keyof License,
      label: 'Status',
      render: (status: License['status']) => (
        <Chip
          icon={statusIcons[status] as React.ReactElement}
          label={statusLabels[status]}
          color={statusColors[status]}
          size="small"
        />
      ),
    },
    {
      key: 'expiryDate' as keyof License,
      label: 'Validade',
      render: (_: License['expiryDate'], license: License) => {
        const daysRemaining = getDaysRemaining(license.expiryDate);
        const progress = getExpiryProgress(license.startDate, license.expiryDate);
        const color = daysRemaining < 30 ? 'error' : daysRemaining < 60 ? 'warning' : 'primary';

        return (
          <ExpiryBar>
            <Typography variant="caption">
              {formatDate(license.expiryDate)}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={color}
              sx={{ height: 6, borderRadius: 3 }}
            />
            <Typography variant="caption" color={daysRemaining < 30 ? 'error' : 'textSecondary'}>
              {daysRemaining > 0 ? `${daysRemaining} dias restantes` : 'Expirada'}
            </Typography>
          </ExpiryBar>
        );
      },
    },
    {
      key: 'id' as keyof License,
      label: 'Ações',
      width: '80px',
      render: (_: unknown, license: License) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e, license.id)}
        >
          <MoreIcon />
        </IconButton>
      ),
    },
  ];

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
        <Typography variant="h4" fontWeight={700}>
          Gestão de Licenças
        </Typography>
      </Header>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Estatísticas */}
      {stats && (
        <StatsCards>
          <StatCard $variant="info">
            <StatValue>{stats.total}</StatValue>
            <Typography color="textSecondary" variant="body2">
              Total de Licenças
            </Typography>
          </StatCard>
          <StatCard $variant="success">
            <StatValue>{stats.active}</StatValue>
            <Typography color="textSecondary" variant="body2">
              Ativas
            </Typography>
          </StatCard>
          <StatCard $variant="warning">
            <StatValue>{stats.expiringSoon}</StatValue>
            <Typography color="textSecondary" variant="body2">
              Expirando em 30 dias
            </Typography>
          </StatCard>
          <StatCard $variant="error">
            <StatValue>{stats.expired}</StatValue>
            <Typography color="textSecondary" variant="body2">
              Expiradas
            </Typography>
          </StatCard>
          <StatCard>
            <StatValue>{formatCurrency(stats.totalRevenue)}</StatValue>
            <Typography color="textSecondary" variant="body2">
              Receita Total
            </Typography>
          </StatCard>
        </StatsCards>
      )}

      {/* Filtros */}
      <Filters>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value as License['status'] | 'all')}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="active">Ativas</MenuItem>
            <MenuItem value="expiring_soon">Expirando</MenuItem>
            <MenuItem value="expired">Expiradas</MenuItem>
            <MenuItem value="suspended">Suspensas</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Plano</InputLabel>
          <Select
            value={planFilter}
            label="Plano"
            onChange={(e) => setPlanFilter(e.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="basic">Basic</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="premium">Premium</MenuItem>
          </Select>
        </FormControl>
      </Filters>

      {/* Tabela */}
      <Card>
        <DataTable
          columns={columns}
          data={filteredLicenses}
          emptyMessage="Nenhuma licença encontrada"
        />
      </Card>

      {/* Menu de ações */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleRenew}>Renovar (+1 mês)</MenuItem>
        <MenuItem onClick={handleMenuClose}>Alterar Plano</MenuItem>
        <MenuItem onClick={handleMenuClose}>Ver Histórico</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          Suspender
        </MenuItem>
      </Menu>
    </PageContainer>
  );
};

export default LicensesPage;


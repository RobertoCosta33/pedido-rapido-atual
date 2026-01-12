'use client';

/**
 * Componente de gestão de pedidos
 * Lista e gerencia pedidos do quiosque
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  TableRestaurant as TableIcon,
} from '@mui/icons-material';
import { Card } from '@/components';
import { orderService } from '@/services';
import { Order, OrderStatus } from '@/types';
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
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatCard = styled(Card)<{ $color?: string }>`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
  border-top: 3px solid ${({ $color, theme }) => $color || theme.colors.primary};
`;

const OrdersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const OrderCard = styled(Card)<{ $status: OrderStatus }>`
  border-left: 4px solid ${({ $status, theme }) => {
    switch ($status) {
      case 'pending':
        return '#FFA726';
      case 'confirmed':
        return '#42A5F5';
      case 'preparing':
        return '#AB47BC';
      case 'ready':
        return '#66BB6A';
      case 'delivered':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.border;
    }
  }};
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const OrderBody = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  font-size: 0.875rem;
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
`;

const CustomerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  ready: 'Pronto',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const statusColors: Record<OrderStatus, 'warning' | 'info' | 'secondary' | 'success' | 'default' | 'error'> = {
  pending: 'warning',
  confirmed: 'info',
  preparing: 'secondary',
  ready: 'success',
  delivered: 'default',
  cancelled: 'error',
};

const statusStats = [
  { status: 'pending' as OrderStatus, label: 'Pendentes', color: '#FFA726' },
  { status: 'confirmed' as OrderStatus, label: 'Confirmados', color: '#42A5F5' },
  { status: 'preparing' as OrderStatus, label: 'Preparando', color: '#AB47BC' },
  { status: 'ready' as OrderStatus, label: 'Prontos', color: '#66BB6A' },
];

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  // Simula kioskId do usuário logado
  const kioskId = 'kiosk_001';

  // Carrega pedidos
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await orderService.getByKiosk(kioskId);
      setOrders(data);
      setFilteredOrders(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar pedidos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [kioskId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtra pedidos por status
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((o) => o.status === statusFilter));
    }
  }, [orders, statusFilter]);

  // Filtra pedidos por tab
  useEffect(() => {
    const activeStatuses: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready'];
    const completedStatuses: OrderStatus[] = ['delivered', 'cancelled'];

    if (tabValue === 0) {
      // Ativos
      setFilteredOrders(orders.filter((o) => activeStatuses.includes(o.status)));
    } else {
      // Histórico
      setFilteredOrders(orders.filter((o) => completedStatuses.includes(o.status)));
    }
  }, [orders, tabValue]);

  // Conta pedidos por status
  const getStatusCount = (status: OrderStatus) => {
    return orders.filter((o) => o.status === status).length;
  };

  // Atualiza status do pedido
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      await loadData();
    } catch (err) {
      console.error('Erro ao atualizar pedido:', err);
    }
  };

  // Próximo status
  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const flow: Partial<Record<OrderStatus, OrderStatus>> = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'delivered',
    };
    return flow[currentStatus] || null;
  };

  const getNextStatusLabel = (currentStatus: OrderStatus): string | null => {
    const nextStatus = getNextStatus(currentStatus);
    return nextStatus ? statusLabels[nextStatus] : null;
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
        <Typography variant="h4" fontWeight={700}>
          Gestão de Pedidos
        </Typography>
        <IconButton onClick={loadData} color="primary">
          <RefreshIcon />
        </IconButton>
      </Header>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Estatísticas */}
      <StatsCards>
        {statusStats.map((stat) => (
          <StatCard key={stat.status} $color={stat.color}>
            <Typography variant="h4" fontWeight={700}>
              {getStatusCount(stat.status)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {stat.label}
            </Typography>
          </StatCard>
        ))}
      </StatsCards>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label={`Ativos (${orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length})`} />
          <Tab label={`Histórico (${orders.filter((o) => ['delivered', 'cancelled'].includes(o.status)).length})`} />
        </Tabs>
      </Box>

      {/* Filtro de status para histórico */}
      {tabValue === 1 && (
        <Box mb={3}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="delivered">Entregues</MenuItem>
              <MenuItem value="cancelled">Cancelados</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Grid de pedidos */}
      <OrdersGrid>
        {filteredOrders.length === 0 ? (
          <Card>
            <Box p={4} textAlign="center">
              <Typography color="textSecondary">
                Nenhum pedido encontrado
              </Typography>
            </Box>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} $status={order.status}>
              <OrderHeader>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    #{order.id.slice(-3)}
                  </Typography>
                  <CustomerInfo>
                    <TimeIcon fontSize="small" />
                    {formatDate(order.createdAt)}
                  </CustomerInfo>
                </Box>
                <Chip
                  label={statusLabels[order.status]}
                  color={statusColors[order.status]}
                  size="small"
                />
              </OrderHeader>

              <OrderBody>
                <CustomerInfo style={{ marginBottom: 12 }}>
                  <PersonIcon fontSize="small" />
                  {order.customerName}
                  {order.tableNumber && (
                    <>
                      <TableIcon fontSize="small" style={{ marginLeft: 8 }} />
                      Mesa {order.tableNumber}
                    </>
                  )}
                </CustomerInfo>

                {order.items.slice(0, 3).map((item) => (
                  <OrderItem key={item.id}>
                    <span>
                      {item.quantity}x {item.productName}
                    </span>
                    <span>{formatCurrency(item.totalPrice)}</span>
                  </OrderItem>
                ))}

                {order.items.length > 3 && (
                  <Typography variant="caption" color="textSecondary">
                    +{order.items.length - 3} itens...
                  </Typography>
                )}
              </OrderBody>

              <OrderFooter>
                <Typography variant="h6" fontWeight={700}>
                  {formatCurrency(order.total)}
                </Typography>

                {getNextStatus(order.status) && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleUpdateStatus(order.id, getNextStatus(order.status)!)}
                  >
                    {getNextStatusLabel(order.status)}
                  </Button>
                )}

                {order.status === 'pending' && (
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                    sx={{ ml: 1 }}
                  >
                    Cancelar
                  </Button>
                )}
              </OrderFooter>
            </OrderCard>
          ))
        )}
      </OrdersGrid>
    </PageContainer>
  );
};

export default OrdersPage;


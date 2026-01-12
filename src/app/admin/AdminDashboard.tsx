'use client';

/**
 * Dashboard do Admin do Quiosque
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Card, Button } from '@/components';
import { formatCurrency } from '@/utils/formatters';
import { ORDER_STATUS } from '@/utils/constants';

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
  animation: ${fadeIn} 0.5s ease-out;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled.div<{ $color: string }>`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 80px;
    height: 80px;
    background: ${({ $color }) => $color}15;
    border-radius: 50%;
    transform: translate(20px, -20px);
  }
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ $color }) => `${$color}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  svg {
    width: 24px;
    height: 24px;
    color: ${({ $color }) => $color};
  }
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div``;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.elevated};
    transform: translateX(4px);
  }
`;

const OrderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const OrderNumber = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const OrderCustomer = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const OrderStatus = styled.span<{ $status: keyof typeof ORDER_STATUS }>`
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $status }) => ORDER_STATUS[$status].bgColor};
  color: ${({ $status }) => ORDER_STATUS[$status].color};
`;

const OrderTime = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AlertItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.warning.main}15;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 3px solid ${({ theme }) => theme.colors.warning.main};
  
  svg {
    color: ${({ theme }) => theme.colors.warning.main};
  }
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertTitle = styled.p`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  font-size: 0.9375rem;
`;

const AlertSubtitle = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 4px 0 0;
`;

const TopProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TopProductItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ProductRank = styled.span`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.primary.main}20;
  color: ${({ theme }) => theme.colors.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductName = styled.p`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const ProductSales = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 2px 0 0;
`;

const ProductRevenue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.success.main};
`;

// Mock data
const stats = [
  { icon: <ShoppingCartIcon />, label: 'Pedidos Hoje', value: '47', color: '#FF6B35' },
  { icon: <AttachMoneyIcon />, label: 'Faturamento', value: formatCurrency(3847.50), color: '#2ECC71' },
  { icon: <RestaurantIcon />, label: 'Itens Vendidos', value: '156', color: '#33B5E5' },
  { icon: <WarningAmberIcon />, label: 'Alertas Estoque', value: '3', color: '#FFBB33' },
];

const recentOrders = [
  { id: '#1247', customer: 'Mesa 12', status: 'preparing' as const, time: '5 min' },
  { id: '#1246', customer: 'João Silva', status: 'ready' as const, time: '8 min' },
  { id: '#1245', customer: 'Mesa 5', status: 'pending' as const, time: '2 min' },
  { id: '#1244', customer: 'Maria Santos', status: 'delivered' as const, time: '15 min' },
];

const stockAlerts = [
  { name: 'Refrigerante Lata', current: 8, minimum: 50 },
  { name: 'Pão Brioche', current: 12, minimum: 20 },
  { name: 'Bacon', current: 450, minimum: 500, unit: 'g' },
];

const topProducts = [
  { name: 'X-Burger Clássico', sales: 45, revenue: 1300.50 },
  { name: 'Batata Frita', sales: 38, revenue: 718.20 },
  { name: 'X-Bacon Supreme', sales: 32, revenue: 1116.80 },
  { name: 'Refrigerante Lata', sales: 67, revenue: 462.30 },
  { name: 'Brownie com Sorvete', sales: 21, revenue: 480.90 },
];

export const AdminDashboard: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>Bem-vindo! Aqui está o resumo do seu quiosque hoje.</Subtitle>
      </Header>
      
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index} $color={stat.color}>
            <StatIcon $color={stat.color}>{stat.icon}</StatIcon>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>
      
      <Grid>
        <Section>
          <SectionHeader>
            <SectionTitle>Pedidos Recentes</SectionTitle>
            <Button variant="ghost" size="small">
              Ver todos
            </Button>
          </SectionHeader>
          
          <Card padding="12px">
            <OrderList>
              {recentOrders.map((order) => (
                <OrderItem key={order.id}>
                  <OrderInfo>
                    <div>
                      <OrderNumber>{order.id}</OrderNumber>
                      <OrderCustomer> • {order.customer}</OrderCustomer>
                    </div>
                  </OrderInfo>
                  <OrderStatus $status={order.status}>
                    {ORDER_STATUS[order.status].label}
                  </OrderStatus>
                  <OrderTime>
                    <AccessTimeIcon />
                    {order.time}
                  </OrderTime>
                </OrderItem>
              ))}
            </OrderList>
          </Card>
        </Section>
        
        <Section>
          <SectionHeader>
            <SectionTitle>Alertas de Estoque</SectionTitle>
            <Button variant="ghost" size="small">
              Ver estoque
            </Button>
          </SectionHeader>
          
          <Card padding="12px">
            <AlertList>
              {stockAlerts.map((alert, index) => (
                <AlertItem key={index}>
                  <WarningAmberIcon />
                  <AlertContent>
                    <AlertTitle>{alert.name}</AlertTitle>
                    <AlertSubtitle>
                      Atual: {alert.current}{alert.unit || ' un'} | Mínimo: {alert.minimum}{alert.unit || ' un'}
                    </AlertSubtitle>
                  </AlertContent>
                  <Button variant="outline" size="small">
                    Repor
                  </Button>
                </AlertItem>
              ))}
            </AlertList>
          </Card>
        </Section>
        
        <Section>
          <SectionHeader>
            <SectionTitle>Produtos Mais Vendidos</SectionTitle>
          </SectionHeader>
          
          <Card>
            <TopProductsList>
              {topProducts.map((product, index) => (
                <TopProductItem key={index}>
                  <ProductRank>{index + 1}</ProductRank>
                  <ProductInfo>
                    <ProductName>{product.name}</ProductName>
                    <ProductSales>{product.sales} vendas hoje</ProductSales>
                  </ProductInfo>
                  <ProductRevenue>{formatCurrency(product.revenue)}</ProductRevenue>
                </TopProductItem>
              ))}
            </TopProductsList>
          </Card>
        </Section>
      </Grid>
    </Container>
  );
};


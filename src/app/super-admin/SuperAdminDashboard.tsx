'use client';

/**
 * Dashboard do Super Admin
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';
import StoreIcon from '@mui/icons-material/Store';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Card, DataTable, Button } from '@/components';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Kiosk, TableColumn } from '@/types';

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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled.div<{ $color: string }>`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.transitions.normal};
  border-left: 4px solid ${({ $color }) => $color};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
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
  
  svg {
    width: 24px;
    height: 24px;
    color: ${({ $color }) => $color};
  }
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StatChange = styled.div<{ $positive: boolean }>`
  font-size: 0.75rem;
  color: ${({ theme, $positive }) =>
    $positive ? theme.colors.success.main : theme.colors.error.main};
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: ${({ theme }) => theme.spacing.xs};
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
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

const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AlertItem = styled.div<{ $type: 'warning' | 'success' | 'info' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme, $type }) => {
    switch ($type) {
      case 'warning':
        return `${theme.colors.warning.main}15`;
      case 'success':
        return `${theme.colors.success.main}15`;
      default:
        return `${theme.colors.info.main}15`;
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 3px solid ${({ theme, $type }) => {
    switch ($type) {
      case 'warning':
        return theme.colors.warning.main;
      case 'success':
        return theme.colors.success.main;
      default:
        return theme.colors.info.main;
    }
  }};
  
  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme, $type }) => {
      switch ($type) {
        case 'warning':
          return theme.colors.warning.main;
        case 'success':
          return theme.colors.success.main;
        default:
          return theme.colors.info.main;
      }
    }};
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

const AlertTime = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ theme, $active }) =>
    $active ? `${theme.colors.success.main}20` : `${theme.colors.error.main}20`};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.success.main : theme.colors.error.main};
`;

// Mock data
const stats = [
  {
    icon: <StoreIcon />,
    label: 'Quiosques Ativos',
    value: '127',
    change: '+12%',
    positive: true,
    color: '#FF6B35',
  },
  {
    icon: <PeopleIcon />,
    label: 'Usuários',
    value: '1,847',
    change: '+8%',
    positive: true,
    color: '#2ECC71',
  },
  {
    icon: <ReceiptIcon />,
    label: 'Pedidos Hoje',
    value: '3,421',
    change: '+23%',
    positive: true,
    color: '#33B5E5',
  },
  {
    icon: <TrendingUpIcon />,
    label: 'Receita Mensal',
    value: formatCurrency(284750),
    change: '+18%',
    positive: true,
    color: '#9B59B6',
  },
];

const mockKiosks: Kiosk[] = [
  {
    id: '1',
    name: 'Quiosque Praia Central',
    slug: 'praia-central',
    description: '',
    address: { street: '', number: '', neighborhood: '', city: 'Balneário Camboriú', state: 'SC', zipCode: '', country: 'Brasil' },
    contact: { phone: '', email: '' },
    operatingHours: [],
    isActive: true,
    isPublic: true,
    licenseExpiry: new Date('2026-06-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    ownerId: '2',
    settings: { allowOnlineOrders: true, allowTableOrders: true, requirePaymentUpfront: false, estimatedPrepTime: 15, maxOrdersPerHour: 50, notificationEmail: '', theme: { primaryColor: '', secondaryColor: '' } },
  },
  {
    id: '2',
    name: 'Bar do João',
    slug: 'bar-joao',
    description: '',
    address: { street: '', number: '', neighborhood: '', city: 'Florianópolis', state: 'SC', zipCode: '', country: 'Brasil' },
    contact: { phone: '', email: '' },
    operatingHours: [],
    isActive: true,
    isPublic: true,
    licenseExpiry: new Date('2026-03-20'),
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date(),
    ownerId: '3',
    settings: { allowOnlineOrders: true, allowTableOrders: true, requirePaymentUpfront: false, estimatedPrepTime: 15, maxOrdersPerHour: 50, notificationEmail: '', theme: { primaryColor: '', secondaryColor: '' } },
  },
  {
    id: '3',
    name: 'Lanchonete Express',
    slug: 'lanchonete-express',
    description: '',
    address: { street: '', number: '', neighborhood: '', city: 'Joinville', state: 'SC', zipCode: '', country: 'Brasil' },
    contact: { phone: '', email: '' },
    operatingHours: [],
    isActive: false,
    isPublic: false,
    licenseExpiry: new Date('2025-12-01'),
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date(),
    ownerId: '4',
    settings: { allowOnlineOrders: true, allowTableOrders: true, requirePaymentUpfront: false, estimatedPrepTime: 15, maxOrdersPerHour: 50, notificationEmail: '', theme: { primaryColor: '', secondaryColor: '' } },
  },
];

const alerts = [
  { type: 'warning' as const, title: 'Licença expirando em 30 dias', subtitle: 'Quiosque Praia Central', time: 'há 2 horas' },
  { type: 'success' as const, title: 'Novo quiosque cadastrado', subtitle: 'Bar do João', time: 'há 5 horas' },
  { type: 'warning' as const, title: '3 quiosques com estoque baixo', subtitle: '', time: 'há 1 dia' },
];

const columns: TableColumn<Kiosk>[] = [
  { key: 'name', label: 'Nome', sortable: true },
  { key: 'address', label: 'Cidade', render: (_, item) => `${item.address.city}/${item.address.state}` },
  { 
    key: 'isActive', 
    label: 'Status', 
    render: (value) => (
      <StatusBadge $active={value as boolean}>
        {value ? 'Ativo' : 'Inativo'}
      </StatusBadge>
    ),
    align: 'center',
  },
  { 
    key: 'licenseExpiry', 
    label: 'Licença até', 
    render: (value) => formatDate(value as Date),
  },
];

export const SuperAdminDashboard: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>Visão geral do sistema Pedido Rápido</Subtitle>
      </Header>
      
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index} $color={stat.color}>
            <StatIcon $color={stat.color}>{stat.icon}</StatIcon>
            <StatContent>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
              <StatChange $positive={stat.positive}>
                <TrendingUpIcon />
                {stat.change} este mês
              </StatChange>
            </StatContent>
          </StatCard>
        ))}
      </StatsGrid>
      
      <SectionGrid>
        <Section>
          <SectionHeader>
            <SectionTitle>Quiosques Recentes</SectionTitle>
            <Button variant="ghost" size="small">
              Ver todos
            </Button>
          </SectionHeader>
          
          <DataTable
            columns={columns}
            data={mockKiosks}
            keyExtractor={(item) => item.id}
            pagination={false}
          />
        </Section>
        
        <Section>
          <SectionHeader>
            <SectionTitle>Alertas</SectionTitle>
          </SectionHeader>
          
          <Card padding="0">
            <AlertList>
              {alerts.map((alert, index) => (
                <AlertItem key={index} $type={alert.type}>
                  {alert.type === 'warning' ? <WarningIcon /> : <CheckCircleIcon />}
                  <AlertContent>
                    <AlertTitle>{alert.title}</AlertTitle>
                    {alert.subtitle && <AlertTime>{alert.subtitle}</AlertTime>}
                  </AlertContent>
                  <AlertTime>{alert.time}</AlertTime>
                </AlertItem>
              ))}
            </AlertList>
          </Card>
        </Section>
      </SectionGrid>
    </Container>
  );
};


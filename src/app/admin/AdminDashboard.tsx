"use client";

/**
 * Dashboard do Admin do Quiosque
 * Mostra estatísticas, pedidos recentes e alertas de estoque
 */

import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { CircularProgress, Box } from "@mui/material";
import { Card, Button } from "@/components";
import { formatCurrency } from "@/utils/formatters";
import { ORDER_STATUS } from "@/utils/constants";
import { orderService, mockDataService } from "@/services";
import { Order } from "@/types";
import Link from "next/link";

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
    content: "";
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

const OrderStatusBadge = styled.span<{ $status: keyof typeof ORDER_STATUS }>`
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $status }) => ORDER_STATUS[$status]?.bgColor || "#e0e0e0"};
  color: ${({ $status }) => ORDER_STATUS[$status]?.color || "#666"};
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

const EmptyMessage = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing.lg};
`;

interface DashboardStats {
  ordersToday: number;
  revenueToday: number;
  itemsSold: number;
  lowStockAlerts: number;
}

interface StockAlert {
  name: string;
  current: number;
  minimum: number;
  unit: string;
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    ordersToday: 0,
    revenueToday: 0,
    itemsSold: 0,
    lowStockAlerts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  const kioskId = "kiosk_001";

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Carrega pedidos
      const orders = await orderService.getByKiosk(kioskId, { limit: 50 });

      // Pedidos recentes (últimos 5 não completados)
      const recent = orders
        .filter((o) => !["delivered", "cancelled"].includes(o.status))
        .slice(0, 5);
      setRecentOrders(recent);

      // Estatísticas
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayOrders = orders.filter((o) => new Date(o.createdAt) >= today);
      const deliveredToday = todayOrders.filter(
        (o) => o.status === "delivered"
      );

      const revenueToday = deliveredToday.reduce((sum, o) => sum + o.total, 0);
      const itemsSold = deliveredToday.reduce(
        (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
        0
      );

      // Alertas de estoque baixo
      const lowStock = mockDataService.getLowStockItems(kioskId);
      setStockAlerts(
        lowStock.slice(0, 5).map((item) => ({
          name: item.name,
          current: item.currentStock,
          minimum: item.minimumStock,
          unit: item.unit,
        }))
      );

      setStats({
        ordersToday: todayOrders.length,
        revenueToday,
        itemsSold,
        lowStockAlerts: lowStock.length,
      });

      // Produtos mais vendidos
      const productCounts: Record<
        string,
        { name: string; sales: number; revenue: number }
      > = {};
      for (const order of deliveredToday) {
        for (const item of order.items) {
          if (!productCounts[item.productId]) {
            productCounts[item.productId] = {
              name: item.productName,
              sales: 0,
              revenue: 0,
            };
          }
          productCounts[item.productId].sales += item.quantity;
          productCounts[item.productId].revenue += item.total;
        }
      }

      const top = Object.values(productCounts)
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);
      setTopProducts(top);
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, [kioskId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calcula tempo decorrido
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 60000);
    if (diff < 1) return "Agora";
    if (diff < 60) return `${diff} min`;
    return `${Math.floor(diff / 60)}h`;
  };

  if (loading) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const statsData = [
    {
      icon: <ShoppingCartIcon />,
      label: "Pedidos Hoje",
      value: String(stats.ordersToday),
      color: "#FF6B35",
    },
    {
      icon: <AttachMoneyIcon />,
      label: "Faturamento",
      value: formatCurrency(stats.revenueToday),
      color: "#2ECC71",
    },
    {
      icon: <RestaurantIcon />,
      label: "Itens Vendidos",
      value: String(stats.itemsSold),
      color: "#33B5E5",
    },
    {
      icon: <WarningAmberIcon />,
      label: "Alertas Estoque",
      value: String(stats.lowStockAlerts),
      color: "#FFBB33",
    },
  ];

  return (
    <Container>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>Bem-vindo! Aqui está o resumo do seu quiosque hoje.</Subtitle>
      </Header>

      <StatsGrid>
        {statsData.map((stat, index) => (
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
            <Link href="/admin/orders">
              <Button variant="ghost" size="small">
                Ver todos
              </Button>
            </Link>
          </SectionHeader>

          <Card padding="12px">
            {recentOrders.length === 0 ? (
              <EmptyMessage>Nenhum pedido pendente</EmptyMessage>
            ) : (
              <OrderList>
                {recentOrders.map((order) => (
                  <OrderItem key={order.id}>
                    <OrderInfo>
                      <div>
                        <OrderNumber>#{order.id.slice(-3)}</OrderNumber>
                        <OrderCustomer>
                          {" "}
                          • Cliente {order.customerId.slice(-4)}
                        </OrderCustomer>
                      </div>
                    </OrderInfo>
                    <OrderStatusBadge
                      $status={order.status as keyof typeof ORDER_STATUS}
                    >
                      {ORDER_STATUS[order.status as keyof typeof ORDER_STATUS]
                        ?.label || order.status}
                    </OrderStatusBadge>
                    <OrderTime>
                      <AccessTimeIcon />
                      {getTimeAgo(new Date(order.createdAt))}
                    </OrderTime>
                  </OrderItem>
                ))}
              </OrderList>
            )}
          </Card>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Alertas de Estoque</SectionTitle>
            <Link href="/admin/stock">
              <Button variant="ghost" size="small">
                Ver estoque
              </Button>
            </Link>
          </SectionHeader>

          <Card padding="12px">
            {stockAlerts.length === 0 ? (
              <EmptyMessage>Nenhum alerta de estoque</EmptyMessage>
            ) : (
              <AlertList>
                {stockAlerts.map((alert, index) => (
                  <AlertItem key={index}>
                    <WarningAmberIcon />
                    <AlertContent>
                      <AlertTitle>{alert.name}</AlertTitle>
                      <AlertSubtitle>
                        Atual: {alert.current} {alert.unit} | Mínimo:{" "}
                        {alert.minimum} {alert.unit}
                      </AlertSubtitle>
                    </AlertContent>
                    <Button variant="outline" size="small">
                      Repor
                    </Button>
                  </AlertItem>
                ))}
              </AlertList>
            )}
          </Card>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Produtos Mais Vendidos</SectionTitle>
          </SectionHeader>

          <Card>
            {topProducts.length === 0 ? (
              <EmptyMessage>Nenhuma venda hoje</EmptyMessage>
            ) : (
              <TopProductsList>
                {topProducts.map((product, index) => (
                  <TopProductItem key={index}>
                    <ProductRank>{index + 1}</ProductRank>
                    <ProductInfo>
                      <ProductName>{product.name}</ProductName>
                      <ProductSales>{product.sales} vendas hoje</ProductSales>
                    </ProductInfo>
                    <ProductRevenue>
                      {formatCurrency(product.revenue)}
                    </ProductRevenue>
                  </TopProductItem>
                ))}
              </TopProductsList>
            )}
          </Card>
        </Section>
      </Grid>
    </Container>
  );
};

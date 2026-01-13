'use client';

/**
 * Layout do painel Admin do Quiosque
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CategoryIcon from '@mui/icons-material/Category';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PaymentIcon from '@mui/icons-material/Payment';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useRouter } from 'next/navigation';
import { Sidebar, NavSectionData } from '@/components';
import { useAuth, useTheme } from '@/contexts';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.default};
`;

const Main = styled.main`
  flex: 1;
  margin-left: 280px;
  transition: margin-left ${({ theme }) => theme.transitions.normal};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0;
  }
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.paper};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.subtle};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

const KioskName = styled.h1`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const navSections: NavSectionData[] = [
  {
    title: 'Principal',
    items: [
      { href: '/admin', label: 'Dashboard', icon: <DashboardIcon /> },
      { href: '/admin/orders', label: 'Pedidos', icon: <ShoppingCartIcon />, badge: 5 },
    ],
  },
  {
    title: 'Cardápio',
    items: [
      { href: '/admin/products', label: 'Produtos', icon: <RestaurantMenuIcon /> },
      { href: '/admin/categories', label: 'Categorias', icon: <CategoryIcon /> },
      { href: '/admin/menu', label: 'Menu', icon: <MenuBookIcon /> },
    ],
  },
  {
    title: 'Estoque',
    items: [
      { href: '/admin/stock', label: 'Insumos', icon: <InventoryIcon />, badge: 2 },
      { href: '/admin/recipes', label: 'Receitas', icon: <ReceiptLongIcon /> },
    ],
  },
  {
    title: 'Equipe',
    items: [
      { href: '/admin/employees', label: 'Funcionários', icon: <PeopleIcon /> },
      { href: '/admin/ratings', label: 'Avaliações', icon: <StarIcon /> },
      { href: '/ranking', label: 'Ranking Público', icon: <EmojiEventsIcon /> },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { href: '/admin/plans', label: 'Meu Plano', icon: <PaymentIcon /> },
      { href: '/admin/settings', label: 'Configurações', icon: <SettingsIcon /> },
    ],
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { toggleTheme, isDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  /**
   * Executa logout e redireciona para login
   */
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  return (
    <Container>
      <Sidebar
        sections={navSections}
        userName={user?.name || 'Admin'}
        userRole="Administrador"
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        onLogout={handleLogout}
      />
      
      <Main>
        <Header>
          <HeaderLeft>
            <MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
              <MenuIcon />
            </MobileMenuButton>
            <KioskName>Quiosque Praia Central</KioskName>
          </HeaderLeft>
          
          <HeaderRight>
            <IconButton onClick={toggleTheme}>
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            
            <IconButton>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </HeaderRight>
        </Header>
        
        <Content>{children}</Content>
      </Main>
    </Container>
  );
};

export default AdminLayout;


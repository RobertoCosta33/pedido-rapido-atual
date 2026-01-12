'use client';

/**
 * Layout do painel Super Admin
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StoreIcon from '@mui/icons-material/Store';
import PeopleIcon from '@mui/icons-material/People';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import { Sidebar, NavSectionData } from '@/components';
import { useAuth } from '@/contexts';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.default};
`;

const Main = styled.main<{ $sidebarCollapsed: boolean }>`
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

const PageTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const navSections: NavSectionData[] = [
  {
    title: 'Principal',
    items: [
      { href: '/super-admin', label: 'Dashboard', icon: <DashboardIcon /> },
      { href: '/super-admin/kiosks', label: 'Quiosques', icon: <StoreIcon />, badge: 3 },
      { href: '/super-admin/users', label: 'Usuários', icon: <PeopleIcon /> },
    ],
  },
  {
    title: 'Gestão',
    items: [
      { href: '/super-admin/licenses', label: 'Licenças', icon: <CardMembershipIcon /> },
      { href: '/super-admin/reports', label: 'Relatórios', icon: <AssessmentIcon /> },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { href: '/super-admin/settings', label: 'Configurações', icon: <SettingsIcon /> },
    ],
  },
];

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

const SuperAdminLayout = ({ children }: SuperAdminLayoutProps) => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <Container>
      <Sidebar
        sections={navSections}
        userName={user?.name || 'Super Admin'}
        userRole="Super Administrador"
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      
      <Main $sidebarCollapsed={false}>
        <Header>
          <MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
            <MenuIcon />
          </MobileMenuButton>
          <PageTitle>Super Admin</PageTitle>
          <div />
        </Header>
        
        <Content>{children}</Content>
      </Main>
    </Container>
  );
};

export default SuperAdminLayout;


/**
 * Componente Sidebar para navegação dos painéis admin
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {
  SidebarContainer,
  SidebarOverlay,
  Logo,
  LogoIcon,
  LogoText,
  Navigation,
  NavSection,
  NavSectionTitle,
  NavItem,
  NavItemText,
  NavBadge,
  SidebarFooter,
  CollapseButton,
  UserInfo,
  UserAvatar,
  UserDetails,
  UserName,
  UserRole,
} from './styles';

export interface NavItemData {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface NavSectionData {
  title?: string;
  items: NavItemData[];
}

export interface SidebarProps {
  sections: NavSectionData[];
  userName?: string;
  userRole?: string;
  userInitials?: string;
  onUserClick?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  userName = 'Usuário',
  userRole = 'Admin',
  userInitials,
  onUserClick,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  return (
    <>
      <SidebarOverlay $isOpen={isMobileOpen} onClick={onMobileClose} />
      
      <SidebarContainer $isCollapsed={isCollapsed} $isMobileOpen={isMobileOpen}>
        <Logo $isCollapsed={isCollapsed}>
          <LogoIcon>PR</LogoIcon>
          <LogoText $isCollapsed={isCollapsed}>Pedido Rápido</LogoText>
        </Logo>
        
        <Navigation>
          {sections.map((section, sectionIndex) => (
            <NavSection key={sectionIndex}>
              {section.title && (
                <NavSectionTitle $isCollapsed={isCollapsed}>
                  {section.title}
                </NavSectionTitle>
              )}
              
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                
                return (
                  <Link key={item.href} href={item.href} passHref legacyBehavior>
                    <NavItem
                      $isActive={isActive}
                      $isCollapsed={isCollapsed}
                      title={isCollapsed ? item.label : undefined}
                      onClick={onMobileClose}
                    >
                      {item.icon}
                      <NavItemText $isCollapsed={isCollapsed}>{item.label}</NavItemText>
                      {item.badge && !isCollapsed && <NavBadge>{item.badge}</NavBadge>}
                    </NavItem>
                  </Link>
                );
              })}
            </NavSection>
          ))}
        </Navigation>
        
        <SidebarFooter $isCollapsed={isCollapsed}>
          <UserInfo $isCollapsed={isCollapsed} onClick={onUserClick}>
            <UserAvatar>{userInitials || getInitials(userName)}</UserAvatar>
            <UserDetails $isCollapsed={isCollapsed}>
              <UserName>{userName}</UserName>
              <UserRole>{userRole}</UserRole>
            </UserDetails>
          </UserInfo>
          
          <CollapseButton
            $isCollapsed={isCollapsed}
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expandir' : 'Recolher'}
          >
            <ChevronLeftIcon />
            {!isCollapsed && <span>Recolher menu</span>}
          </CollapseButton>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;


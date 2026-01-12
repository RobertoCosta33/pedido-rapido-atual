/**
 * Estilos do componente Sidebar
 */

import styled, { css } from 'styled-components';

interface SidebarContainerProps {
  $isCollapsed: boolean;
  $isMobileOpen: boolean;
}

export const SidebarContainer = styled.aside<SidebarContainerProps>`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${({ $isCollapsed }) => ($isCollapsed ? '80px' : '280px')};
  background: ${({ theme }) => theme.colors.background.paper};
  border-right: 1px solid ${({ theme }) => theme.colors.border.light};
  display: flex;
  flex-direction: column;
  transition: width ${({ theme }) => theme.transitions.normal};
  z-index: 100;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 280px;
    transform: translateX(${({ $isMobileOpen }) => ($isMobileOpen ? '0' : '-100%')});
    box-shadow: ${({ $isMobileOpen, theme }) => ($isMobileOpen ? theme.shadows.xl : 'none')};
  }
`;

export const SidebarOverlay = styled.div<{ $isOpen: boolean }>`
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
`;

export const Logo = styled.div<{ $isCollapsed: boolean }>`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  min-height: 72px;
  
  ${({ $isCollapsed }) =>
    $isCollapsed &&
    css`
      justify-content: center;
      padding: ${({ theme }) => theme.spacing.md};
    `}
`;

export const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary.main} 0%, ${({ theme }) => theme.colors.primary.dark} 100%);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
`;

export const LogoText = styled.span<{ $isCollapsed: boolean }>`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  transition: opacity ${({ theme }) => theme.transitions.fast};
`;

export const Navigation = styled.nav`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  overflow-y: auto;
`;

export const NavSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const NavSectionTitle = styled.span<{ $isCollapsed: boolean }>`
  display: ${({ $isCollapsed }) => ($isCollapsed ? 'none' : 'block')};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 0 ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

interface NavItemProps {
  $isActive: boolean;
  $isCollapsed: boolean;
}

export const NavItem = styled.a<NavItemProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme, $isActive }) => ($isActive ? theme.colors.primary.main : theme.colors.text.secondary)};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  
  ${({ $isCollapsed }) =>
    $isCollapsed &&
    css`
      justify-content: center;
      padding: ${({ theme }) => theme.spacing.sm};
    `}
  
  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      background: ${theme.colors.primary.main}15;
      font-weight: 600;
    `}
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.subtle};
    color: ${({ theme }) => theme.colors.primary.main};
  }
  
  svg {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }
`;

export const NavItemText = styled.span<{ $isCollapsed: boolean }>`
  white-space: nowrap;
  overflow: hidden;
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  transition: opacity ${({ theme }) => theme.transitions.fast};
  font-size: 0.9375rem;
`;

export const NavBadge = styled.span`
  background: ${({ theme }) => theme.colors.error.main};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  margin-left: auto;
`;

export const SidebarFooter = styled.div<{ $isCollapsed: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  
  ${({ $isCollapsed }) =>
    $isCollapsed &&
    css`
      align-items: center;
    `}
`;

export const CollapseButton = styled.button<{ $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'flex-start')};
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.subtle};
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  svg {
    width: 22px;
    height: 22px;
    transition: transform ${({ theme }) => theme.transitions.fast};
    transform: rotate(${({ $isCollapsed }) => ($isCollapsed ? '180deg' : '0deg')});
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export const UserInfo = styled.div<{ $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.subtle};
  }
  
  ${({ $isCollapsed }) =>
    $isCollapsed &&
    css`
      justify-content: center;
      padding: ${({ theme }) => theme.spacing.sm};
    `}
`;

export const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.primary.main};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
`;

export const UserDetails = styled.div<{ $isCollapsed: boolean }>`
  overflow: hidden;
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  transition: opacity ${({ theme }) => theme.transitions.fast};
`;

export const UserName = styled.p`
  font-weight: 600;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UserRole = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;


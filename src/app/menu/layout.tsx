'use client';

/**
 * Layout das páginas de menu (cliente)
 * Otimizado para mobile e acesso via QR Code
 */

import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.default};
`;

interface MenuLayoutProps {
  children: React.ReactNode;
}

const MenuLayout = ({ children }: MenuLayoutProps) => {
  return <Container>{children}</Container>;
};

export default MenuLayout;


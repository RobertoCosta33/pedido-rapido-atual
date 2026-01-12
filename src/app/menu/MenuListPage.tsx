'use client';

/**
 * Página de listagem de quiosques
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Input, Card } from '@/components';
import { productService } from '@/services';
import { Kiosk } from '@/types';

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
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
  animation: ${fadeIn} 0.5s ease-out;
`;

const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const SearchWrapper = styled.div`
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

const KioskGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

const KioskCard = styled(Link)`
  display: block;
  text-decoration: none;
`;

const KioskCardContent = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const KioskImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary.main} 0%, ${({ theme }) => theme.colors.primary.dark} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  flex-shrink: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    height: 140px;
  }
`;

const KioskInfo = styled.div`
  flex: 1;
`;

const KioskName = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
`;

const KioskDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const KioskMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const StatusBadge = styled.span<{ $open: boolean }>`
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ theme, $open }) => $open ? theme.colors.success.main + '20' : theme.colors.error.main + '20'};
  color: ${({ theme, $open }) => $open ? theme.colors.success.main : theme.colors.error.main};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const MenuListPage: React.FC = () => {
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadKiosks = async () => {
      try {
        const data = await productService.getKiosks();
        setKiosks(data.filter((k) => k.isActive && k.isPublic));
      } catch (error) {
        console.error('Erro ao carregar quiosques:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadKiosks();
  }, []);
  
  const filteredKiosks = kiosks.filter((kiosk) =>
    kiosk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kiosk.address.city.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const isKioskOpen = (): boolean => {
    // Simulação - em produção verificar horário de funcionamento real
    return true;
  };
  
  return (
    <Container>
      <Header>
        <BackLink href="/">
          <ArrowBackIcon />
          Voltar
        </BackLink>
        
        <Title>Cardápios</Title>
        <Subtitle>Escolha um quiosque para fazer seu pedido</Subtitle>
      </Header>
      
      <SearchWrapper>
        <Input
          placeholder="Buscar por nome ou cidade..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<SearchIcon />}
        />
      </SearchWrapper>
      
      {isLoading ? (
        <EmptyState>Carregando...</EmptyState>
      ) : filteredKiosks.length === 0 ? (
        <EmptyState>
          Nenhum quiosque encontrado
        </EmptyState>
      ) : (
        <KioskGrid>
          {filteredKiosks.map((kiosk) => (
            <KioskCard key={kiosk.id} href={`/menu/${kiosk.slug}`}>
              <Card clickable padding="16px">
                <KioskCardContent>
                  <KioskImage>
                    {kiosk.name.charAt(0)}
                  </KioskImage>
                  
                  <KioskInfo>
                    <KioskName>{kiosk.name}</KioskName>
                    <KioskDescription>{kiosk.description}</KioskDescription>
                    
                    <KioskMeta>
                      <MetaItem>
                        <LocationOnIcon />
                        {kiosk.address.city}, {kiosk.address.state}
                      </MetaItem>
                      <MetaItem>
                        <AccessTimeIcon />
                        ~{kiosk.settings.estimatedPrepTime} min
                      </MetaItem>
                      <StatusBadge $open={isKioskOpen()}>
                        {isKioskOpen() ? 'Aberto' : 'Fechado'}
                      </StatusBadge>
                    </KioskMeta>
                  </KioskInfo>
                </KioskCardContent>
              </Card>
            </KioskCard>
          ))}
        </KioskGrid>
      )}
    </Container>
  );
};


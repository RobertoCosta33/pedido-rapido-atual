'use client';

/**
 * Componente da página inicial
 */

import React from 'react';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import InventoryIcon from '@mui/icons-material/Inventory';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import DevicesIcon from '@mui/icons-material/Devices';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Button } from '@/components';
import { useTheme } from '@/contexts';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.default};
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: ${({ theme }) => theme.colors.background.paper}ee;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary.main} 0%, ${({ theme }) => theme.colors.primary.dark} 100%);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
`;

const HeaderNav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary.main}20;
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const Hero = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xxl};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at 30% 20%,
      ${({ theme }) => theme.colors.primary.main}15 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 70% 80%,
      ${({ theme }) => theme.colors.secondary.main}10 0%,
      transparent 50%
    );
    pointer-events: none;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  text-align: center;
  animation: ${fadeInUp} 0.8s ease-out;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.1;
  
  span {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary.main} 0%, ${({ theme }) => theme.colors.secondary.main} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const Features = styled.section`
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.subtle};
`;

const FeaturesContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all ${({ theme }) => theme.transitions.normal};
  animation: ${fadeInUp} 0.6s ease-out;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const FeatureIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary.main}20 0%, ${({ theme }) => theme.colors.secondary.main}20 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  animation: ${float} 3s ease-in-out infinite;
  
  svg {
    width: 32px;
    height: 32px;
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
`;

const CTA = styled.section`
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary.main} 0%, ${({ theme }) => theme.colors.primary.dark} 100%);
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CTADescription = styled.p`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const Footer = styled.footer`
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.paper};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  text-align: center;
`;

const FooterText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const features = [
  {
    icon: <RestaurantMenuIcon />,
    title: 'Cardápio Digital',
    description: 'Crie cardápios personalizados e atraentes. Atualize preços e produtos em tempo real.',
  },
  {
    icon: <QrCode2Icon />,
    title: 'QR Code',
    description: 'Seus clientes acessam o cardápio escaneando um QR Code. Prático e moderno.',
  },
  {
    icon: <InventoryIcon />,
    title: 'Controle de Estoque',
    description: 'Gerencie insumos, receitas e receba alertas de estoque baixo automaticamente.',
  },
  {
    icon: <SpeedIcon />,
    title: 'Alta Performance',
    description: 'Sistema rápido e responsivo. Otimizado para funcionar em qualquer dispositivo.',
  },
  {
    icon: <SecurityIcon />,
    title: 'Seguro',
    description: 'Controle de acesso por níveis. Seus dados protegidos com as melhores práticas.',
  },
  {
    icon: <DevicesIcon />,
    title: 'Multiplataforma',
    description: 'Acesse de qualquer lugar: computador, tablet ou celular.',
  },
];

export const HomePage: React.FC = () => {
  const { toggleTheme, isDarkMode } = useTheme();
  
  return (
    <Container>
      <Header>
        <HeaderContent>
          <Logo>
            <LogoIcon>PR</LogoIcon>
            Pedido Rápido
          </Logo>
          
          <HeaderNav>
            <ThemeToggle onClick={toggleTheme} aria-label="Alternar tema">
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </ThemeToggle>
            
            <Link href="/login">
              <Button variant="outline" size="small">
                Entrar
              </Button>
            </Link>
            
            <Link href="/register">
              <Button size="small">Criar conta</Button>
            </Link>
          </HeaderNav>
        </HeaderContent>
      </Header>
      
      <Hero>
        <HeroContent>
          <HeroTitle>
            Seu cardápio digital
            <br />
            <span>na palma da mão</span>
          </HeroTitle>
          
          <HeroSubtitle>
            Sistema completo para gestão de quiosques, cardápio digital, 
            controle de estoque e pedidos via QR Code.
          </HeroSubtitle>
          
          <HeroButtons>
            <Link href="/register">
              <Button size="large">Começar gratuitamente</Button>
            </Link>
            <Link href="/menu/praia-central">
              <Button variant="outline" size="large">Ver demonstração</Button>
            </Link>
          </HeroButtons>
        </HeroContent>
      </Hero>
      
      <Features>
        <FeaturesContent>
          <SectionTitle>Tudo que você precisa</SectionTitle>
          
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesContent>
      </Features>
      
      <CTA>
        <CTATitle>Pronto para revolucionar seu negócio?</CTATitle>
        <CTADescription>
          Junte-se a centenas de quiosques que já utilizam o Pedido Rápido 
          para aumentar suas vendas e melhorar a experiência dos clientes.
        </CTADescription>
        <Link href="/register">
          <Button variant="secondary" size="large">
            Criar conta grátis
          </Button>
        </Link>
      </CTA>
      
      <Footer>
        <FooterText>
          © {new Date().getFullYear()} Pedido Rápido. Todos os direitos reservados.
        </FooterText>
      </Footer>
    </Container>
  );
};


/**
 * Estilos do componente ProductCard
 */

import styled from 'styled-components';

export const CardContainer = styled.article`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all ${({ theme }) => theme.transitions.normal};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background.subtle};
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${({ theme }) => theme.transitions.normal};
  
  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

export const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.disabled};
  
  svg {
    width: 48px;
    height: 48px;
  }
`;

export const Badge = styled.span<{ $variant?: 'highlight' | 'promo' | 'new' }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  left: ${({ theme }) => theme.spacing.sm};
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
  
  background: ${({ theme, $variant }) => {
    switch ($variant) {
      case 'promo':
        return theme.colors.error.main;
      case 'new':
        return theme.colors.secondary.main;
      default:
        return theme.colors.primary.main;
    }
  }};
  color: white;
`;

export const UnavailableBadge = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

export const Content = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Category = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary.main};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const Description = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Price = styled.span<{ $hasPromo?: boolean }>`
  font-size: ${({ $hasPromo }) => ($hasPromo ? '0.875rem' : '1.125rem')};
  font-weight: ${({ $hasPromo }) => ($hasPromo ? '400' : '700')};
  color: ${({ theme, $hasPromo }) => ($hasPromo ? theme.colors.text.secondary : theme.colors.text.primary)};
  text-decoration: ${({ $hasPromo }) => ($hasPromo ? 'line-through' : 'none')};
`;

export const PromoPrice = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.error.main};
`;

export const PrepTime = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

export const AllergenTags = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const AllergenTag = styled.span`
  font-size: 0.75rem;
  padding: 2px 6px;
  background: ${({ theme }) => theme.colors.warning.main}20;
  color: ${({ theme }) => theme.colors.warning.dark};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;


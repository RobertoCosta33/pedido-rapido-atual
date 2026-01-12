/**
 * Estilos do componente Card
 */

import styled, { css } from 'styled-components';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'gradient';

interface StyledCardProps {
  $variant: CardVariant;
  $clickable: boolean;
  $padding: string;
}

const variantStyles = {
  default: css`
    background: ${({ theme }) => theme.colors.background.paper};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  `,
  elevated: css`
    background: ${({ theme }) => theme.colors.background.paper};
    box-shadow: ${({ theme }) => theme.shadows.lg};
  `,
  outlined: css`
    background: ${({ theme }) => theme.colors.background.paper};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    box-shadow: none;
  `,
  gradient: css`
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.primary.main}15 0%,
      ${({ theme }) => theme.colors.secondary.main}15 100%
    );
    border: 1px solid ${({ theme }) => theme.colors.primary.main}30;
  `,
};

export const StyledCard = styled.div<StyledCardProps>`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.normal};
  padding: ${({ $padding }) => $padding};
  
  ${({ $variant }) => variantStyles[$variant]}
  
  ${({ $clickable, theme }) =>
    $clickable &&
    css`
      cursor: pointer;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: ${theme.shadows.xl};
      }
      
      &:active {
        transform: translateY(-2px);
      }
    `}
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.h5.fontSize};
  font-weight: ${({ theme }) => theme.typography.h5.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

export const CardSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
`;

export const CardContent = styled.div`
  /* Conteúdo padrão */
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const CardImage = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  margin: -${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.transitions.normal};
  }
  
  ${StyledCard}:hover & img {
    transform: scale(1.05);
  }
`;

export const CardBadge = styled.span`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.primary.main};
  color: white;
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
`;


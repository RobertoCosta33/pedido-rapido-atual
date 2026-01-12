/**
 * Componente Card reutilizável
 */

import React from 'react';
import {
  StyledCard,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardContent,
  CardFooter,
  CardImage,
} from './styles';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'gradient';

export interface CardProps {
  variant?: CardVariant;
  title?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  clickable?: boolean;
  onClick?: () => void;
  padding?: string;
  className?: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  title,
  subtitle,
  image,
  imageAlt,
  headerAction,
  footer,
  clickable = false,
  onClick,
  padding = '24px',
  className,
  children,
}) => {
  return (
    <StyledCard
      $variant={variant}
      $clickable={clickable}
      $padding={padding}
      onClick={clickable ? onClick : undefined}
      className={className}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {image && (
        <CardImage>
          <img src={image} alt={imageAlt || title || 'Card image'} />
        </CardImage>
      )}
      
      {(title || headerAction) && (
        <CardHeader>
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
          </div>
          {headerAction}
        </CardHeader>
      )}
      
      {children && <CardContent>{children}</CardContent>}
      
      {footer && <CardFooter>{footer}</CardFooter>}
    </StyledCard>
  );
};

// Re-exporta sub-componentes para composição flexível
export { CardHeader, CardTitle, CardSubtitle, CardContent, CardFooter, CardImage };

export default Card;


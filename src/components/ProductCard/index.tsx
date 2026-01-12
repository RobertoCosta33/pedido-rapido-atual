/**
 * Componente ProductCard para exibição de produtos no cardápio
 */

import React from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { formatCurrency, formatPrepTime } from '@/utils/formatters';
import { ALLERGENS } from '@/utils/constants';
import { Product, Allergen } from '@/types';
import {
  CardContainer,
  ImageContainer,
  ProductImage,
  PlaceholderImage,
  Badge,
  UnavailableBadge,
  Content,
  Category,
  Title,
  Description,
  Footer,
  PriceContainer,
  Price,
  PromoPrice,
  PrepTime,
  AllergenTags,
  AllergenTag,
} from './styles';

export interface ProductCardProps {
  product: Product;
  categoryName?: string;
  onClick?: () => void;
  showCategory?: boolean;
  showPrepTime?: boolean;
  showAllergens?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  categoryName,
  onClick,
  showCategory = true,
  showPrepTime = true,
  showAllergens = true,
}) => {
  const hasPromoPrice = product.promotionalPrice && product.promotionalPrice < product.price;
  const mainImage = product.images[0];
  
  return (
    <CardContainer onClick={onClick} role="button" tabIndex={0}>
      <ImageContainer>
        {mainImage ? (
          <ProductImage src={mainImage} alt={product.name} loading="lazy" />
        ) : (
          <PlaceholderImage>
            <RestaurantIcon />
          </PlaceholderImage>
        )}
        
        {!product.isAvailable && <UnavailableBadge>Indisponível</UnavailableBadge>}
        
        {product.isAvailable && product.isHighlighted && (
          <Badge $variant="highlight">Destaque</Badge>
        )}
        
        {product.isAvailable && hasPromoPrice && !product.isHighlighted && (
          <Badge $variant="promo">Promoção</Badge>
        )}
      </ImageContainer>
      
      <Content>
        {showCategory && categoryName && <Category>{categoryName}</Category>}
        
        <Title>{product.name}</Title>
        
        <Description>{product.description}</Description>
        
        {showAllergens && product.allergens.length > 0 && (
          <AllergenTags>
            {product.allergens.map((allergen: Allergen) => (
              <AllergenTag key={allergen} title={ALLERGENS[allergen]?.label}>
                {ALLERGENS[allergen]?.icon} {ALLERGENS[allergen]?.label}
              </AllergenTag>
            ))}
          </AllergenTags>
        )}
        
        <Footer>
          <PriceContainer>
            {hasPromoPrice ? (
              <>
                <Price $hasPromo>{formatCurrency(product.price)}</Price>
                <PromoPrice>{formatCurrency(product.promotionalPrice!)}</PromoPrice>
              </>
            ) : (
              <Price>{formatCurrency(product.price)}</Price>
            )}
          </PriceContainer>
          
          {showPrepTime && product.preparationTime > 0 && (
            <PrepTime>
              <AccessTimeIcon />
              {formatPrepTime(product.preparationTime)}
            </PrepTime>
          )}
        </Footer>
      </Content>
    </CardContainer>
  );
};

export default ProductCard;


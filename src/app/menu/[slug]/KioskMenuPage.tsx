'use client';

/**
 * Página do cardápio de um quiosque específico
 * Otimizada para acesso via QR Code e mobile
 */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import Badge from '@mui/material/Badge';
import { Input, ProductCard, Modal, Button } from '@/components';
import { productService } from '@/services';
import { formatCurrency, formatPrepTime } from '@/utils/formatters';
import { ALLERGENS } from '@/utils/constants';
import { Kiosk, Product, Category, Allergen } from '@/types';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${({ theme }) => theme.colors.background.paper};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.subtle};
  }
`;

const CartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  position: relative;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.subtle};
  }
`;

const KioskHeader = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
`;

const KioskName = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
`;

const KioskMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const SearchBar = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
`;

const CategoryNav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  background: ${({ theme, $active }) => $active ? theme.colors.primary.main : theme.colors.background.subtle};
  color: ${({ theme, $active }) => $active ? 'white' : theme.colors.text.primary};
  
  &:hover {
    background: ${({ theme, $active }) => $active ? theme.colors.primary.dark : theme.colors.background.elevated};
  }
`;

const Content = styled.main`
  padding: ${({ theme }) => theme.spacing.md};
  max-width: 800px;
  margin: 0 auto;
`;

const CategorySection = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const CategoryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const ModalContent = styled.div``;

const ProductImageLarge = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: ${({ theme }) => theme.colors.background.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ProductName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
`;

const ProductDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin: 0 0 ${({ theme }) => theme.spacing.md};
`;

const ProductMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  svg {
    width: 18px;
    height: 18px;
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const AllergenList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AllergenTag = styled.span`
  padding: 6px 12px;
  background: ${({ theme }) => theme.colors.warning.main}15;
  color: ${({ theme }) => theme.colors.warning.dark};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.8125rem;
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const Price = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.main};
`;

const OldPrice = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.disabled};
  text-decoration: line-through;
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const QuantityButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary.main}20;
    color: ${({ theme }) => theme.colors.primary.main};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Quantity = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

interface KioskMenuPageProps {
  slug: string;
}

export const KioskMenuPage: React.FC<KioskMenuPageProps> = ({ slug }) => {
  const [kiosk, setKiosk] = useState<Kiosk | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const kioskData = await productService.getKiosk(slug);
        setKiosk(kioskData);
        
        const [categoriesData, productsData] = await Promise.all([
          productService.getCategories(kioskData.id),
          productService.getProducts(kioskData.id),
        ]);
        
        setCategories(categoriesData);
        setProducts(productsData.items);
        
        if (categoriesData.length > 0) {
          setActiveCategory(categoriesData[0].id);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [slug]);
  
  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = categoryRefs.current[categoryId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };
  
  const closeProductModal = () => {
    setSelectedProduct(null);
    setQuantity(1);
  };
  
  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || '';
  };
  
  const filteredProducts = searchTerm
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;
  
  const productsByCategory = categories.map((category) => ({
    category,
    products: filteredProducts.filter((p) => p.categoryId === category.id),
  })).filter((group) => group.products.length > 0);
  
  if (isLoading) {
    return (
      <Container>
        <EmptyState>Carregando cardápio...</EmptyState>
      </Container>
    );
  }
  
  if (!kiosk) {
    return (
      <Container>
        <EmptyState>Quiosque não encontrado</EmptyState>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header>
        <HeaderTop>
          <BackButton href="/menu">
            <ArrowBackIcon />
          </BackButton>
          
          <CartButton>
            <Badge badgeContent={cartCount} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </CartButton>
        </HeaderTop>
        
        <KioskHeader>
          <KioskName>{kiosk.name}</KioskName>
          <KioskMeta>
            <span>
              <LocationOnIcon />
              {kiosk.address.city}, {kiosk.address.state}
            </span>
            <span>
              <AccessTimeIcon />
              ~{kiosk.settings.estimatedPrepTime} min
            </span>
            <span>
              <PhoneIcon />
              {kiosk.contact.phone}
            </span>
          </KioskMeta>
        </KioskHeader>
        
        <SearchBar>
          <Input
            placeholder="Buscar no cardápio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<SearchIcon />}
          />
        </SearchBar>
        
        {!searchTerm && categories.length > 0 && (
          <CategoryNav>
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                $active={activeCategory === category.id}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </CategoryButton>
            ))}
          </CategoryNav>
        )}
      </Header>
      
      <Content>
        {productsByCategory.length === 0 ? (
          <EmptyState>
            {searchTerm ? 'Nenhum produto encontrado' : 'Cardápio vazio'}
          </EmptyState>
        ) : (
          productsByCategory.map(({ category, products: categoryProducts }) => (
            <CategorySection
              key={category.id}
              ref={(el) => { categoryRefs.current[category.id] = el; }}
            >
              <CategoryTitle>{category.name}</CategoryTitle>
              <ProductGrid>
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categoryName={getCategoryName(product.categoryId)}
                    showCategory={false}
                    onClick={() => handleProductClick(product)}
                  />
                ))}
              </ProductGrid>
            </CategorySection>
          ))
        )}
      </Content>
      
      {/* Modal de Detalhes do Produto */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={closeProductModal}
        size="medium"
        title=""
      >
        {selectedProduct && (
          <ModalContent>
            {selectedProduct.images[0] && (
              <ProductImageLarge>
                <img src={selectedProduct.images[0]} alt={selectedProduct.name} />
              </ProductImageLarge>
            )}
            
            <ProductInfo>
              <ProductName>{selectedProduct.name}</ProductName>
              <ProductDescription>{selectedProduct.description}</ProductDescription>
              
              <ProductMeta>
                <MetaItem>
                  <AccessTimeIcon />
                  {formatPrepTime(selectedProduct.preparationTime)}
                </MetaItem>
              </ProductMeta>
              
              {selectedProduct.allergens.length > 0 && (
                <>
                  <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: 8 }}>
                    Contém:
                  </p>
                  <AllergenList>
                    {selectedProduct.allergens.map((allergen: Allergen) => (
                      <AllergenTag key={allergen}>
                        {ALLERGENS[allergen]?.icon} {ALLERGENS[allergen]?.label}
                      </AllergenTag>
                    ))}
                  </AllergenList>
                </>
              )}
            </ProductInfo>
            
            <PriceSection>
              <div>
                {selectedProduct.promotionalPrice ? (
                  <>
                    <OldPrice>{formatCurrency(selectedProduct.price)}</OldPrice>
                    <Price>{formatCurrency(selectedProduct.promotionalPrice)}</Price>
                  </>
                ) : (
                  <Price>{formatCurrency(selectedProduct.price)}</Price>
                )}
              </div>
              
              <QuantitySelector>
                <QuantityButton
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </QuantityButton>
                <Quantity>{quantity}</Quantity>
                <QuantityButton onClick={() => setQuantity((q) => q + 1)}>
                  +
                </QuantityButton>
              </QuantitySelector>
            </PriceSection>
            
            <Button
              fullWidth
              size="large"
              style={{ marginTop: 16 }}
              disabled={!selectedProduct.isAvailable}
            >
              {selectedProduct.isAvailable
                ? `Adicionar • ${formatCurrency(
                    (selectedProduct.promotionalPrice || selectedProduct.price) * quantity
                  )}`
                : 'Produto indisponível'}
            </Button>
          </ModalContent>
        )}
      </Modal>
    </Container>
  );
};


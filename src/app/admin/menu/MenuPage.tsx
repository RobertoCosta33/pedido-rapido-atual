'use client';

/**
 * Componente de gestão do cardápio
 * Organiza categorias e produtos do cardápio
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  Box,
  Typography,
  Chip,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Star as StarIcon,
  Visibility as VisibleIcon,
  VisibilityOff as HiddenIcon,
  QrCode as QrIcon,
} from '@mui/icons-material';
import { Card, ProductCard } from '@/components';
import { productService, mockDataService } from '@/services';
import { Product, Category } from '@/types';
import { formatCurrency } from '@/utils';

// Styled Components
const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const QrCodeButton = styled(IconButton)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}dd;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const CategoryTabs = styled(Tabs)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  .MuiTab-root {
    text-transform: none;
    font-weight: 500;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const ProductCardWrapper = styled.div<{ $isHidden: boolean }>`
  opacity: ${({ $isHidden }) => ($isHidden ? 0.5 : 1)};
  transition: opacity 0.2s;
`;

const StatsBar = styled(Card)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const MenuPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  // Simula kioskId do usuário logado
  const kioskId = 'kiosk_001';

  // Carrega produtos e categorias
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Carrega categorias do mock
      const categoriesData = mockDataService.getCategoriesByKiosk(kioskId);
      setCategories(categoriesData.map(c => ({
        id: c.id,
        kioskId: c.kioskId,
        name: c.name,
        order: c.order,
        isActive: c.isActive,
      })));

      // Carrega produtos
      const productsData = await productService.getProducts(kioskId, { pageSize: 100 });
      setProducts(productsData.items);
      setFilteredProducts(productsData.items);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar cardápio');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [kioskId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtra produtos
  useEffect(() => {
    let result = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    if (showOnlyAvailable) {
      result = result.filter((p) => p.isAvailable);
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, showOnlyAvailable]);

  // Toggle disponibilidade do produto
  const handleToggleAvailable = async (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    try {
      await productService.updateProduct(productId, {
        isAvailable: !product.isAvailable,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p
        )
      );
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
    }
  };

  // Toggle destaque do produto
  const handleToggleHighlighted = async (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    try {
      await productService.updateProduct(productId, {
        isHighlighted: !product.isHighlighted,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, isHighlighted: !p.isHighlighted } : p
        )
      );
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
    }
  };

  // Estatísticas
  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.isAvailable).length;
  const highlightedProducts = products.filter((p) => p.isHighlighted).length;
  const avgPrice = products.length > 0
    ? products.reduce((sum, p) => sum + p.price, 0) / products.length
    : 0;

  if (loading) {
    return (
      <PageContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Gestão do Cardápio
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Organize e gerencie os produtos do seu cardápio digital
          </Typography>
        </Box>
        <QrCodeButton size="large" title="Gerar QR Code do Cardápio">
          <QrIcon />
        </QrCodeButton>
      </Header>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Estatísticas */}
      <StatsBar>
        <StatItem>
          <Typography variant="h5" fontWeight={700} color="primary">
            {totalProducts}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Total de Produtos
          </Typography>
        </StatItem>
        <StatItem>
          <Typography variant="h5" fontWeight={700} color="success.main">
            {availableProducts}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Disponíveis
          </Typography>
        </StatItem>
        <StatItem>
          <Typography variant="h5" fontWeight={700} color="warning.main">
            {highlightedProducts}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Em Destaque
          </Typography>
        </StatItem>
        <StatItem>
          <Typography variant="h5" fontWeight={700}>
            {formatCurrency(avgPrice)}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Preço Médio
          </Typography>
        </StatItem>
      </StatsBar>

      {/* Filtros */}
      <FiltersContainer>
        <TextField
          placeholder="Buscar produto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={showOnlyAvailable}
              onChange={(e) => setShowOnlyAvailable(e.target.checked)}
              color="primary"
            />
          }
          label="Apenas disponíveis"
        />
      </FiltersContainer>

      {/* Tabs de categorias */}
      <CategoryTabs
        value={selectedCategory}
        onChange={(_, v) => setSelectedCategory(v)}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab value="all" label={`Todos (${products.length})`} />
        {categories.map((cat) => (
          <Tab
            key={cat.id}
            value={cat.id}
            label={`${cat.name} (${products.filter((p) => p.categoryId === cat.id).length})`}
          />
        ))}
      </CategoryTabs>

      {/* Grid de produtos */}
      {filteredProducts.length === 0 ? (
        <EmptyState>
          <Typography variant="h6">Nenhum produto encontrado</Typography>
          <Typography variant="body2">
            {searchTerm
              ? 'Tente buscar por outro termo'
              : 'Adicione produtos ao seu cardápio'}
          </Typography>
        </EmptyState>
      ) : (
        <ProductsGrid>
          {filteredProducts.map((product) => (
            <ProductCardWrapper key={product.id} $isHidden={!product.isAvailable}>
              <Card>
                <ProductCard
                  product={product}
                  showPrice
                  onClick={() => {}}
                />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={1}
                  borderTop={1}
                  borderColor="divider"
                >
                  <Box display="flex" gap={1}>
                    <Chip
                      icon={product.isAvailable ? <VisibleIcon /> : <HiddenIcon />}
                      label={product.isAvailable ? 'Visível' : 'Oculto'}
                      size="small"
                      color={product.isAvailable ? 'success' : 'default'}
                      onClick={() => handleToggleAvailable(product.id)}
                      clickable
                    />
                    {product.isHighlighted && (
                      <Chip
                        icon={<StarIcon />}
                        label="Destaque"
                        size="small"
                        color="warning"
                      />
                    )}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleToggleHighlighted(product.id)}
                    color={product.isHighlighted ? 'warning' : 'default'}
                  >
                    <StarIcon />
                  </IconButton>
                </Box>
              </Card>
            </ProductCardWrapper>
          ))}
        </ProductsGrid>
      )}
    </PageContainer>
  );
};

export default MenuPage;


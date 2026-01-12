'use client';

/**
 * Componente de gestão de receitas
 * Lista e gerencia receitas com seus ingredientes
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Restaurant as RecipeIcon,
  Timer as TimerIcon,
  AttachMoney as CostIcon,
} from '@mui/icons-material';
import { Card } from '@/components';
import { recipeService } from '@/services';
import { Recipe } from '@/types';
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

const SearchContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const RecipeCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  overflow: hidden;
`;

const RecipeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const RecipeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const RecipeIcon_ = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const RecipeStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const IngredientsContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.md};
`;

const IngredientItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const TotalCost = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary}10;
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRecipes, setExpandedRecipes] = useState<Set<string>>(new Set());

  // Simula kioskId do usuário logado
  const kioskId = 'kiosk_001';

  // Carrega receitas
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await recipeService.getByKiosk(kioskId);
      setRecipes(data);
      setFilteredRecipes(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar receitas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [kioskId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtra receitas
  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      setFilteredRecipes(
        recipes.filter((r) => r.name.toLowerCase().includes(term))
      );
    } else {
      setFilteredRecipes(recipes);
    }
  }, [recipes, searchTerm]);

  // Toggle expandir receita
  const toggleExpand = (recipeId: string) => {
    setExpandedRecipes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(recipeId)) {
        newSet.delete(recipeId);
      } else {
        newSet.add(recipeId);
      }
      return newSet;
    });
  };

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
        <Typography variant="h4" fontWeight={700}>
          Gestão de Receitas
        </Typography>
        <Chip
          label={`${recipes.length} receitas cadastradas`}
          color="primary"
          variant="outlined"
        />
      </Header>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <SearchContainer>
        <TextField
          fullWidth
          placeholder="Buscar receita..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </SearchContainer>

      {filteredRecipes.length === 0 ? (
        <EmptyState>
          <RecipeIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6">Nenhuma receita encontrada</Typography>
          <Typography variant="body2">
            {searchTerm
              ? 'Tente buscar por outro termo'
              : 'Crie sua primeira receita para começar'}
          </Typography>
        </EmptyState>
      ) : (
        filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id}>
            <RecipeHeader onClick={() => toggleExpand(recipe.id)}>
              <RecipeInfo>
                <RecipeIcon_>
                  <RecipeIcon />
                </RecipeIcon_>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {recipe.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {recipe.description || 'Sem descrição'}
                  </Typography>
                </Box>
              </RecipeInfo>

              <RecipeStats>
                <StatItem>
                  <TimerIcon fontSize="small" />
                  <Typography variant="body2">
                    {recipe.preparationTime} min
                  </Typography>
                </StatItem>
                <StatItem>
                  <CostIcon fontSize="small" />
                  <Typography variant="body2">
                    {formatCurrency(recipe.totalCost)}
                  </Typography>
                </StatItem>
                <Chip
                  label={`${recipe.ingredients.length} ingredientes`}
                  size="small"
                  variant="outlined"
                />
                <IconButton size="small">
                  {expandedRecipes.has(recipe.id) ? <CollapseIcon /> : <ExpandIcon />}
                </IconButton>
              </RecipeStats>
            </RecipeHeader>

            <Collapse in={expandedRecipes.has(recipe.id)}>
              <Divider />
              <IngredientsContainer>
                <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                  Ingredientes
                </Typography>
                {recipe.ingredients.map((ing, index) => (
                  <IngredientItem key={index}>
                    <Box>
                      <Typography variant="body2">{ing.ingredientName}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {ing.quantity} {ing.unit}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {formatCurrency(ing.costPerPortion)}
                    </Typography>
                  </IngredientItem>
                ))}
              </IngredientsContainer>

              {recipe.instructions && recipe.instructions.length > 0 && (
                <>
                  <Divider />
                  <Box p={2}>
                    <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                      Modo de Preparo
                    </Typography>
                    <List dense>
                      {recipe.instructions.map((step, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${index + 1}. ${step}`}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </>
              )}

              <TotalCost>
                <Typography>Custo Total</Typography>
                <Typography color="primary">
                  {formatCurrency(recipe.totalCost)}
                </Typography>
              </TotalCost>
            </Collapse>
          </RecipeCard>
        ))
      )}
    </PageContainer>
  );
};

export default RecipesPage;


'use client';

/**
 * Página de Ranking Público
 * Consome API real do backend ASP.NET Core
 */

import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Chip,
  Rating,
  Skeleton,
  Paper,
  Alert,
} from '@mui/material';
import {
  Store as StoreIcon,
  Restaurant as RestaurantIcon,
  LocalBar as DrinkIcon,
  Person as PersonIcon,
  EmojiEvents as TrophyIcon,
  Verified as VerifiedIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';
import { 
  rankingService, 
  KioskRankingDto, 
  MenuItemRankingDto, 
  EmployeeRankingDto 
} from '@/services/ranking.service';

// ============================================================================
// Styled Components
// ============================================================================

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  padding-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary} 0%, 
    ${({ theme }) => theme.colors.secondary} 100%
  );
  padding: ${({ theme }) => `${theme.spacing.xxl} 0`};
  color: white;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TabsContainer = styled(Paper)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const RankingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const RankingCard = styled(Card)<{ $rank: number }>`
  position: relative;
  overflow: visible;
  
  ${({ $rank }) => $rank <= 3 && `
    border: 2px solid ${
      $rank === 1 ? '#FFD700' : 
      $rank === 2 ? '#C0C0C0' : 
      '#CD7F32'
    };
    box-shadow: 0 4px 20px ${
      $rank === 1 ? 'rgba(255, 215, 0, 0.3)' : 
      $rank === 2 ? 'rgba(192, 192, 192, 0.3)' : 
      'rgba(205, 127, 50, 0.3)'
    };
  `}
`;

const RankBadge = styled.div<{ $rank: number }>`
  position: absolute;
  top: -12px;
  left: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  z-index: 1;
  
  ${({ $rank }) => $rank === 1 && `
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #000;
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.5);
  `}
  
  ${({ $rank }) => $rank === 2 && `
    background: linear-gradient(135deg, #C0C0C0, #A8A8A8);
    color: #000;
    box-shadow: 0 2px 8px rgba(192, 192, 192, 0.5);
  `}
  
  ${({ $rank }) => $rank === 3 && `
    background: linear-gradient(135deg, #CD7F32, #B87333);
    color: #fff;
    box-shadow: 0 2px 8px rgba(205, 127, 50, 0.5);
  `}
  
  ${({ $rank, theme }) => $rank > 3 && `
    background: ${theme.colors.backgroundLight};
    color: ${theme.colors.textSecondary};
    border: 1px solid ${theme.colors.border};
  `}
`;

const PremiumBadge = styled(Chip)`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const EmptyState = styled(Box)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
`;

// ============================================================================
// Types
// ============================================================================

type TabType = 'kiosks' | 'dishes' | 'drinks' | 'employees';

interface RankingState {
  loading: boolean;
  error: string | null;
  kiosks: KioskRankingDto[];
  dishes: MenuItemRankingDto[];
  drinks: MenuItemRankingDto[];
  employees: EmployeeRankingDto[];
}

// ============================================================================
// Component
// ============================================================================

const RankingPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('kiosks');
  const [state, setState] = useState<RankingState>({
    loading: true,
    error: null,
    kiosks: [],
    dishes: [],
    drinks: [],
    employees: [],
  });

  /**
   * Carrega dados do ranking da API real
   */
  const loadRankingData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Chamada única que retorna todos os rankings
      const data = await rankingService.getAll(20);
      
      setState({
        loading: false,
        error: null,
        kiosks: data.kiosks,
        dishes: data.dishes,
        drinks: data.drinks,
        employees: data.employees,
      });
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar ranking',
      }));
    }
  }, []);

  useEffect(() => {
    loadRankingData();
  }, [loadRankingData]);

  /**
   * Navega para página do quiosque
   */
  const handleKioskClick = (slug: string) => {
    router.push(`/ranking/${slug}`);
  };

  /**
   * Renderiza skeletons de loading
   */
  const renderSkeletons = () => (
    <RankingGrid>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Skeleton variant="circular" width={60} height={60} />
              <Box flex={1}>
                <Skeleton width="70%" height={28} />
                <Skeleton width="50%" height={20} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </RankingGrid>
  );

  /**
   * Renderiza estado de erro
   */
  const renderError = () => (
    <Alert 
      severity="error" 
      icon={<ErrorIcon />}
      action={
        <button onClick={loadRankingData} style={{ cursor: 'pointer' }}>
          Tentar novamente
        </button>
      }
    >
      {state.error}
    </Alert>
  );

  /**
   * Renderiza estado vazio
   */
  const renderEmpty = (message: string) => (
    <EmptyState>
      <TrophyIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {message}
      </Typography>
      <Typography color="textSecondary">
        Aguarde mais avaliações serem registradas
      </Typography>
    </EmptyState>
  );

  /**
   * Renderiza cards de quiosques
   */
  const renderKiosks = () => {
    if (state.kiosks.length === 0) {
      return renderEmpty('Nenhum quiosque avaliado ainda');
    }

    return (
      <RankingGrid>
        {state.kiosks.map((kiosk) => (
          <RankingCard key={kiosk.id} $rank={kiosk.position} elevation={kiosk.position <= 3 ? 4 : 1}>
            <RankBadge $rank={kiosk.position}>
              {kiosk.position <= 3 ? <TrophyIcon fontSize="small" /> : kiosk.position}
            </RankBadge>
            {kiosk.isPremium && (
              <PremiumBadge
                icon={<VerifiedIcon />}
                label="Premium"
                color="primary"
                size="small"
              />
            )}
            <CardActionArea onClick={() => handleKioskClick(kiosk.slug)}>
              <CardContent sx={{ pt: 3 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar 
                    sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}
                    src={kiosk.logo || undefined}
                  >
                    <StoreIcon />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight={600}>
                      {kiosk.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {kiosk.city}, {kiosk.state}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Rating value={kiosk.averageRating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" color="textSecondary">
                        {kiosk.averageRating.toFixed(1)} ({kiosk.totalRatings} avaliações)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </CardActionArea>
          </RankingCard>
        ))}
      </RankingGrid>
    );
  };

  /**
   * Renderiza cards de pratos/bebidas
   */
  const renderMenuItems = (items: MenuItemRankingDto[], icon: React.ReactNode, emptyMessage: string) => {
    if (items.length === 0) {
      return renderEmpty(emptyMessage);
    }

    return (
      <RankingGrid>
        {items.map((item) => (
          <RankingCard key={item.id} $rank={item.position} elevation={item.position <= 3 ? 4 : 1}>
            <RankBadge $rank={item.position}>
              {item.position <= 3 ? <TrophyIcon fontSize="small" /> : item.position}
            </RankBadge>
            <CardContent sx={{ pt: 3 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar 
                  sx={{ width: 60, height: 60, bgcolor: 'secondary.main' }}
                  src={item.image || undefined}
                >
                  {icon}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h6" fontWeight={600}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {item.kioskName} • R$ {item.price.toFixed(2)}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Rating value={item.averageRating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" color="textSecondary">
                      {item.averageRating.toFixed(1)} ({item.totalRatings})
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </RankingCard>
        ))}
      </RankingGrid>
    );
  };

  /**
   * Renderiza cards de funcionários
   */
  const renderEmployees = () => {
    if (state.employees.length === 0) {
      return renderEmpty('Nenhum funcionário avaliado ainda');
    }

    return (
      <RankingGrid>
        {state.employees.map((employee) => (
          <RankingCard key={employee.id} $rank={employee.position} elevation={employee.position <= 3 ? 4 : 1}>
            <RankBadge $rank={employee.position}>
              {employee.position <= 3 ? <TrophyIcon fontSize="small" /> : employee.position}
            </RankBadge>
            <CardContent sx={{ pt: 3 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar 
                  sx={{ width: 60, height: 60 }}
                  src={employee.photo || `https://i.pravatar.cc/150?u=${employee.id}`}
                >
                  <PersonIcon />
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h6" fontWeight={600}>
                    {employee.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {employee.role} • {employee.kioskName}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Rating value={employee.averageRating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" color="textSecondary">
                      {employee.averageRating.toFixed(1)} ({employee.totalRatings})
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </RankingCard>
        ))}
      </RankingGrid>
    );
  };

  /**
   * Renderiza conteúdo da tab ativa
   */
  const renderTabContent = () => {
    if (state.loading) return renderSkeletons();
    if (state.error) return renderError();

    switch (activeTab) {
      case 'kiosks':
        return renderKiosks();
      case 'dishes':
        return renderMenuItems(state.dishes, <RestaurantIcon />, 'Nenhum prato avaliado ainda');
      case 'drinks':
        return renderMenuItems(state.drinks, <DrinkIcon />, 'Nenhuma bebida avaliada ainda');
      case 'employees':
        return renderEmployees();
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <HeroSection>
        <Container>
          <TrophyIcon sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Ranking
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Descubra os melhores avaliados pelos nossos clientes
          </Typography>
        </Container>
      </HeroSection>

      <Container>
        <TabsContainer elevation={2}>
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              icon={<StoreIcon />}
              label="Quiosques"
              value="kiosks"
              iconPosition="start"
            />
            <Tab
              icon={<RestaurantIcon />}
              label="Pratos"
              value="dishes"
              iconPosition="start"
            />
            <Tab
              icon={<DrinkIcon />}
              label="Bebidas"
              value="drinks"
              iconPosition="start"
            />
            <Tab
              icon={<PersonIcon />}
              label="Funcionários"
              value="employees"
              iconPosition="start"
            />
          </Tabs>
        </TabsContainer>

        {renderTabContent()}
      </Container>
    </PageContainer>
  );
};

export default RankingPage;

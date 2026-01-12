'use client';

/**
 * Página de Ranking Público
 * Exibe os melhores quiosques, pratos, bebidas e funcionários
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
} from '@mui/material';
import {
  Store as StoreIcon,
  Restaurant as RestaurantIcon,
  LocalBar as DrinkIcon,
  Person as PersonIcon,
  EmojiEvents as TrophyIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { ratingService, RatedItem, KioskRanking } from '@/services';

// Styled Components
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
  
  ${({ $rank, theme }) => $rank <= 3 && `
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

type TabType = 'kiosks' | 'products' | 'drinks' | 'employees';

const RankingPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('kiosks');
  const [loading, setLoading] = useState(true);
  const [kiosks, setKiosks] = useState<KioskRanking[]>([]);
  const [products, setProducts] = useState<RatedItem[]>([]);
  const [drinks, setDrinks] = useState<RatedItem[]>([]);
  const [employees, setEmployees] = useState<RatedItem[]>([]);

  /**
   * Carrega dados do ranking
   */
  const loadRankingData = useCallback(async () => {
    setLoading(true);
    try {
      const [kiosksData, productsData, drinksData, employeesData] = await Promise.all([
        ratingService.getTopKiosks(20),
        ratingService.getTopProducts(20),
        ratingService.getTopDrinks(20),
        ratingService.getTopEmployees(20),
      ]);
      
      setKiosks(kiosksData);
      setProducts(productsData);
      setDrinks(drinksData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
    } finally {
      setLoading(false);
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
   * Renderiza cards de quiosques
   */
  const renderKiosks = () => (
    <RankingGrid>
      {kiosks.map((kiosk, index) => (
        <RankingCard key={kiosk.id} $rank={index + 1} elevation={index < 3 ? 4 : 1}>
          <RankBadge $rank={index + 1}>
            {index < 3 ? <TrophyIcon fontSize="small" /> : index + 1}
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
                <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
                  <StoreIcon />
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h6" fontWeight={600}>
                    {kiosk.name}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Rating value={kiosk.average} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" color="textSecondary">
                      {kiosk.average.toFixed(1)} ({kiosk.count} avaliações)
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

  /**
   * Renderiza cards de produtos/bebidas
   */
  const renderProducts = (items: RatedItem[], icon: React.ReactNode) => (
    <RankingGrid>
      {items.map((item, index) => (
        <RankingCard key={item.id} $rank={index + 1} elevation={index < 3 ? 4 : 1}>
          <RankBadge $rank={index + 1}>
            {index < 3 ? <TrophyIcon fontSize="small" /> : index + 1}
          </RankBadge>
          <CardContent sx={{ pt: 3 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ width: 60, height: 60, bgcolor: 'secondary.main' }}>
                {icon}
              </Avatar>
              <Box flex={1}>
                <Typography variant="h6" fontWeight={600}>
                  {item.name}
                </Typography>
                {item.kioskName && (
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {item.kioskName}
                  </Typography>
                )}
                <Box display="flex" alignItems="center" gap={1}>
                  <Rating value={item.average} precision={0.1} size="small" readOnly />
                  <Typography variant="body2" color="textSecondary">
                    {item.average.toFixed(1)} ({item.count})
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </RankingCard>
      ))}
    </RankingGrid>
  );

  /**
   * Renderiza cards de funcionários
   */
  const renderEmployees = () => (
    <RankingGrid>
      {employees.map((employee, index) => (
        <RankingCard key={employee.id} $rank={index + 1} elevation={index < 3 ? 4 : 1}>
          <RankBadge $rank={index + 1}>
            {index < 3 ? <TrophyIcon fontSize="small" /> : index + 1}
          </RankBadge>
          <CardContent sx={{ pt: 3 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar 
                sx={{ width: 60, height: 60 }}
                src={`https://i.pravatar.cc/150?u=${employee.id}`}
              >
                <PersonIcon />
              </Avatar>
              <Box flex={1}>
                <Typography variant="h6" fontWeight={600}>
                  {employee.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Rating value={employee.average} precision={0.1} size="small" readOnly />
                  <Typography variant="body2" color="textSecondary">
                    {employee.average.toFixed(1)} ({employee.count})
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </RankingCard>
      ))}
    </RankingGrid>
  );

  /**
   * Renderiza conteúdo da tab ativa
   */
  const renderTabContent = () => {
    if (loading) return renderSkeletons();

    switch (activeTab) {
      case 'kiosks':
        return renderKiosks();
      case 'products':
        return renderProducts(products, <RestaurantIcon />);
      case 'drinks':
        return renderProducts(drinks, <DrinkIcon />);
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
              value="products"
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

        {!loading && (
          (activeTab === 'kiosks' && kiosks.length === 0) ||
          (activeTab === 'products' && products.length === 0) ||
          (activeTab === 'drinks' && drinks.length === 0) ||
          (activeTab === 'employees' && employees.length === 0)
        ) && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="textSecondary">
              Nenhum item encontrado para este ranking
            </Typography>
            <Typography color="textSecondary">
              Aguarde mais avaliações serem registradas
            </Typography>
          </Box>
        )}
      </Container>
    </PageContainer>
  );
};

export default RankingPage;


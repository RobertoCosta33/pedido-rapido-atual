'use client';

/**
 * Página de Ranking/Avaliações de um Quiosque
 * Exibe estatísticas de avaliação e reviews do quiosque
 */

import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  Chip,
  LinearProgress,
  Divider,
  Button,
  Skeleton,
  Paper,
  Alert,
} from '@mui/material';
import {
  Store as StoreIcon,
  ArrowBack as BackIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
  Restaurant as RestaurantIcon,
  Person as PersonIcon,
  ThumbUp as ServiceIcon,
} from '@mui/icons-material';
import { kioskService, ratingService, licenseService, Rating as RatingType } from '@/services';

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  padding-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary} 0%, 
    ${({ theme }) => theme.colors.secondary} 100%
  );
  padding: ${({ theme }) => `${theme.spacing.xl} 0 ${theme.spacing.xxl}`};
  color: white;
`;

const KioskCard = styled(Card)`
  margin-top: -${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatCard = styled(Paper)`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const RatingDistribution = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const DistributionRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ReviewsSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ReviewCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

interface KioskRankingPageProps {
  kioskSlug: string;
}

interface KioskData {
  id: string;
  name: string;
  description: string;
  isPremium: boolean;
}

interface StatsData {
  averageRating: number;
  totalRatings: number;
  ratingsByType: Record<string, { average: number; count: number }>;
  distribution: Record<number, number>;
  recentRatings: RatingType[];
}

const KioskRankingPage = ({ kioskSlug }: KioskRankingPageProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [kiosk, setKiosk] = useState<KioskData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [notFound, setNotFound] = useState(false);

  /**
   * Carrega dados do quiosque e estatísticas
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Busca quiosque pelo slug
      const kioskData = await kioskService.getBySlug(kioskSlug);
      
      if (!kioskData) {
        setNotFound(true);
        return;
      }

      // Busca licença para verificar se é premium
      const license = await licenseService.getByKiosk(kioskData.id);
      const isPremium = license?.plan === 'premium';

      setKiosk({
        id: kioskData.id,
        name: kioskData.name,
        description: kioskData.description,
        isPremium,
      });

      // Busca estatísticas de avaliação
      const statsData = await ratingService.getKioskStats(kioskData.id);
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [kioskSlug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Renderiza loading skeleton
   */
  const renderSkeleton = () => (
    <Container>
      <KioskCard>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Skeleton variant="circular" width={80} height={80} />
            <Box flex={1}>
              <Skeleton width="50%" height={36} />
              <Skeleton width="70%" />
            </Box>
          </Box>
        </CardContent>
      </KioskCard>
      <StatsGrid>
        {[1, 2, 3, 4].map((i) => (
          <StatCard key={i}>
            <Skeleton width="50%" height={40} sx={{ mx: 'auto' }} />
            <Skeleton width="70%" sx={{ mx: 'auto' }} />
          </StatCard>
        ))}
      </StatsGrid>
    </Container>
  );

  /**
   * Renderiza ícone do tipo de avaliação
   */
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <RestaurantIcon fontSize="small" />;
      case 'employee':
        return <PersonIcon fontSize="small" />;
      case 'service':
        return <ServiceIcon fontSize="small" />;
      default:
        return <StoreIcon fontSize="small" />;
    }
  };

  /**
   * Renderiza label do tipo de avaliação
   */
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      product: 'Produto',
      employee: 'Funcionário',
      kiosk: 'Quiosque',
      service: 'Atendimento',
    };
    return labels[type] || type;
  };

  // Loading
  if (loading) {
    return (
      <PageContainer>
        <HeaderSection>
          <Container>
            <Button
              startIcon={<BackIcon />}
              onClick={() => router.back()}
              sx={{ color: 'white', mb: 2 }}
            >
              Voltar
            </Button>
          </Container>
        </HeaderSection>
        {renderSkeleton()}
      </PageContainer>
    );
  }

  // Não encontrado
  if (notFound || !kiosk) {
    return (
      <PageContainer>
        <Container>
          <Box py={8} textAlign="center">
            <Alert severity="error" sx={{ mb: 2 }}>
              Quiosque não encontrado
            </Alert>
            <Button variant="contained" onClick={() => router.push('/ranking')}>
              Ver Ranking Geral
            </Button>
          </Box>
        </Container>
      </PageContainer>
    );
  }

  // Calcula porcentagens para distribuição
  const totalRatings = stats?.totalRatings || 0;
  const distribution = stats?.distribution || {};
  const getDistributionPercent = (star: number) => {
    if (totalRatings === 0) return 0;
    return ((distribution[star] || 0) / totalRatings) * 100;
  };

  return (
    <PageContainer>
      <HeaderSection>
        <Container>
          <Button
            startIcon={<BackIcon />}
            onClick={() => router.push('/ranking')}
            sx={{ color: 'white', mb: 2 }}
          >
            Voltar ao Ranking
          </Button>
          <Typography variant="h4" fontWeight={700}>
            Avaliações
          </Typography>
        </Container>
      </HeaderSection>

      <Container>
        {/* Card do Quiosque */}
        <KioskCard elevation={4}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                <StoreIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Box flex={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h5" fontWeight={700}>
                    {kiosk.name}
                  </Typography>
                  {kiosk.isPremium && (
                    <Chip
                      icon={<VerifiedIcon />}
                      label="Premium"
                      color="primary"
                      size="small"
                    />
                  )}
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {kiosk.description}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Rating value={stats?.averageRating || 0} precision={0.1} readOnly />
                  <Typography variant="h6" fontWeight={600}>
                    {stats?.averageRating?.toFixed(1) || '0.0'}
                  </Typography>
                  <Typography color="textSecondary">
                    ({totalRatings} avaliações)
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </KioskCard>

        {/* Estatísticas por Tipo */}
        <StatsGrid>
          {stats?.ratingsByType && Object.entries(stats.ratingsByType).map(([type, data]) => (
            <StatCard key={type} elevation={2}>
              <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                {getTypeIcon(type)}
                <Typography variant="h4" color="primary">
                  {data.average.toFixed(1)}
                </Typography>
                <StarIcon color="warning" fontSize="small" />
              </Box>
              <Typography variant="body2" color="textSecondary">
                {getTypeLabel(type)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                ({data.count} avaliações)
              </Typography>
            </StatCard>
          ))}
        </StatsGrid>

        {/* Distribuição de Notas */}
        <RatingDistribution>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Distribuição de Notas
          </Typography>
          <Card>
            <CardContent>
              {[5, 4, 3, 2, 1].map((star) => (
                <DistributionRow key={star}>
                  <Typography sx={{ minWidth: 20 }}>{star}</Typography>
                  <StarIcon color="warning" fontSize="small" />
                  <Box flex={1}>
                    <LinearProgress
                      variant="determinate"
                      value={getDistributionPercent(star)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography sx={{ minWidth: 40, textAlign: 'right' }}>
                    {distribution[star] || 0}
                  </Typography>
                </DistributionRow>
              ))}
            </CardContent>
          </Card>
        </RatingDistribution>

        {/* Avaliações Recentes */}
        <ReviewsSection>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Avaliações Recentes
          </Typography>
          
          {stats?.recentRatings && stats.recentRatings.length > 0 ? (
            stats.recentRatings.map((review) => (
              <ReviewCard key={review.id}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ width: 36, height: 36 }}>
                        {review.customerName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={500}>
                          {review.customerName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      icon={getTypeIcon(review.type)}
                      label={getTypeLabel(review.type)}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Rating value={review.rating} size="small" readOnly />
                    <Typography fontWeight={500}>{review.targetName}</Typography>
                  </Box>
                  
                  {review.comment && (
                    <Typography color="textSecondary">
                      &ldquo;{review.comment}&rdquo;
                    </Typography>
                  )}
                </CardContent>
              </ReviewCard>
            ))
          ) : (
            <Card>
              <CardContent>
                <Typography color="textSecondary" textAlign="center">
                  Nenhuma avaliação disponível
                </Typography>
              </CardContent>
            </Card>
          )}
        </ReviewsSection>

        {/* Botão para ver cardápio */}
        <Divider sx={{ my: 4 }} />
        <Box textAlign="center">
          <Button
            variant="contained"
            size="large"
            startIcon={<RestaurantIcon />}
            onClick={() => router.push(`/menu/${kioskSlug}`)}
          >
            Ver Cardápio
          </Button>
        </Box>
      </Container>
    </PageContainer>
  );
};

export default KioskRankingPage;


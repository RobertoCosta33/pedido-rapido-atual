'use client';

/**
 * Página de Ranking por Região
 * Exibe quiosques filtrados por estado/cidade
 */

import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Chip,
  Rating,
  Skeleton,
  Paper,
  Breadcrumbs,
  Alert,
} from '@mui/material';
import {
  Store as StoreIcon,
  EmojiEvents as TrophyIcon,
  Verified as VerifiedIcon,
  LocationOn as LocationIcon,
  ThumbUp as ThumbUpIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { ratingService, KioskRanking } from '@/services';

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
  padding: ${({ theme }) => `${theme.spacing.xl} 0`};
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const BreadcrumbContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const RankingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const RankingCard = styled(Card)<{ $rank: number; $isPremium?: boolean }>`
  position: relative;
  overflow: visible;
  
  ${({ $rank }) => $rank <= 3 && `
    border-left: 4px solid ${
      $rank === 1 ? '#FFD700' : 
      $rank === 2 ? '#C0C0C0' : 
      '#CD7F32'
    };
  `}
  
  ${({ $isPremium }) => $isPremium && `
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 193, 7, 0.1) 100%);
  `}
`;

const RankBadge = styled.div<{ $rank: number }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
  
  ${({ $rank }) => $rank === 1 && `
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #000;
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.5);
  `}
  
  ${({ $rank }) => $rank === 2 && `
    background: linear-gradient(135deg, #C0C0C0, #A8A8A8);
    color: #000;
  `}
  
  ${({ $rank }) => $rank === 3 && `
    background: linear-gradient(135deg, #CD7F32, #B87333);
    color: #fff;
  `}
  
  ${({ $rank, theme }) => $rank > 3 && `
    background: ${theme.colors.backgroundLight};
    color: ${theme.colors.textSecondary};
    border: 2px solid ${theme.colors.border};
  `}
`;

const WellRatedBadge = styled(Chip)`
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  color: white;
  font-weight: 600;
`;

// Mapeamento de regiões
const regionNames: Record<string, string> = {
  'sp': 'São Paulo',
  'rj': 'Rio de Janeiro',
  'ba': 'Bahia',
  'sc': 'Santa Catarina',
  'pe': 'Pernambuco',
  'ce': 'Ceará',
  'es': 'Espírito Santo',
  'rn': 'Rio Grande do Norte',
  'santos': 'Santos',
  'copacabana': 'Copacabana',
  'salvador': 'Salvador',
  'florianopolis': 'Florianópolis',
  'recife': 'Recife',
  'fortaleza': 'Fortaleza',
  'vitoria': 'Vitória',
  'natal': 'Natal',
};

// Estados para regiões específicas
const regionToState: Record<string, string> = {
  'santos': 'SP',
  'copacabana': 'RJ',
  'salvador': 'BA',
  'florianopolis': 'SC',
  'recife': 'PE',
  'fortaleza': 'CE',
  'vitoria': 'ES',
  'natal': 'RN',
};

interface RegionRankingPageProps {
  region: string;
}

const RegionRankingPage = ({ region }: RegionRankingPageProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [kiosks, setKiosks] = useState<KioskRanking[]>([]);
  const [error, setError] = useState<string | null>(null);

  const regionName = regionNames[region.toLowerCase()] || region;
  const stateFilter = regionToState[region.toLowerCase()] || region.toUpperCase();

  /**
   * Carrega dados do ranking filtrado por região
   */
  const loadRankingData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Busca todos os quiosques do ranking
      const allKiosks = await ratingService.getTopKiosks(100);
      
      // Filtra por região (estado ou cidade)
      const filteredKiosks = allKiosks.filter((kiosk) => {
        if (!kiosk.state && !kiosk.city) return false;
        
        const kioskState = kiosk.state?.toUpperCase();
        const kioskCity = kiosk.city?.toLowerCase().replace(/\s+/g, '');
        const searchRegion = region.toLowerCase().replace(/\s+/g, '');
        
        // Verifica se é estado (2 letras) ou cidade
        if (region.length === 2) {
          return kioskState === region.toUpperCase();
        }
        
        // Verifica cidade
        return kioskCity?.includes(searchRegion) || kioskState === stateFilter;
      });
      
      setKiosks(filteredKiosks.slice(0, 10)); // Top 10 da região
      
      if (filteredKiosks.length === 0) {
        setError(`Nenhum quiosque encontrado na região: ${regionName}`);
      }
    } catch (err) {
      console.error('Erro ao carregar ranking da região:', err);
      setError('Erro ao carregar dados do ranking');
    } finally {
      setLoading(false);
    }
  }, [region, regionName, stateFilter]);

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
    <RankingList>
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Skeleton variant="circular" width={48} height={48} />
              <Skeleton variant="circular" width={64} height={64} />
              <Box flex={1}>
                <Skeleton width="60%" height={28} />
                <Skeleton width="40%" height={20} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </RankingList>
  );

  return (
    <PageContainer>
      <HeroSection>
        <Container>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <LocationIcon />
            <Typography variant="overline">
              Ranking Regional
            </Typography>
          </Box>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Melhores Quiosques em {regionName}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Os quiosques mais bem avaliados da região
          </Typography>
        </Container>
      </HeroSection>

      <Container>
        <BreadcrumbContainer>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Início
            </Link>
            <Link href="/ranking" style={{ textDecoration: 'none', color: 'inherit' }}>
              Ranking
            </Link>
            <Typography color="primary" fontWeight={500}>
              {regionName}
            </Typography>
          </Breadcrumbs>
        </BreadcrumbContainer>

        {error && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {error}
            <Box mt={1}>
              <Link href="/ranking" style={{ color: 'inherit' }}>
                Ver ranking geral →
              </Link>
            </Box>
          </Alert>
        )}

        {loading ? (
          renderSkeletons()
        ) : (
          <RankingList>
            {kiosks.map((kiosk, index) => (
              <RankingCard 
                key={kiosk.id} 
                $rank={index + 1} 
                $isPremium={kiosk.isPremium}
                elevation={index < 3 ? 3 : 1}
              >
                <CardActionArea onClick={() => handleKioskClick(kiosk.slug)}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <RankBadge $rank={index + 1}>
                        {index < 3 ? <TrophyIcon fontSize="small" /> : index + 1}
                      </RankBadge>
                      
                      <Avatar 
                        sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}
                        src={kiosk.logo}
                      >
                        <StoreIcon />
                      </Avatar>
                      
                      <Box flex={1}>
                        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                          <Typography variant="h6" fontWeight={600}>
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
                          {kiosk.average >= 4.5 && (
                            <WellRatedBadge
                              icon={<ThumbUpIcon />}
                              label="Bem Avaliado"
                              size="small"
                            />
                          )}
                        </Box>
                        
                        {kiosk.city && (
                          <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                            <LocationIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="textSecondary">
                              {kiosk.city}{kiosk.state && `, ${kiosk.state}`}
                            </Typography>
                          </Box>
                        )}
                        
                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                          <Rating 
                            value={kiosk.average} 
                            precision={0.1} 
                            size="small" 
                            readOnly 
                          />
                          <Typography variant="body2" fontWeight={600}>
                            {kiosk.average.toFixed(1)}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            ({kiosk.count} avaliações)
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </RankingCard>
            ))}
          </RankingList>
        )}

        {!loading && kiosks.length > 0 && (
          <Paper sx={{ p: 3, mt: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Não encontrou o que procurava?
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Veja o ranking completo de todas as regiões
            </Typography>
            <Link href="/ranking">
              <Chip 
                label="Ver Ranking Geral" 
                color="primary" 
                clickable 
                sx={{ mt: 1 }}
              />
            </Link>
          </Paper>
        )}
      </Container>
    </PageContainer>
  );
};

export default RegionRankingPage;


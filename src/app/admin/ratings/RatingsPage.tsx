"use client";

/**
 * Página de Avaliações do Quiosque
 * Exibe estatísticas e lista de avaliações recebidas
 */

import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import {
  Star as StarIcon,
  Restaurant as RestaurantIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  ThumbUp as ServiceIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import {
  ratingService,
  licenseService,
  Rating as RatingType,
  RatingType as RatingTypeEnum,
} from "@/services";

// Styled Components
const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled(Paper)`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const DistributionCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const DistributionRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

interface StatsData {
  averageRating: number;
  totalRatings: number;
  ratingsByType: Record<RatingTypeEnum, { average: number; count: number }>;
  distribution: Record<number, number>;
  recentRatings: RatingType[];
}

const RatingsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [ratings, setRatings] = useState<RatingType[]>([]);

  /**
   * Verifica permissão do plano
   */
  const checkPermission = useCallback(async () => {
    if (!user?.kioskId) return false;

    try {
      const license = await licenseService.getByKiosk(user.kioskId);
      return license?.features?.publicRanking === true;
    } catch {
      return false;
    }
  }, [user?.kioskId]);

  /**
   * Carrega dados de avaliações
   */
  const loadData = useCallback(async () => {
    if (!user?.kioskId) return;

    setLoading(true);
    try {
      const [hasAccess, statsData, ratingsData] = await Promise.all([
        checkPermission(),
        ratingService.getStats("kiosk", user.kioskId),
        ratingService.getByTarget("kiosk", user.kioskId),
      ]);

      setHasPermission(hasAccess);

      if (hasAccess) {
        // Ajustar statsData para corresponder ao tipo StatsData
        const adjustedStats: StatsData = {
          averageRating: statsData.averageRating,
          totalRatings: statsData.totalRatings,
          ratingsByType: {},
          distribution: {},
          recentRatings: [],
        };
        setStats(adjustedStats);
        setRatings(
          ratingsData.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      }
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.kioskId, checkPermission]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Retorna ícone do tipo de avaliação
   */
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "product":
        return <RestaurantIcon fontSize="small" />;
      case "employee":
        return <PersonIcon fontSize="small" />;
      case "service":
        return <ServiceIcon fontSize="small" />;
      default:
        return <StoreIcon fontSize="small" />;
    }
  };

  /**
   * Retorna label do tipo
   */
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      product: "Produto",
      employee: "Funcionário",
      kiosk: "Quiosque",
      service: "Atendimento",
    };
    return labels[type] || type;
  };

  /**
   * Calcula porcentagem para distribuição
   */
  const getDistributionPercent = (star: number) => {
    if (!stats || stats.totalRatings === 0) return 0;
    return ((stats.distribution[star] || 0) / stats.totalRatings) * 100;
  };

  // Loading state
  if (loading) {
    return (
      <PageContainer>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  // Sem permissão
  if (!hasPermission) {
    return (
      <PageContainer>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Funcionalidade não disponível
          </Typography>
          <Typography>
            A visualização de avaliações e ranking está disponível apenas nos
            planos Professional e Premium.
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} href="/admin/upgrade">
            Fazer Upgrade
          </Button>
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <Typography variant="h4" fontWeight={600}>
          Avaliações
        </Typography>
        <Typography color="textSecondary">
          Acompanhe as avaliações recebidas e a satisfação dos clientes
        </Typography>
      </PageHeader>

      {/* Estatísticas Gerais */}
      <StatsGrid>
        <StatCard elevation={2}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
          >
            <Typography variant="h3" color="primary">
              {stats?.averageRating?.toFixed(1) || "0.0"}
            </Typography>
            <StarIcon color="warning" sx={{ fontSize: 40 }} />
          </Box>
          <Typography color="textSecondary">Nota Geral</Typography>
          <Typography variant="caption" color="textSecondary">
            {stats?.totalRatings || 0} avaliações
          </Typography>
        </StatCard>

        {stats?.ratingsByType &&
          Object.entries(stats.ratingsByType).map(([type, data]) => (
            <StatCard key={type} elevation={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={0.5}
                mb={1}
              >
                {getTypeIcon(type)}
                <Typography variant="h4">{data.average.toFixed(1)}</Typography>
                <StarIcon color="warning" fontSize="small" />
              </Box>
              <Typography color="textSecondary">
                {getTypeLabel(type)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {data.count} avaliações
              </Typography>
            </StatCard>
          ))}
      </StatsGrid>

      {/* Distribuição de Notas */}
      <DistributionCard>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <TrendingUpIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Distribuição de Notas
            </Typography>
          </Box>
          {[5, 4, 3, 2, 1].map((star) => (
            <DistributionRow key={star}>
              <Typography sx={{ minWidth: 20 }}>{star}</Typography>
              <StarIcon color="warning" fontSize="small" />
              <Box flex={1}>
                <LinearProgress
                  variant="determinate"
                  value={getDistributionPercent(star)}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "action.disabledBackground",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 5,
                      backgroundColor:
                        star >= 4
                          ? "success.main"
                          : star === 3
                          ? "warning.main"
                          : "error.main",
                    },
                  }}
                />
              </Box>
              <Typography
                sx={{ minWidth: 50, textAlign: "right" }}
                color="textSecondary"
              >
                {stats?.distribution[star] || 0} (
                {getDistributionPercent(star).toFixed(0)}%)
              </Typography>
            </DistributionRow>
          ))}
        </CardContent>
      </DistributionCard>

      {/* Lista de Avaliações */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Avaliações Recentes
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Item Avaliado</TableCell>
              <TableCell>Nota</TableCell>
              <TableCell>Comentário</TableCell>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ratings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary" py={4}>
                    Nenhuma avaliação recebida ainda
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              ratings.map((rating) => (
                <TableRow key={rating.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {rating.customerName.charAt(0)}
                      </Avatar>
                      <Typography variant="body2">
                        {rating.customerName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getTypeIcon(rating.type)}
                      label={getTypeLabel(rating.type)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{rating.targetName}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Rating value={rating.rating} size="small" readOnly />
                      <Typography variant="body2" fontWeight={500}>
                        {rating.rating}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        maxWidth: 300,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={rating.comment}
                    >
                      {rating.comment || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(rating.createdAt).toLocaleDateString("pt-BR")}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
};

export default RatingsPage;

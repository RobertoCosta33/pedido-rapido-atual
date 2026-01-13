"use client";

/**
 * Página de Ranking/Avaliações de um Quiosque
 * Exibe estatísticas de avaliação e reviews do quiosque
 */

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  Chip,
  Button,
  Skeleton,
  Alert,
} from "@mui/material";
import {
  Store as StoreIcon,
  ArrowBack as BackIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";

interface KioskRankingPageProps {
  kioskSlug: string;
  isRegion?: boolean;
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
}

// Mapeamento de regiões
const regionNames: Record<string, string> = {
  sp: "São Paulo",
  rj: "Rio de Janeiro",
  ba: "Bahia",
  sc: "Santa Catarina",
  pe: "Pernambuco",
  ce: "Ceará",
  es: "Espírito Santo",
  rn: "Rio Grande do Norte",
  santos: "Santos - SP",
  copacabana: "Copacabana - RJ",
  salvador: "Salvador - BA",
  florianopolis: "Florianópolis - SC",
  recife: "Recife - PE",
  fortaleza: "Fortaleza - CE",
};

const KioskRankingPage = ({
  kioskSlug,
  isRegion = false,
}: KioskRankingPageProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [kiosk, setKiosk] = useState<KioskData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [notFound, setNotFound] = useState(false);

  /**
   * Carrega dados do quiosque e estatísticas
   */
  const loadData = useCallback(async () => {
    if (isRegion) return; // Não carrega dados para regiões

    setLoading(true);
    try {
      // Simula carregamento de dados
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dados mockados para demonstração
      setKiosk({
        id: "1",
        name: `Quiosque ${kioskSlug}`,
        description: "Descrição do quiosque",
        isPremium: false,
      });

      setStats({
        averageRating: 4.5,
        totalRatings: 150,
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [kioskSlug, isRegion]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Se for região, mostra mensagem de redirecionamento
  if (isRegion) {
    const regionName = regionNames[kioskSlug.toLowerCase()] || kioskSlug;
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            py: 8,
          }}
        >
          <Container>
            <Button
              startIcon={<BackIcon />}
              onClick={() => router.push("/ranking")}
              sx={{ color: "white", mb: 2 }}
            >
              Voltar ao Ranking
            </Button>
            <Typography variant="h4" fontWeight={700}>
              Quiosques em {regionName}
            </Typography>
            <Typography sx={{ opacity: 0.9, mt: 1 }}>
              Em breve teremos o ranking por região disponível
            </Typography>
          </Container>
        </Box>
        <Container>
          <Box py={4} textAlign="center">
            <Alert severity="info" sx={{ mb: 3 }}>
              O ranking regional está em desenvolvimento. Por enquanto, veja o
              ranking geral.
            </Alert>
            <Button variant="contained" onClick={() => router.push("/ranking")}>
              Ver Ranking Geral
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            py: 8,
          }}
        >
          <Container>
            <Skeleton variant="text" width="200px" height={40} />
            <Skeleton variant="text" width="300px" height={60} />
          </Container>
        </Box>
        <Container>
          <Box py={4}>
            <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={300} />
          </Box>
        </Container>
      </Box>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            py: 8,
          }}
        >
          <Container>
            <Button
              startIcon={<BackIcon />}
              onClick={() => router.push("/ranking")}
              sx={{ color: "white", mb: 2 }}
            >
              Voltar ao Ranking
            </Button>
            <Typography variant="h4" fontWeight={700}>
              Quiosque não encontrado
            </Typography>
          </Container>
        </Box>
        <Container>
          <Box py={4} textAlign="center">
            <Alert severity="error" sx={{ mb: 3 }}>
              O quiosque solicitado não foi encontrado.
            </Alert>
            <Button variant="contained" onClick={() => router.push("/ranking")}>
              Ver Ranking Geral
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  if (!kiosk || !stats) {
    return null;
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 8,
        }}
      >
        <Container>
          <Button
            startIcon={<BackIcon />}
            onClick={() => router.push("/ranking")}
            sx={{ color: "white", mb: 2 }}
          >
            Voltar ao Ranking
          </Button>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "white",
                color: "primary.main",
              }}
            >
              <StoreIcon fontSize="large" />
            </Avatar>
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h4" fontWeight={700}>
                  {kiosk.name}
                </Typography>
                {kiosk.isPremium && (
                  <Chip
                    icon={<VerifiedIcon />}
                    label="Premium"
                    color="warning"
                    size="small"
                  />
                )}
              </Box>
              <Typography sx={{ opacity: 0.9, mt: 1 }}>
                {kiosk.description}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Rating value={stats.averageRating} readOnly precision={0.1} />
                <Typography variant="h6" fontWeight={600}>
                  {stats.averageRating.toFixed(1)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  ({stats.totalRatings} avaliações)
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container>
        <Box py={4}>
          <Typography variant="h5" gutterBottom>
            Estatísticas de Avaliação
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            Esta é uma página de demonstração. Em breve teremos estatísticas
            detalhadas.
          </Alert>

          <Button variant="contained" onClick={() => router.push("/ranking")}>
            Voltar ao Ranking
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default KioskRankingPage;

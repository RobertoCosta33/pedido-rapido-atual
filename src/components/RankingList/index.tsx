/**
 * Componente RankingList
 * Lista de rankings para um tipo específico
 */

"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  CircularProgress,
  Alert,
  Typography,
  Skeleton,
} from "@mui/material";
import { RankingCard } from "@/components/RankingCard";
import { rankingService } from "@/services/ranking.service";
import { RankingItem, RatingTargetType } from "@/types";

interface RankingListProps {
  targetType: RatingTargetType;
}

export const RankingList: React.FC<RankingListProps> = ({ targetType }) => {
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRankings = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await rankingService.getRankings(targetType);
        setRankings(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao carregar rankings";
        setError(errorMessage);
        console.error("Erro ao carregar rankings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRankings();
  }, [targetType]);

  // Loading skeleton
  if (loading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box>
              <Skeleton
                variant="rectangular"
                height={200}
                sx={{ borderRadius: 2, mb: 1 }}
              />
              <Skeleton variant="text" height={32} />
              <Skeleton variant="text" height={24} width="60%" />
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Erro ao carregar rankings
        </Typography>
        {error}
      </Alert>
    );
  }

  // Empty state
  if (rankings.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={8}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Nenhum ranking encontrado
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ainda não há avaliações suficientes para este tipo de ranking.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {rankings.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
          <RankingCard
            item={item}
            position={index + 1}
            targetType={targetType}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default RankingList;

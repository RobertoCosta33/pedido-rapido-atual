/**
 * Dashboard do Cliente
 * Painel principal para usuários com role 'customer'
 */

"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Restaurant as RestaurantIcon,
  Add as AddIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Meus Quiosques",
      value: "0",
      icon: <RestaurantIcon />,
      color: "primary.main",
    },
    {
      title: "Avaliações Recebidas",
      value: "0",
      icon: <StarIcon />,
      color: "warning.main",
    },
    {
      title: "Ranking Médio",
      value: "-",
      icon: <TrendingIcon />,
      color: "success.main",
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bem-vindo, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie seus quiosques e acompanhe suas avaliações
        </Typography>
      </Box>

      {/* User Info */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: "primary.main" }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box flexGrow={1}>
              <Typography variant="h6">{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
              <Box mt={1}>
                <Chip
                  label={
                    user?.subscriptionStatus === "trial"
                      ? "Período de Teste"
                      : "Plano Gratuito"
                  }
                  color={
                    user?.subscriptionStatus === "trial" ? "warning" : "default"
                  }
                  size="small"
                />
              </Box>
            </Box>
            <Button variant="outlined" color="primary">
              Editar Perfil
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={4} key={stat.title}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: stat.color }}>{stat.icon}</Avatar>
                  <Box>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Ações Rápidas
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                size="large"
                sx={{ py: 2 }}
              >
                Criar Quiosque
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<TrendingIcon />}
                size="large"
                sx={{ py: 2 }}
              >
                Ver Rankings
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button fullWidth variant="outlined" size="large" sx={{ py: 2 }}>
                Upgrade de Plano
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CustomerDashboard;

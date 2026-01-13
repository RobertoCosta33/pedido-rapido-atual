/**
 * Página principal - Landing Page
 * Apresenta o sistema e direciona para rankings públicos
 */

import { Metadata } from "next";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Restaurant as RestaurantIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Pedido Rápido - Sistema de Gestão para Food Service",
  description:
    "Plataforma completa para gestão de quiosques, cardápio digital e rankings públicos. Descubra os melhores estabelecimentos, produtos e funcionários.",
};

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            py: 8,
            textAlign: "center",
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              fontWeight="bold"
            >
              Pedido Rápido
            </Typography>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ mb: 4, opacity: 0.9 }}
            >
              Sistema completo para gestão de food service
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 4, fontSize: "1.1rem", opacity: 0.8 }}
            >
              Descubra os melhores quiosques, produtos e funcionários através
              dos nossos rankings públicos
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                component={Link}
                href="/ranking"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  "&:hover": { bgcolor: "grey.100" },
                  px: 4,
                  py: 1.5,
                }}
              >
                Ver Rankings
              </Button>
              <Button
                component={Link}
                href="/login"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "white",
                  color: "white",
                  "&:hover": {
                    borderColor: "grey.300",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                  px: 4,
                  py: 1.5,
                }}
              >
                Fazer Login
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            Funcionalidades
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, fontSize: "1.1rem" }}
          >
            Tudo que você precisa para gerenciar seu negócio de food service
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: "100%", textAlign: "center", p: 2 }}>
                <CardContent>
                  <RestaurantIcon
                    sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                  />
                  <Typography variant="h6" component="h3" gutterBottom>
                    Gestão de Quiosques
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gerencie múltiplos quiosques, cardápios e funcionários em
                    uma única plataforma
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: "100%", textAlign: "center", p: 2 }}>
                <CardContent>
                  <StarIcon
                    sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                  />
                  <Typography variant="h6" component="h3" gutterBottom>
                    Sistema de Avaliações
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receba feedback dos clientes e melhore continuamente a
                    qualidade do serviço
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: "100%", textAlign: "center", p: 2 }}>
                <CardContent>
                  <TrendingUpIcon
                    sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                  />
                  <Typography variant="h6" component="h3" gutterBottom>
                    Rankings Públicos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Apareça nos rankings dos melhores estabelecimentos e atraia
                    mais clientes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: "100%", textAlign: "center", p: 2 }}>
                <CardContent>
                  <SpeedIcon
                    sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                  />
                  <Typography variant="h6" component="h3" gutterBottom>
                    Planos Flexíveis
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Escolha o plano ideal para seu negócio, desde gratuito até
                    recursos premium
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* CTA Section */}
        <Box sx={{ bgcolor: "grey.50", py: 8 }}>
          <Container maxWidth="md" sx={{ textAlign: "center" }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Pronto para começar?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, fontSize: "1.1rem" }}
            >
              Junte-se aos melhores estabelecimentos de food service do Brasil
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Criar Conta Grátis
              </Button>
              <Button
                component={Link}
                href="/ranking"
                variant="outlined"
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Explorar Rankings
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default HomePage;

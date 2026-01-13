/**
 * Página de Rankings Públicos
 * Mostra os top 10 de quiosques, produtos e funcionários
 */

import React from "react";
import { Metadata } from "next";
import { Container, Typography, Box, Tabs, Tab } from "@mui/material";
import { Navbar } from "@/components/Navbar";
import { RankingTabs } from "@/components/RankingTabs";

export const metadata: Metadata = {
  title: "Rankings",
  description:
    "Veja os melhores quiosques, produtos e funcionários avaliados pelos usuários",
  openGraph: {
    title: "Rankings - Pedido Rápido",
    description:
      "Veja os melhores quiosques, produtos e funcionários avaliados pelos usuários",
  },
};

const RankingPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            Rankings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Descubra os melhores quiosques, produtos e funcionários avaliados
            pela nossa comunidade
          </Typography>
        </Box>

        <RankingTabs />
      </Container>
    </>
  );
};

export default RankingPage;

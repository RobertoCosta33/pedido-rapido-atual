/**
 * Página de Acesso Negado
 */

import React from "react";
import { Metadata } from "next";
import { Container, Box, Typography, Button, Paper } from "@mui/material";
import { Block as BlockIcon } from "@mui/icons-material";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acesso Negado",
  description: "Você não tem permissão para acessar esta página",
};

const UnauthorizedPage: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <BlockIcon
            sx={{
              fontSize: 80,
              color: "error.main",
              mb: 2,
            }}
          />

          <Typography variant="h4" component="h1" gutterBottom>
            Acesso Negado
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Você não tem permissão para acessar esta página. Entre em contato
            com o administrador se acredita que isso é um erro.
          </Typography>

          <Box display="flex" gap={2} justifyContent="center">
            <Button
              component={Link}
              href="/"
              variant="contained"
              color="primary"
            >
              Voltar ao Início
            </Button>

            <Button component={Link} href="/dashboard" variant="outlined">
              Ir para Dashboard
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;

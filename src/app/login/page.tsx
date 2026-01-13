/**
 * Página de Login
 */

import React from "react";
import { Metadata } from "next";
import {
  Container,
  Box,
  Paper,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Faça login na sua conta do Pedido Rápido",
};

const LoginPage: React.FC = () => {
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
            p: 4,
            width: "100%",
            borderRadius: 2,
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight="bold"
            >
              Pedido Rápido
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              Entrar na sua conta
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Acesse seu painel de controle e gerencie seus quiosques
            </Typography>
          </Box>

          {/* Form */}
          <LoginForm />

          {/* Footer */}
          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              Não tem uma conta?{" "}
              <MuiLink component={Link} href="/register" underline="hover">
                Cadastre-se aqui
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;

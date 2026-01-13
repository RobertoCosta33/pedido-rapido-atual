/**
 * Página de Registro
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
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Cadastro",
  description:
    "Crie sua conta no Pedido Rápido e comece a gerenciar seus quiosques",
};

const RegisterPage: React.FC = () => {
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
              Criar nova conta
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Junte-se a nós e comece a gerenciar seus quiosques hoje mesmo
            </Typography>
          </Box>

          {/* Form */}
          <RegisterForm />

          {/* Footer */}
          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              Já tem uma conta?{" "}
              <MuiLink component={Link} href="/login" underline="hover">
                Faça login aqui
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;

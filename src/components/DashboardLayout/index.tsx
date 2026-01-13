/**
 * Layout do Dashboard
 * Layout comum para todas as páginas do dashboard
 */

"use client";

import React from "react";
import { Box, Container } from "@mui/material";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  return (
    <ProtectedRoute requireAuth>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Navbar />

        <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
          <Container maxWidth="lg">{children}</Container>
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default DashboardLayout;

/**
 * Página de Dashboard do Cliente
 */

import React from "react";
import { Metadata } from "next";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CustomerDashboard } from "@/components/CustomerDashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Painel de controle do cliente",
};

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <CustomerDashboard />
    </DashboardLayout>
  );
};

export default DashboardPage;

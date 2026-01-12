/**
 * Dashboard do Super Admin
 */

import { Metadata } from 'next';
import { SuperAdminDashboard } from './SuperAdminDashboard';

export const metadata: Metadata = {
  title: 'Dashboard - Super Admin',
  description: 'Painel de controle do Super Administrador',
};

const Page = () => {
  return <SuperAdminDashboard />;
};

export default Page;


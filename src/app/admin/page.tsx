/**
 * Dashboard do Admin do Quiosque
 */

import { Metadata } from 'next';
import { AdminDashboard } from './AdminDashboard';

export const metadata: Metadata = {
  title: 'Dashboard - Admin',
  description: 'Painel de controle do administrador do quiosque',
};

const Page = () => {
  return <AdminDashboard />;
};

export default Page;


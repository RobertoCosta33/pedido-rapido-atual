/**
 * Página de gestão de licenças - Super Admin
 * Permite visualizar e gerenciar licenças dos quiosques
 */

import { Metadata } from 'next';
import LicensesPage from './LicensesPage';

export const metadata: Metadata = {
  title: 'Gestão de Licenças | Super Admin - Pedido Rápido',
  description: 'Gerencie as licenças dos quiosques no sistema Pedido Rápido',
};

const Page = () => {
  return <LicensesPage />;
};

export default Page;


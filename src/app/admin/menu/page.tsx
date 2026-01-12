/**
 * Página de gestão de cardápio - Admin Quiosque
 * Permite organizar e gerenciar o cardápio do quiosque
 */

import { Metadata } from 'next';
import MenuPage from './MenuPage';

export const metadata: Metadata = {
  title: 'Gestão do Cardápio | Admin - Pedido Rápido',
  description: 'Organize o cardápio digital do seu quiosque',
};

const Page = () => {
  return <MenuPage />;
};

export default Page;


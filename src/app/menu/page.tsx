/**
 * Página de listagem de quiosques/menus
 */

import { Metadata } from 'next';
import { MenuListPage } from './MenuListPage';

export const metadata: Metadata = {
  title: 'Cardápios - Pedido Rápido',
  description: 'Encontre os melhores quiosques e faça seu pedido',
};

const Page = () => {
  return <MenuListPage />;
};

export default Page;


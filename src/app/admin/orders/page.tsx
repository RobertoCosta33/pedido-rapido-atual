/**
 * Página de gestão de pedidos - Admin Quiosque
 * Permite visualizar e gerenciar pedidos do quiosque
 */

import { Metadata } from 'next';
import OrdersPage from './OrdersPage';

export const metadata: Metadata = {
  title: 'Gestão de Pedidos | Admin - Pedido Rápido',
  description: 'Gerencie os pedidos do seu quiosque',
};

const Page = () => {
  return <OrdersPage />;
};

export default Page;


/**
 * Página inicial pública
 */

import { Metadata } from 'next';
import { HomePage } from './HomePage';

export const metadata: Metadata = {
  title: 'Pedido Rápido - Cardápio Digital e Gestão de Quiosques',
  description: 'Sistema completo para gestão de quiosques, cardápio digital, controle de estoque e pedidos via QR Code.',
};

const Page = () => {
  return <HomePage />;
};

export default Page;


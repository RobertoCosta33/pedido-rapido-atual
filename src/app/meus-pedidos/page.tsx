/**
 * Página de Meus Pedidos - Cliente
 * Lista os pedidos do cliente e permite avaliar
 */

import { Metadata } from 'next';
import MeusPedidosPage from './MeusPedidosPage';

export const metadata: Metadata = {
  title: 'Meus Pedidos | Pedido Rápido',
  description: 'Visualize seus pedidos e avalie sua experiência',
};

const MeusPedidos = () => {
  return <MeusPedidosPage />;
};

export default MeusPedidos;



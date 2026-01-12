/**
 * Página de Avaliações - Admin do Quiosque
 * Visualização das avaliações do quiosque
 */

import { Metadata } from 'next';
import RatingsPage from './RatingsPage';

export const metadata: Metadata = {
  title: 'Avaliações | Pedido Rápido',
  description: 'Visualize as avaliações do seu quiosque',
};

const Ratings = () => {
  return <RatingsPage />;
};

export default Ratings;


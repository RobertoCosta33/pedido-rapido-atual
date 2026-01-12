/**
 * Página de Ranking Público
 * Exibe os melhores quiosques, pratos, bebidas e funcionários
 */

import { Metadata } from 'next';
import RankingPage from './RankingPage';

export const metadata: Metadata = {
  title: 'Ranking | Pedido Rápido',
  description: 'Descubra os melhores quiosques, pratos e bebidas avaliados pelos clientes',
  openGraph: {
    title: 'Ranking Pedido Rápido',
    description: 'Os melhores quiosques e pratos da região',
    type: 'website',
  },
};

const Ranking = () => {
  return <RankingPage />;
};

export default Ranking;


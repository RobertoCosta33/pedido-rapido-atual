/**
 * Página de Ranking Público
 * Exibe os melhores quiosques, pratos, bebidas e funcionários
 */

import { Metadata } from 'next';
import RankingPage from './RankingPage';

export const metadata: Metadata = {
  title: 'Ranking dos Melhores Quiosques | Pedido Rápido',
  description: 'Descubra os melhores quiosques de praia do Brasil. Veja avaliações reais, notas e comentários de clientes. Top 10 quiosques, pratos e bebidas mais bem avaliados.',
  keywords: [
    'melhores quiosques',
    'ranking quiosques',
    'quiosques de praia',
    'avaliações quiosques',
    'melhores pratos praia',
    'bebidas praia',
    'pedido rápido ranking',
  ],
  openGraph: {
    title: 'Ranking dos Melhores Quiosques | Pedido Rápido',
    description: 'Descubra os melhores quiosques de praia do Brasil com avaliações reais de clientes.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Pedido Rápido',
    images: [
      {
        url: '/og-ranking.jpg',
        width: 1200,
        height: 630,
        alt: 'Ranking de Quiosques - Pedido Rápido',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ranking dos Melhores Quiosques',
    description: 'Top 10 quiosques mais bem avaliados',
  },
  alternates: {
    canonical: '/ranking',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const Ranking = () => {
  return <RankingPage />;
};

export default Ranking;


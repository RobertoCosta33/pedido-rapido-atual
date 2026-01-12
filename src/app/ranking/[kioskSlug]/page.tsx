/**
 * Página de Ranking do Quiosque
 * Exibe avaliações e ranking de um quiosque específico
 */

import { Metadata } from 'next';
import KioskRankingPage from './KioskRankingPage';
import { mockDataService } from '@/services';

interface PageProps {
  params: Promise<{ kioskSlug: string }>;
}

/**
 * Gera metadata dinâmica para SEO
 */
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { kioskSlug } = await params;
  const kiosk = mockDataService.getKioskBySlug(kioskSlug);
  
  if (!kiosk) {
    return {
      title: 'Quiosque não encontrado | Pedido Rápido',
    };
  }

  return {
    title: `Avaliações - ${kiosk.name} | Pedido Rápido`,
    description: `Veja as avaliações e notas de ${kiosk.name}. Confira os melhores pratos e a opinião dos clientes.`,
    openGraph: {
      title: `${kiosk.name} - Avaliações`,
      description: `Confira as avaliações de ${kiosk.name}`,
      type: 'website',
    },
  };
};

const KioskRanking = async ({ params }: PageProps) => {
  const { kioskSlug } = await params;
  return <KioskRankingPage kioskSlug={kioskSlug} />;
};

export default KioskRanking;


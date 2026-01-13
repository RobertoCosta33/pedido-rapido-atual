/**
 * Página de Ranking do Quiosque ou Região
 * Exibe avaliações e ranking de um quiosque específico ou região
 */

import { Metadata } from 'next';
import KioskRankingPage from './KioskRankingPage';
import { mockDataService } from '@/services';

interface PageProps {
  params: Promise<{ kioskSlug: string }>;
}

// Mapeamento de regiões (estados e cidades)
const regionNames: Record<string, string> = {
  'sp': 'São Paulo',
  'rj': 'Rio de Janeiro',
  'ba': 'Bahia',
  'sc': 'Santa Catarina',
  'pe': 'Pernambuco',
  'ce': 'Ceará',
  'es': 'Espírito Santo',
  'rn': 'Rio Grande do Norte',
  'santos': 'Santos - SP',
  'copacabana': 'Copacabana - RJ',
  'salvador': 'Salvador - BA',
  'florianopolis': 'Florianópolis - SC',
  'recife': 'Recife - PE',
  'fortaleza': 'Fortaleza - CE',
};

/**
 * Verifica se o slug é uma região
 */
const isRegion = (slug: string): boolean => {
  return regionNames[slug.toLowerCase()] !== undefined;
};

/**
 * Gera metadata dinâmica para SEO
 */
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { kioskSlug } = await params;
  
  // Se for uma região, gera metadata de região
  if (isRegion(kioskSlug)) {
    const regionName = regionNames[kioskSlug.toLowerCase()];
    return {
      title: `Melhores Quiosques em ${regionName} | Ranking Pedido Rápido`,
      description: `Descubra os melhores quiosques de praia em ${regionName}. Veja avaliações, notas e comentários de clientes reais.`,
      keywords: [
        `quiosques ${regionName}`,
        `melhores quiosques ${regionName}`,
        'ranking quiosques',
      ],
      openGraph: {
        title: `Melhores Quiosques em ${regionName}`,
        description: `Top 10 quiosques mais bem avaliados em ${regionName}`,
        type: 'website',
        locale: 'pt_BR',
      },
    };
  }
  
  // Se for um quiosque
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
  return <KioskRankingPage kioskSlug={kioskSlug} isRegion={isRegion(kioskSlug)} />;
};

export default KioskRanking;


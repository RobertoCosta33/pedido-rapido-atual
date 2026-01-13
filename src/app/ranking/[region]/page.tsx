/**
 * Página de Ranking por Região
 * Exibe ranking de quiosques filtrado por estado/cidade
 */

import { Metadata } from 'next';
import RegionRankingPage from './RegionRankingPage';

// Mapeamento de slugs para nomes de regiões
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
  'vitoria': 'Vitória - ES',
  'natal': 'Natal - RN',
};

interface Props {
  params: Promise<{ region: string }>;
}

/**
 * Gera metadata dinâmica para SEO
 */
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { region } = await params;
  const regionName = regionNames[region.toLowerCase()] || region;

  return {
    title: `Melhores Quiosques em ${regionName} | Ranking Pedido Rápido`,
    description: `Descubra os melhores quiosques de praia em ${regionName}. Veja avaliações, notas e comentários de clientes reais. Top 10 quiosques da região.`,
    keywords: [
      `quiosques ${regionName}`,
      `melhores quiosques ${regionName}`,
      `ranking quiosques ${regionName}`,
      'quiosques de praia',
      'avaliações quiosques',
      'pedido rápido',
    ],
    openGraph: {
      title: `Melhores Quiosques em ${regionName}`,
      description: `Top 10 quiosques mais bem avaliados em ${regionName}`,
      type: 'website',
      locale: 'pt_BR',
      siteName: 'Pedido Rápido',
      images: [
        {
          url: '/og-ranking.jpg',
          width: 1200,
          height: 630,
          alt: `Ranking de Quiosques - ${regionName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Melhores Quiosques em ${regionName}`,
      description: `Top 10 quiosques mais bem avaliados em ${regionName}`,
    },
    alternates: {
      canonical: `/ranking/${region}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
};

/**
 * Gera parâmetros estáticos para as regiões principais
 */
export const generateStaticParams = async () => {
  return Object.keys(regionNames).map((region) => ({
    region,
  }));
};

const RegionRanking = async ({ params }: Props) => {
  const { region } = await params;
  return <RegionRankingPage region={region} />;
};

export default RegionRanking;


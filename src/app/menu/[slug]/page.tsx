/**
 * Página do cardápio de um quiosque específico
 */

import { Metadata } from 'next';
import { KioskMenuPage } from './KioskMenuPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  // Em produção, buscar dados reais do quiosque
  return {
    title: `Cardápio - ${slug}`,
    description: `Veja o cardápio completo e faça seu pedido`,
    openGraph: {
      title: `Cardápio - ${slug}`,
      description: `Veja o cardápio completo e faça seu pedido`,
      type: 'website',
    },
  };
};

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;
  return <KioskMenuPage slug={slug} />;
};

export default Page;


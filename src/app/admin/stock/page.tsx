/**
 * Página de gerenciamento de estoque
 */

import { Metadata } from 'next';
import { StockPage } from './StockPage';

export const metadata: Metadata = {
  title: 'Estoque - Admin',
  description: 'Controle de estoque e insumos',
};

const Page = () => {
  return <StockPage />;
};

export default Page;


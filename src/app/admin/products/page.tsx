/**
 * Página de gerenciamento de produtos
 */

import { Metadata } from 'next';
import { ProductsPage } from './ProductsPage';

export const metadata: Metadata = {
  title: 'Produtos - Admin',
  description: 'Gerenciamento de produtos do cardápio',
};

const Page = () => {
  return <ProductsPage />;
};

export default Page;


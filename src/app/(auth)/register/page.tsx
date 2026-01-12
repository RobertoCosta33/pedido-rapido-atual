/**
 * Página de registro
 */

import { Metadata } from 'next';
import { RegisterPage } from './RegisterPage';

export const metadata: Metadata = {
  title: 'Criar conta',
  description: 'Crie sua conta no Pedido Rápido',
};

const Page = () => {
  return <RegisterPage />;
};

export default Page;


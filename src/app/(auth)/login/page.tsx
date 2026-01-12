/**
 * Página de login
 */

import { Metadata } from 'next';
import { LoginPage } from './LoginPage';

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Faça login no Pedido Rápido',
};

const Page = () => {
  return <LoginPage />;
};

export default Page;


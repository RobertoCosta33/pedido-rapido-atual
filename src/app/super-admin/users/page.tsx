/**
 * Página de gestão de usuários - Super Admin
 * Permite visualizar, criar e gerenciar usuários do sistema
 */

import { Metadata } from 'next';
import UsersPage from './UsersPage';

export const metadata: Metadata = {
  title: 'Gestão de Usuários | Super Admin - Pedido Rápido',
  description: 'Gerencie todos os usuários do sistema Pedido Rápido',
};

const Page = () => {
  return <UsersPage />;
};

export default Page;


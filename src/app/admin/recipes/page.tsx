/**
 * Página de gestão de receitas - Admin Quiosque
 * Permite criar e gerenciar receitas com ingredientes
 */

import { Metadata } from 'next';
import RecipesPage from './RecipesPage';

export const metadata: Metadata = {
  title: 'Gestão de Receitas | Admin - Pedido Rápido',
  description: 'Gerencie as receitas e ingredientes do seu quiosque',
};

const Page = () => {
  return <RecipesPage />;
};

export default Page;


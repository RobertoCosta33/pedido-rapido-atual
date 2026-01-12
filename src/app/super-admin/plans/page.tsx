/**
 * Página de Planos - Super Admin
 * Visualização e gerenciamento de planos de assinatura
 */

import { Metadata } from 'next';
import PlansPage from './PlansPage';

export const metadata: Metadata = {
  title: 'Planos | Super Admin | Pedido Rápido',
  description: 'Gerenciamento de planos de assinatura',
};

const Plans = () => {
  return <PlansPage />;
};

export default Plans;


/**
 * Página de Planos - Admin do Quiosque
 * Visualização do plano atual e opções de upgrade
 */

import { Metadata } from 'next';
import PlansPage from './PlansPage';

export const metadata: Metadata = {
  title: 'Meu Plano | Pedido Rápido',
  description: 'Gerencie seu plano e veja as opções disponíveis',
};

const Plans = () => {
  return <PlansPage />;
};

export default Plans;


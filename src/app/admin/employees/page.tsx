/**
 * Página de Funcionários - Admin do Quiosque
 * Gerenciamento de funcionários do quiosque
 */

import { Metadata } from 'next';
import EmployeesPage from './EmployeesPage';

export const metadata: Metadata = {
  title: 'Funcionários | Pedido Rápido',
  description: 'Gerencie os funcionários do seu quiosque',
};

const Employees = () => {
  return <EmployeesPage />;
};

export default Employees;


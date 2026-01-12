/**
 * Página de gerenciamento de quiosques
 */

import { Metadata } from 'next';
import { KiosksPage } from './KiosksPage';

export const metadata: Metadata = {
  title: 'Quiosques - Super Admin',
  description: 'Gerenciamento de quiosques',
};

const Page = () => {
  return <KiosksPage />;
};

export default Page;


import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import TemplatesPage from '@/components/pages/TemplatesPage';

export const metadata: Metadata = {
  title: 'Resume Templates — Resume Copilot AI',
  description: 'Browse 900+ professional ATS-optimized resume templates. Download and customize for any industry or role.',
};

export default function Page() {
  return <Layout><TemplatesPage /></Layout>;
}
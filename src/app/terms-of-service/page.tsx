import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import TermsOfServicePage from '@/components/pages/TermsOfServicePage';

export const metadata: Metadata = {
  title: 'Terms of Service — Resume Copilot AI',
  description: 'Review the Resume Copilot AI terms of service.',
};

export default function Page() {
  return <Layout><TermsOfServicePage /></Layout>;
}
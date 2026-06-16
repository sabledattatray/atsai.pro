import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import AboutPage from '@/components/pages/AboutPage';

export const metadata: Metadata = {
  title: 'About — Resume Copilot AI',
  description: 'Learn about Resume Copilot AI, built by Datta Sable — AI Architect & SaaS Builder.',
};

export default function Page() {
  return <Layout><AboutPage /></Layout>;
}
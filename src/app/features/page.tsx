import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import FeaturesPage from '@/components/pages/FeaturesPage';

export const metadata: Metadata = {
  title: 'Features — Resume Copilot AI',
  description: 'Explore all AI-powered features: ATS scoring, keyword optimization, cover letter builder, LinkedIn optimizer, and more.',
};

export default function Page() {
  return <Layout><FeaturesPage /></Layout>;
}
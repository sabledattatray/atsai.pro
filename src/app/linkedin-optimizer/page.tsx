import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import LinkedInOptimizerPage from '@/components/pages/LinkedInOptimizerPage';

export const metadata: Metadata = {
  title: 'LinkedIn Optimizer — Resume Copilot AI',
  description: 'Optimize your LinkedIn profile with AI-powered suggestions to increase recruiter visibility.',
};

export default function Page() {
  return <Layout><LinkedInOptimizerPage /></Layout>;
}
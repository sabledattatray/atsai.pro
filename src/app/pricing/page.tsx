import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import PricingPage from '@/components/pages/PricingPage';

export const metadata: Metadata = {
  title: 'Pricing — Resume Copilot AI',
  description: 'Simple, transparent pricing for AI-powered resume optimization. Start free, upgrade when you need more.',
};

export default function Page() {
  return <Layout><PricingPage /></Layout>;
}
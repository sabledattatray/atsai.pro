import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import CareerHubPage from '@/components/pages/CareerHubPage';

export const metadata: Metadata = {
  title: 'Career Hub — Resume Copilot AI',
  description: 'Explore career pathways, salary data, industry trends, and growth strategies with AI guidance.',
};

export default function Page() {
  return <Layout><CareerHubPage /></Layout>;
}
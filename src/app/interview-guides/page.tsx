import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import InterviewGuidesPage from '@/components/pages/InterviewGuidesPage';

export const metadata: Metadata = {
  title: 'Interview Guides — Resume Copilot AI',
  description: 'Prepare for interviews with AI-curated guides, common questions, and best answers for any role.',
};

export default function Page() {
  return <Layout><InterviewGuidesPage /></Layout>;
}
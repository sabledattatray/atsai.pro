import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import CoverLetterBuilderPage from '@/components/pages/CoverLetterBuilderPage';

export const metadata: Metadata = {
  title: 'AI Cover Letter Builder — Resume Copilot AI',
  description: 'Generate tailored cover letters in seconds using AI. Role-specific, professional, and ATS-optimized.',
};

export default function Page() {
  return <Layout><CoverLetterBuilderPage /></Layout>;
}
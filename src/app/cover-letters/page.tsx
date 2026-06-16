import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import CoverLettersPage from '@/components/pages/CoverLettersPage';

export const metadata: Metadata = {
  title: 'Cover Letter Templates — Resume Copilot AI',
  description: 'Browse 900+ professional cover letter templates for any role. Download, customize, and send with confidence.',
};

export default function Page() {
  return <Layout><CoverLettersPage /></Layout>;
}
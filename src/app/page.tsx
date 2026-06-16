import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import LandingPage from '@/components/pages/LandingPage';

export const metadata: Metadata = {
  title: 'Resume Copilot AI — ATS Resume Checker & Optimizer',
  description: 'The world\u0027s fastest AI-powered ATS resume optimization platform. Score, optimize, and match your resume to any job in seconds.',
};

export default function Page() {
  return (
    <Layout>
      <LandingPage />
    </Layout>
  );
}
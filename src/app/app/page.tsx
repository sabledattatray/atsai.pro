import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import AnalysisDashboard from '@/components/pages/AnalysisDashboard';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Dashboard — Resume Copilot AI',
  description: 'Upload your resume and get an instant ATS score, keyword analysis, and AI-powered optimization suggestions.',
};

export default function Page() {
  return (
    <Layout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#030712] text-slate-400">Loading dashboard...</div>}>
        <AnalysisDashboard />
      </Suspense>
    </Layout>
  );
}
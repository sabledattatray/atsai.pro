import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import CoverLetterViewer from '@/components/pages/CoverLetterViewer';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Cover Letter Template — Resume Copilot AI',
  description: 'View and customize this professional cover letter template. Download as PDF or copy to clipboard.',
};

export default function Page() {
  return (
    <Layout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#030712] text-slate-400">Loading cover letter...</div>}>
        <CoverLetterViewer />
      </Suspense>
    </Layout>
  );
}

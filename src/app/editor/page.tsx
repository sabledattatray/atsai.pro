import type { Metadata } from 'next';
import TemplateEditorPage from '@/components/pages/TemplateEditorPage';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Resume Editor — Resume Copilot AI',
  description: 'Edit and customize your resume template with AI-powered suggestions.',
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading editor...</div>}>
      <TemplateEditorPage />
    </Suspense>
  );
}
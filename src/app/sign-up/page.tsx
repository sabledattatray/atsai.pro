import type { Metadata } from 'next';
import SignUpPage from '@/components/pages/SignUpPage';

export const metadata: Metadata = {
  title: 'Sign Up — Resume Copilot AI',
  description: 'Create your free Resume Copilot AI account and start optimizing your resume today.',
};

export default function Page() {
  return <SignUpPage />;
}
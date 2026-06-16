import type { Metadata } from 'next';
import SignInPage from '@/components/pages/SignInPage';

export const metadata: Metadata = {
  title: 'Sign In — Resume Copilot AI',
  description: 'Sign in to your Resume Copilot AI account with Google or GitHub.',
};

export default function Page() {
  return <SignInPage />;
}
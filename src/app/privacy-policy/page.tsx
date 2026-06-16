import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import PrivacyPolicyPage from '@/components/pages/PrivacyPolicyPage';

export const metadata: Metadata = {
  title: 'Privacy Policy — Resume Copilot AI',
  description: 'Read the Resume Copilot AI privacy policy and learn how we handle your data.',
};

export default function Page() {
  return <Layout><PrivacyPolicyPage /></Layout>;
}
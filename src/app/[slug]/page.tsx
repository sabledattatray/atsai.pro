import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import SeoLandingPage from '@/components/pages/SeoLandingPage';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return {
    title: `${title} — Resume Copilot AI`,
    description: `Optimize your resume for ${title} roles with our AI-powered ATS checker and resume builder.`,
    openGraph: {
      title: `${title} — Resume Copilot AI`,
      description: `AI-powered ATS resume optimization for ${title} positions.`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return null;
  return (
    <Layout>
      <SeoLandingPage />
    </Layout>
  );
}

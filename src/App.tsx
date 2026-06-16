import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const AnalysisDashboard = lazy(() => import('./pages/AnalysisDashboard'));
const SeoLandingPage = lazy(() => import('./pages/SeoLandingPage'));
const SharedReportPage = lazy(() => import('./pages/SharedReportPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'));
const TemplateEditorPage = lazy(() => import('./pages/TemplateEditorPage'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const CoverLetterViewer = lazy(() => import('./pages/CoverLetterViewer'));
const CoverLettersPage = lazy(() => import('./pages/CoverLettersPage'));

const CoverLetterBuilderPage = lazy(() => import('./pages/CoverLetterBuilderPage'));
const LinkedInOptimizerPage = lazy(() => import('./pages/LinkedInOptimizerPage'));
const CareerHubPage = lazy(() => import('./pages/CareerHubPage'));
const InterviewGuidesPage = lazy(() => import('./pages/InterviewGuidesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));

const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#030712] text-white">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
      <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
    </div>
    <p className="mt-4 text-xs font-semibold tracking-wider text-slate-400 uppercase animate-pulse">Loading Workspace</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
             <Route index element={<LandingPage />} />
             <Route path="pricing" element={<PricingPage />} />
             <Route path="features" element={<FeaturesPage />} />
             <Route path="templates" element={<TemplatesPage />} />
             <Route path="cover-letters" element={<CoverLettersPage />} />
             <Route path="cover-letters/:slug" element={<CoverLetterViewer />} />
             <Route path="app" element={<AnalysisDashboard />} />
             <Route path="seo/:slug" element={<SeoLandingPage />} />
             <Route path="app/analyze" element={<AnalysisDashboard />} />
             <Route path="share/:id" element={<SharedReportPage />} />
             
             <Route path="cover-letter-builder" element={<CoverLetterBuilderPage />} />
             <Route path="linkedin-optimizer" element={<LinkedInOptimizerPage />} />
             <Route path="career-hub" element={<CareerHubPage />} />
             <Route path="interview-guides" element={<InterviewGuidesPage />} />
             <Route path="about" element={<AboutPage />} />
             <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
             <Route path="terms-of-service" element={<TermsOfServicePage />} />
          </Route>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/editor" element={<TemplateEditorPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}



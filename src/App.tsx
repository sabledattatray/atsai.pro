import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AnalysisDashboard from './pages/AnalysisDashboard';
import SeoLandingPage from './pages/SeoLandingPage';
import SharedReportPage from './pages/SharedReportPage';
import PricingPage from './pages/PricingPage';
import FeaturesPage from './pages/FeaturesPage';
import TemplatesPage from './pages/TemplatesPage';
import TemplateEditorPage from './pages/TemplateEditorPage';
import SignInPage from './pages/SignInPage';
import CoverLetterViewer from './pages/CoverLetterViewer';

import CoverLetterBuilderPage from './pages/CoverLetterBuilderPage';
import LinkedInOptimizerPage from './pages/LinkedInOptimizerPage';
import CareerHubPage from './pages/CareerHubPage';
import InterviewGuidesPage from './pages/InterviewGuidesPage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
           <Route index element={<LandingPage />} />
           <Route path="pricing" element={<PricingPage />} />
           <Route path="features" element={<FeaturesPage />} />
           <Route path="templates" element={<TemplatesPage />} />
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
        <Route path="/editor" element={<TemplateEditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}



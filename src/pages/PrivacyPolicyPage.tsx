import React from 'react';
import { useSEO } from '../utils/useSEO';

export default function PrivacyPolicyPage() {
  useSEO({
    title: 'Privacy Policy - Resume Copilot AI',
    description: 'Review our privacy policy to understand how we securely parse your resume, process data using AI APIs, and maintain strict data retention standards.',
    keywords: 'privacy policy resume checker, data protection resume scanner, secure resume processing',
    ogImage: 'https://cvwithcopilot.vercel.app/landing_page.png'
  });

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-[#030712] text-slate-100 py-24 px-6 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="container mx-auto max-w-3xl relative z-10">
        <div className="mb-12 border-b border-white/5 pb-8">
           <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-white">
             Privacy <span className="text-gradient">Policy</span>
           </h1>
           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Last Updated: October 2024</p>
        </div>
        
        <div className="prose max-w-none text-slate-400 space-y-8">
           <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Data Collection</h2>
              <p className="leading-relaxed text-sm md:text-base">We collect only the essential information needed to provide our resume analysis service. This includes your uploaded resume documents (PDF, DOCX) and the text of job descriptions you provide.</p>
           </section>
           
           <section>
              <h2 className="text-xl font-bold text-white mb-3">2. AI Processing Protocol</h2>
              <p className="leading-relaxed text-sm md:text-base">Your resume data is processed securely using enterprise AI APIs (such as Google Gemini). We explicitly configure our API integrations with zero-data-retention policies where available to ensure your personal career history is not used to train global foundation models.</p>
           </section>

           <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Data Retention</h2>
              <p className="leading-relaxed text-sm md:text-base">We store your uploaded files and generated reports temporarily to allow you to download and review them. If you register an account, reports are persisted to your dashboard. You may delete your account and all associated data at any time via your account settings.</p>
           </section>

           <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Third-Party Sharing</h2>
              <p className="leading-relaxed text-sm md:text-base">We do not sell, rent, or lease your personal information or employment history to third parties, recruiters, or data brokers under any circumstances.</p>
           </section>
        </div>
      </div>
    </div>
  );
}

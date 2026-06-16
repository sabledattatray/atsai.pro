'use client';

import React from 'react';

export default function TermsOfServicePage() {
  // SEO handled via Next.js metadata

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-[#030712] text-slate-100 py-24 px-6 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="container mx-auto max-w-3xl relative z-10">
        <div className="mb-12 border-b border-white/5 pb-8">
           <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-white">
             Terms of <span className="text-gradient">Service</span>
           </h1>
           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Last Updated: October 2024</p>
        </div>
        
        <div className="prose max-w-none text-slate-400 space-y-8">
           <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
              <p className="leading-relaxed text-sm md:text-base">By accessing or using Resume Copilot, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
           </section>
           
           <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Use of AI Services</h2>
              <p className="leading-relaxed text-sm md:text-base">Our platform utilizes artificial intelligence to generate recommendations, rewrite suggestions, and formatting guidance. While we strive for high accuracy in mimicking Applicant Tracking Systems, we do not guarantee employment, interviews, or specific outcomes. AI-generated text should be reviewed by the user for accuracy before submission to an employer.</p>
           </section>

           <section>
              <h2 className="text-xl font-bold text-white mb-3">3. User Responsibilities</h2>
              <p className="leading-relaxed text-sm md:text-base">You are responsible for the truthfulness and accuracy of the information in your resume. Resume Copilot is not liable for falsified credentials or misrepresentations made by users utilizing our rewriting tools.</p>
           </section>

           <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Payment and Credits</h2>
              <p className="leading-relaxed text-sm md:text-base">Premium features may require the purchase of credits or subscriptions. All purchases are final and non-refundable unless otherwise required by law or specified in explicit promotional materials.</p>
           </section>
        </div>
      </div>
    </div>
  );
}

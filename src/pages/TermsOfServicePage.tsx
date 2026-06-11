import React from 'react';

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-white text-black py-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-12 border-b border-gray-100 pb-8">
           <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Terms of Service</h1>
           <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Last Updated: October 2024</p>
        </div>
        
        <div className="prose max-w-none text-gray-600 space-y-8">
           <section>
              <h2 className="text-2xl font-bold text-black mb-4">1. Acceptance of Terms</h2>
              <p>By accessing or using Resume Copilot, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
           </section>
           
           <section>
              <h2 className="text-2xl font-bold text-black mb-4">2. Use of AI Services</h2>
              <p>Our platform utilizes artificial intelligence to generate recommendations, rewrite suggestions, and formatting guidance. While we strive for high accuracy in mimicking Applicant Tracking Systems, we do not guarantee employment, interviews, or specific outcomes. AI-generated text should be reviewed by the user for accuracy before submission to an employer.</p>
           </section>

           <section>
              <h2 className="text-2xl font-bold text-black mb-4">3. User Responsibilities</h2>
              <p>You are responsible for the truthfulness and accuracy of the information in your resume. Resume Copilot is not liable for falsified credentials or misrepresentations made by users utilizing our rewriting tools.</p>
           </section>

           <section>
              <h2 className="text-2xl font-bold text-black mb-4">4. Payment and Credits</h2>
              <p>Premium features may require the purchase of credits or subscriptions. All purchases are final and non-refundable unless otherwise required by law or specified in explicit promotional materials.</p>
           </section>
        </div>
      </div>
    </div>
  );
}

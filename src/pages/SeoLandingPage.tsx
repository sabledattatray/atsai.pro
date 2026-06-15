import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { useSEO } from '../utils/useSEO';

export default function SeoLandingPage() {
  const { slug } = useParams();
  
  const cleanTitle = (slug || '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const formattedSlug = slug?.replace(/_/g, ' ') || 'Resume Analyzer';

  useSEO({
    title: `${cleanTitle || 'ATS Resume Checker'} | Resume Copilot AI`,
    description: `Optimize your resume for ${cleanTitle || 'your next job'}. Run our semantic AI scan to detect missing skills and check ATS keyword compatibility.`,
    keywords: `ats resume checker, resume score, ${slug?.replace(/-/g, ', ') || 'resume optimizer'}, career intelligence, resume builder`,
    ogImage: 'https://cvwithcopilot.vercel.app/landing_page.png'
  });
  
  return (
    <div className="min-h-screen bg-white">
      <header className="py-6 px-4 border-b border-gray-100 flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center text-slate-800 hover:opacity-80 transition-opacity">
            <Logo />
        </Link>
        <Link to="/app">
           <Button>Get Started Free</Button>
        </Link>
      </header>

      <main>
        <section className="py-20 px-4 text-center max-w-4xl mx-auto">
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest rounded-full mb-6 border border-indigo-100">
                AI Career Intelligence Platform
            </div>
            <h1 className="text-5xl font-black mb-6 tracking-tight text-slate-900 capitalize leading-tight">
               Optimize Your {formattedSlug.replace(/-/g, ' ')}
            </h1>
            <p className="text-xl text-gray-500 mb-10">
               Upload your resume to our enterprise-grade ATS Simulation Engine. Get comprehensive AI feedback, gap analysis, and keyword extractions.
            </p>
            <div className="flex justify-center flex-col sm:flex-row gap-4">
              <Link to="/app">
                 <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-xl rounded-full bg-indigo-600 hover:bg-indigo-700">
                   Analyze Resume Now <ArrowRight className="w-5 h-5 ml-2" />
                 </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex justify-center flex-wrap gap-6 sm:gap-8 text-sm font-semibold text-gray-400">
               <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> AI Match Explainability</span>
               <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Multi-resume comparison</span>
               <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Instant results</span>
            </div>
        </section>

        <section className="py-20 bg-gray-50 px-4 border-t border-gray-100">
           <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
             <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-4">Why generic keyword scanners fail you.</h2>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                   <h3 className="text-lg font-bold mb-2 text-rose-600">The Problem</h3>
                   <p className="text-gray-600 font-medium leading-relaxed">Basic tools just exact-match strings. If the JD asks for "Python" and you have "Pandas", they score you a 0. That's not how modern Enterprise ATS (Workday, Taleo) algorithms work.</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-indigo-200 shadow-sm ring-4 ring-indigo-50">
                   <h3 className="text-lg font-bold mb-2 text-indigo-700">The Solution: Semantic AI Engine</h3>
                   <p className="text-gray-600 font-medium leading-relaxed">Our platform builds a <span className="font-bold text-black">Skill Graph</span> from your experience, simulating true semantic intent. Plus, our Explainability Layer tells you exactly *why* our AI couldn't infer a required skill.</p>
                </div>
             </div>
             <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] shadow-sm">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                    <FileText className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2 text-center">Ready to test your {slug?.split('-')[0] || 'career'} resume?</h3>
                <p className="text-gray-500 text-center mb-6 max-w-sm">Drop your document into our private parser and see what recruiters see.</p>
                <Link to="/app">
                   <Button variant="outline" className="h-12 px-6">Open Dual-Score Dashboard</Button>
                </Link>
             </div>
           </div>
        </section>

        <section className="py-20 border-t border-gray-100 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-10 border-b border-gray-100 pb-10">Explore Our 1,000+ Dynamic Career Pathways</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 text-sm font-medium text-indigo-600">
                    <Link to="/seo/resume-score-data-analyst-mumbai" className="hover:underline">Data Analyst in Mumbai</Link>
                    <Link to="/seo/resume-checker-python-developer-india" className="hover:underline">Python Dev India</Link>
                    <Link to="/seo/resume-ats-score-fresher-resume" className="hover:underline">Fresher Entry Level</Link>
                    <Link to="/seo/senior-product-manager-ats-optimize" className="hover:underline">Senior Prod Mgr</Link>
                    <Link to="/seo/react-frontend-engineer-silicon-valley" className="hover:underline">React UI Engineer</Link>
                    <Link to="/seo/investment-banking-analyst-resume" className="hover:underline">Investment Banking</Link>
                    <Link to="/seo/nursing-registered-rn-ats-score" className="hover:underline">Registered Nurse (RN)</Link>
                    <Link to="/seo/cybersecurity-analyst-remote-jobs" className="hover:underline">Cybersecurity Remote</Link>
                    <Link to="/seo/salesforce-administrator-resume-check" className="hover:underline">Salesforce Admin</Link>
                    <Link to="/seo/digital-marketing-seo-manager" className="hover:underline">SEO Marketing Manager</Link>
                    <Link to="/seo/operations-manager-logistics-resume" className="hover:underline">Logistics Ops Manager</Link>
                    <div className="text-gray-400 flex items-center justify-center bg-gray-50 rounded italic">+ 4,989 more programmatic routes</div>
                </div>
            </div>
        </section>
      </main>

      <footer className="py-10 border-t border-gray-100 text-center text-sm font-medium text-gray-500">
         <p>© {new Date().getFullYear()} Resume Copilot. All rights reserved.</p>
         <div className="mt-4 space-x-4">
             <Link to="/seo/ats-resume-checker-india" className="hover:text-black">ATS Checker India</Link>
             <Link to="/seo/ats-resume-checker-data-analyst" className="hover:text-black">Data Analyst</Link>
             <Link to="/seo/resume-score-python-developer" className="hover:text-black">Python Developer</Link>
             <Link to="/seo/ats-resume-checker-mumbai-jobs" className="hover:text-black">Mumbai Jobs</Link>
             <Link to="/seo/beginner-resume-example" className="hover:text-black">Beginner Example</Link>
         </div>
         {/* Hidden FAQ Schema for Programmatic SEO */}
         <script type="application/ld+json">
           {JSON.stringify({
             "@context": "https://schema.org",
             "@type": "FAQPage",
             "mainEntity": [{
               "@type": "Question",
               "name": "What is an ATS score?",
               "acceptedAnswer": {
                 "@type": "Answer",
                 "text": "Applicant Tracking Systems (ATS) scan and rank resumes based on keywords, formatting, and experience alignment. Our score simulates exactly how workday, lever, and greenhouse parse your document."
               }
             }, {
               "@type": "Question",
               "name": "How to improve resume ATS score?",
               "acceptedAnswer": {
                 "@type": "Answer",
                 "text": "Ensure chronological formatting, remove complex tables/images, and include the exact phrasing of keywords found in the target job description."
               }
             }]
           })}
         </script>
      </footer>
    </div>
  );
}

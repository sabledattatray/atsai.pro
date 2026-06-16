'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { useSEO } from '@/hooks/useSEO';

export default function SeoLandingPage() {
  const { slug } = useParams();
  const slugStr = typeof slug === 'string' ? slug : Array.isArray(slug) ? slug[0] : '';
  
  const cleanTitle = (slugStr || '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const formattedSlug = slugStr.replace(/_/g, ' ') || 'Resume Analyzer';

  useSEO({
    title: `${cleanTitle || 'ATS Resume Checker'} | Resume Copilot AI`,
    description: `Optimize your resume for ${cleanTitle || 'your next job'}. Run our semantic AI scan to detect missing skills and check ATS keyword compatibility.`,
    keywords: `ats resume checker, resume score, ${slugStr.replace(/-/g, ', ') || 'resume optimizer'}, career intelligence, resume builder`,
    ogImage: 'https://www.atsai.pro/landing_page.png'
  });
  
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden flex flex-col">
      {/* Dense Grid Background Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>

      {/* Ambient background glows */}
      <div className="absolute top-[15%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <header className="py-6 px-6 border-b border-white/5 flex justify-between items-center max-w-7xl w-full mx-auto relative z-10">
        <Link href="/" className="flex items-center text-white hover:opacity-80 transition-opacity">
            <Logo invertText />
        </Link>
        <Link href="/app">
           <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold">Get Started Free</Button>
        </Link>
      </header>

      <main className="flex-1 relative z-10">
        <section className="py-20 px-6 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-6 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.1)] backdrop-blur-md">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
                AI Career Intelligence Platform
            </div>
            <h1 className="text-4xl md:text-5.5xl font-black mb-6 tracking-tight text-white capitalize leading-tight">
               Optimize Your <span className="text-gradient">{formattedSlug.replace(/-/g, ' ')}</span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
               Upload your resume to our enterprise-grade ATS Simulation Engine. Get comprehensive AI feedback, gap analysis, and keyword extractions.
            </p>
            <div className="flex justify-center flex-col sm:flex-row gap-4">
              <Link href="/app">
                 <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-xl rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wider uppercase">
                    Analyze Resume Now <ArrowRight className="w-5 h-5 ml-2" />
                 </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex justify-center flex-wrap gap-6 sm:gap-8 text-xs font-bold uppercase tracking-widest font-mono text-slate-500">
               <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-450"/> AI Match Explainability</span>
               <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-450"/> Multi-resume comparison</span>
               <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-450"/> Instant results</span>
            </div>
        </section>

        <section className="py-20 px-6 border-t border-white/5 bg-[#0b0f19]/10">
           <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
             <div className="space-y-6">
                 <h2 className="text-3xl font-bold text-white tracking-tight mb-4">Why generic keyword scanners fail you.</h2>
                 <div className="bg-[#0b0f19]/50 p-6 rounded-xl border border-white/5 shadow-xl backdrop-blur-md">
                    <h3 className="text-lg font-bold mb-2 text-rose-400 font-mono uppercase tracking-wider text-[10px]">The Problem</h3>
                    <p className="text-slate-400 font-medium leading-relaxed text-sm">Basic tools just exact-match strings. If the JD asks for "Python" and you have "Pandas", they score you a 0. That's not how modern Enterprise ATS (Workday, Taleo) algorithms work.</p>
                 </div>
                 <div className="bg-indigo-950/20 p-6 rounded-xl border border-indigo-500/20 shadow-xl ring-4 ring-indigo-500/5 backdrop-blur-md">
                    <h3 className="text-lg font-bold mb-2 text-indigo-400 font-mono uppercase tracking-wider text-[10px]">The Solution: Semantic AI Engine</h3>
                    <p className="text-slate-400 font-medium leading-relaxed text-sm">Our platform builds a <span className="font-bold text-white">Skill Graph</span> from your experience, simulating true semantic intent. Plus, our Explainability Layer tells you exactly *why* our AI couldn't infer a required skill.</p>
                 </div>
             </div>
             <div className="bg-[#0b0f19]/40 border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] shadow-2xl backdrop-blur-md">
                 <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
                     <FileText className="w-8 h-8 text-emerald-400" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2 text-center tracking-tight">Ready to test your {slugStr.split('-')[0] || 'career'} resume?</h3>
                 <p className="text-slate-400 text-center mb-6 max-w-sm text-sm font-medium">Drop your document into our private parser and see what recruiters see.</p>
                 <Link href="/app">
                    <Button variant="outline" className="h-12 px-6 font-bold border-white/10 text-white hover:bg-white/5">Open Dual-Score Dashboard</Button>
                 </Link>
             </div>
           </div>
         </section>

        <section className="py-20 border-t border-white/5 px-6">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-center text-white tracking-tight mb-10 border-b border-white/5 pb-10">Explore Our 1,000+ Dynamic Career Pathways</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 text-sm font-semibold text-indigo-400">
                    <Link href="/resume-score-data-analyst-mumbai" className="hover:underline hover:text-indigo-300">Data Analyst in Mumbai</Link>
                    <Link href="/resume-checker-python-developer-india" className="hover:underline hover:text-indigo-300">Python Dev India</Link>
                    <Link href="/resume-ats-score-fresher-resume" className="hover:underline hover:text-indigo-300">Fresher Entry Level</Link>
                    <Link href="/senior-product-manager-ats-optimize" className="hover:underline hover:text-indigo-300">Senior Prod Mgr</Link>
                    <Link href="/react-frontend-engineer-silicon-valley" className="hover:underline hover:text-indigo-300">React UI Engineer</Link>
                    <Link href="/investment-banking-analyst-resume" className="hover:underline hover:text-indigo-300">Investment Banking</Link>
                    <Link href="/nursing-registered-rn-ats-score" className="hover:underline hover:text-indigo-300">Registered Nurse (RN)</Link>
                    <Link href="/cybersecurity-analyst-remote-jobs" className="hover:underline hover:text-indigo-300">Cybersecurity Remote</Link>
                    <Link href="/salesforce-administrator-resume-check" className="hover:underline hover:text-indigo-300">Salesforce Admin</Link>
                    <Link href="/digital-marketing-seo-manager" className="hover:underline hover:text-indigo-300">SEO Marketing Manager</Link>
                    <Link href="/operations-manager-logistics-resume" className="hover:underline hover:text-indigo-300">Logistics Ops Manager</Link>
                    <div className="text-slate-500 flex items-center justify-center bg-white/5 rounded-xl text-xs italic font-medium px-4 py-2 border border-white/5">+ 4,989 more programmatic routes</div>
                </div>
            </div>
        </section>
      </main>

      <footer className="py-10 border-t border-white/5 text-center text-xs font-bold uppercase tracking-widest font-mono text-slate-500 px-6">
         <p>© {new Date().getFullYear()} Resume Copilot. All rights reserved.</p>
         <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
             <Link href="/ats-resume-checker-india" className="hover:text-white transition-colors">ATS Checker India</Link>
             <Link href="/ats-resume-checker-data-analyst" className="hover:text-white transition-colors">Data Analyst</Link>
             <Link href="/resume-score-python-developer" className="hover:text-white transition-colors">Python Developer</Link>
             <Link href="/ats-resume-checker-mumbai-jobs" className="hover:text-white transition-colors">Mumbai Jobs</Link>
             <Link href="/beginner-resume-example" className="hover:text-white transition-colors">Beginner Example</Link>
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

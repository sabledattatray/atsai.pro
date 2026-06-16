'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Search, Trophy, CheckCircle2, TrendingUp } from 'lucide-react';

export default function LinkedInOptimizerPage() {
  // SEO handled via Next.js metadata

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-[#030712] text-slate-100 relative overflow-hidden">
      {/* Dense Grid Background Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>

      {/* Ambient background glows */}
      <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Hero */}
      <section className="pt-20 pb-24 px-6 relative z-10">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-6 rounded-full shadow-[0_0_15px_rgba(59,102,194,0.1)] backdrop-blur-md">
             <span className="w-1.5 h-1.5 bg-blue-450 rounded-full animate-pulse"></span>
             Inbound Recruiting
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight text-white">
            Make recruiters <span className="text-[#0A66C2]">come to you.</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-10 font-medium">
            Your resume gets you past the ATS. Your LinkedIn profile gets you headhunted. Optimize your headline, about section, and skills to rank #1 in Recruiter Lite searches.
          </p>
          <Link href="/app">
            <Button size="lg" className="bg-[#0A66C2] hover:bg-blue-600 text-white font-bold h-14 px-8 text-base shadow-lg shadow-blue-900/30">
               Scan My Profile
            </Button>
          </Link>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 px-6 relative z-10 border-t border-white/5">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
               <h2 className="text-3xl font-extrabold mb-6 text-white tracking-tight">The Algorithm Explained</h2>
               <p className="text-slate-400 mb-8 leading-relaxed text-sm md:text-base font-medium">
                  LinkedIn Recruiter runs on a specific boolean search mechanism. If your headline and current role don't exact-match their search query, you appear on page 10 instead of page 1.
               </p>
               <ul className="space-y-4">
                  {[
                    "Headline keyword density scoring",
                    "About section sentiment analysis",
                    "Skills endorsement weighting",
                    "Experience section impact rewriting"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-200 font-semibold text-sm">
                       <CheckCircle2 className="w-5 h-5 text-[#0A66C2] shrink-0" /> {item}
                    </li>
                  ))}
               </ul>
            </div>
            
            <div className="relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 rounded-2xl transform rotate-3 scale-105 -z-10 blur-sm"></div>
               <div className="bg-[#0b0f19]/60 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
                  <div className="h-24 bg-slate-800/40 relative">
                     <div className="absolute -bottom-8 left-6 w-20 h-20 bg-[#030712] border-4 border-white/5 rounded-full overflow-hidden shadow-md">
                        <div className="w-full h-full bg-slate-800"></div>
                     </div>
                  </div>
                  <div className="pt-12 p-6">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="w-32 h-4 bg-slate-800 rounded"></div>
                        <div className="w-4 h-4 bg-yellow-500/80 rounded-full"></div>
                     </div>
                     <div className="w-48 h-3 bg-slate-900 rounded mb-4"></div>
                     
                     <div className="mt-6 border-t border-white/5 pt-4">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Profile Score</span>
                           <span className="text-sm font-bold text-blue-400 font-mono">94/100</span>
                        </div>
                        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                           <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 w-[94%]"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

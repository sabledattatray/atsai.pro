import React from 'react';
import { Button } from '@/components/ui/button';
import { Target, Search, PenTool, CheckCircle, FileText, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from '../utils/useSEO';

export default function CoverLetterBuilderPage() {
  useSEO({
    title: 'AI Cover Letter Builder - Resume Copilot AI',
    description: 'Create highly-tailored, professional cover letters mapped to specific job descriptions using Gemini 1.5 Pro AI. Bypasses corporate jargon and highlights matching value.',
    keywords: 'ai cover letter generator, resume cover letter builder, personalized cover letter generator, professional cover letter tool, gemini cover letter',
    ogImage: 'https://cvwithcopilot.vercel.app/landing_page.png'
  });

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-[#030712] text-slate-100 relative overflow-hidden">
      {/* Dense Grid Background Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>

      {/* Ambient background glows */}
      <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Hero */}
      <section className="py-20 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
           <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-6 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.1)] backdrop-blur-md">
                 <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
                 Powered by Gemini 1.5 Pro
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
                Write cover letters that <span className="text-gradient">actually get read.</span>
              </h1>
              <p className="text-slate-400 text-base md:text-lg mb-8 leading-relaxed font-medium">
                 Our AI analyzes the exact job description and your resume simultaneously, generating a highly-tailored, professional cover letter that bypasses corporate jargon and focuses on mapped value.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                 <Link to="/app">
                    <Button size="lg" className="h-14 px-8 text-base bg-indigo-600 hover:bg-indigo-500 text-white w-full sm:w-auto shadow-lg shadow-indigo-600/20 font-bold uppercase tracking-wider">
                       Start Building Free
                    </Button>
                 </Link>
              </div>
           </div>
           
           <div className="bg-[#0b0f19]/60 rounded-2xl shadow-2xl border border-white/10 p-6 flex flex-col gap-4 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="h-4 w-1/3 bg-slate-800 rounded animate-pulse"></div>
              <div className="h-2 w-1/4 bg-slate-900 rounded mb-4"></div>
              
              <div className="space-y-3">
                 <div className="h-2 w-full bg-indigo-500/5 rounded"></div>
                 <div className="h-2 w-11/12 bg-indigo-500/5 rounded"></div>
                 <div className="h-2 w-full bg-indigo-500/5 rounded"></div>
                 <div className="h-2 w-4/5 bg-indigo-500/5 rounded"></div>
              </div>

              <div className="h-px w-full bg-white/5 my-2"></div>

              <div className="p-4 bg-indigo-500/5 rounded-lg border border-indigo-500/10 flex gap-4">
                 <div className="w-8 h-8 rounded bg-indigo-500/20 flex-shrink-0 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-indigo-400" />
                 </div>
                 <div>
                    <h4 className="text-sm font-bold text-white">Highly Contextual</h4>
                    <p className="text-xs text-indigo-300 mt-1 font-medium">Found 4 direct matches between your system design background and their senior requirements.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 relative z-10 border-t border-white/5">
        <div className="container mx-auto max-w-5xl">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold mb-4 text-white tracking-tight">How it works</h2>
              <p className="text-slate-400 max-w-xl mx-auto font-medium">Three simple steps to a perfectly tailored application.</p>
           </div>

           <div className="grid md:grid-cols-3 gap-12 relative">
             <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 hidden md:block -z-10 translate-y-[-50%]"></div>
             
             {[
               { icon: <Upload className="w-5 h-5" />, title: "1. Upload Resume", desc: "Start with your ATS-optimized resume. We extract your core competencies." },
               { icon: <Target className="w-5 h-5" />, title: "2. Paste Job URL", desc: "Provide the job description. Our AI maps the exact requirements." },
               { icon: <PenTool className="w-5 h-5" />, title: "3. Generate & Refine", desc: "Get a draft instantly. Tweak the tone from conservative to confident." }
             ].map((step, i) => (
                <div key={i} className="bg-[#0b0f19]/35 p-8 border border-white/5 rounded-2xl shadow-xl text-center flex flex-col items-center backdrop-blur-md group hover:border-white/10 transition-colors duration-300">
                   <div className="w-12 h-12 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                   </div>
                   <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{step.title}</h3>
                   <p className="text-slate-400 text-xs leading-relaxed font-medium">{step.desc}</p>
                </div>
             ))}
           </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Terminal, Users, Database, Layout, Shield, Search } from 'lucide-react';
import Link from 'next/link';

const GUIDES = [
  { icon: <Terminal />, title: "Software Engineering", count: "120+ Questions", color: "text-blue-400", bg: "bg-blue-500/10 border border-blue-500/20" },
  { icon: <Users />, title: "Product Management", count: "85+ Questions", color: "text-purple-400", bg: "bg-purple-500/10 border border-purple-500/20" },
  { icon: <Database />, title: "Data Science", count: "95+ Questions", color: "text-emerald-400", bg: "bg-emerald-500/10 border border-emerald-500/20" },
  { icon: <Layout />, title: "UX/UI Design", count: "40+ Questions", color: "text-pink-400", bg: "bg-pink-500/10 border border-pink-500/20" },
  { icon: <Shield />, title: "Cybersecurity", count: "60+ Questions", color: "text-rose-400", bg: "bg-rose-500/10 border border-rose-500/20" },
  { icon: <Search />, title: "Technical Recruiting", count: "30+ Questions", color: "text-amber-400", bg: "bg-amber-500/10 border border-amber-500/20" },
];

export default function InterviewGuidesPage() {
  // SEO handled via Next.js metadata

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-[#030712] text-slate-100 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Hero Section */}
      <section className="relative py-24 px-6 bg-[#030712] border-b border-white/5 overflow-hidden">
        {/* Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            Nail the <span className="text-gradient">Interview</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium">
            You got past the ATS. Now beat the behavioral screen and system design rounds. Highly tactical prep guides for tech interviews.
          </p>
        </div>
      </section>

      {/* Guides Section */}
      <section className="relative py-20 px-6 bg-[#030712] border-b border-white/5 z-10">
         <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-extrabold text-white mb-10 text-center tracking-tight">Browse by Discipline</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {GUIDES.map((g, i) => (
                  <div key={i} className="bg-[#0b0f19]/35 p-6 rounded-2xl border border-white/5 hover:border-white/10 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer group flex items-start gap-4 hover:-translate-y-1">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${g.bg} ${g.color}`}>
                        {React.cloneElement(g.icon, { className: 'w-5 h-5' })}
                     </div>
                     <div>
                        <h3 className="font-bold text-lg text-white mb-1 group-hover:text-indigo-400 transition-colors">{g.title}</h3>
                        <p className="text-slate-500 font-mono text-[10px] font-semibold uppercase tracking-wider">{g.count}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-[#030712] relative overflow-hidden text-center z-10">
         {/* Inner Grid Light Overlay */}
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#030712] to-[#030712] opacity-80 pointer-events-none"></div>
         
         <div className="container mx-auto max-w-3xl relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-white leading-none">Need resume help first?</h2>
            <Link href="/app">
               <Button className="h-14 px-8 bg-white text-black hover:bg-slate-100 hover:text-black font-bold uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-transform duration-300">
                  Analyze Resume
               </Button>
            </Link>
         </div>
      </section>
    </div>
  );
}

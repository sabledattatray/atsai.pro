import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useSEO } from '../utils/useSEO';

export default function PricingPage() {
  useSEO({
    title: 'Pricing Plans - Resume Copilot AI',
    description: 'Affordable plans for job seekers. Start scanning your resume for free, or buy credits to unlock advanced semantic matching, ATS keyword rewrites, and detailed skill gap analysis.',
    keywords: 'resume score pricing, resume checker cost, ats scanner credits, free resume scan, resume builder pricing',
    ogImage: 'https://www.atsai.pro/pricing_page.png'
  });

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] py-24 px-4 bg-[#030712] text-slate-100 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight leading-none">Simple, Transparent Pricing</h1>
          <p className="text-slate-400 max-w-xl mx-auto font-medium">Start for free, upgrade when you're ready to unlock advanced AI capabilities and unlimited scans.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {/* Free Tier */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#0b0f19]/35 backdrop-blur-md p-8 border border-white/5 rounded-2xl flex flex-col relative shadow-2xl shadow-black/45"
          >
            <h3 className="text-lg font-bold mb-2 text-white">Free</h3>
            <div className="text-4xl font-black mb-6 font-mono text-white">$0</div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-slate-300 font-semibold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> 3 Semantic ATS Scans</li>
              <li className="flex gap-3 text-sm text-slate-300 font-semibold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Basic Skill Gap Detection</li>
              <li className="flex gap-3 text-sm text-slate-300 font-semibold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> PDF Report Export</li>
            </ul>
            <Link to="/app">
              <Button variant="outline" className="w-full h-11 text-[10px] tracking-wider font-bold">Get Started</Button>
            </Link>
          </motion.div>

          {/* Pay-as-you-go */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-slate-950/80 backdrop-blur-md p-8 border-2 border-indigo-500 rounded-2xl flex flex-col relative shadow-[0_0_35px_rgba(99,102,241,0.15)]"
          >
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-indigo-500 text-white text-[8px] uppercase tracking-widest font-mono font-bold px-3 py-1 rounded shadow-md">Popular</div>
            <h3 className="text-lg font-bold mb-2 text-indigo-400">Credit Pack</h3>
            <div className="text-4xl font-black mb-6 font-mono text-white">$5<span className="text-sm font-semibold text-slate-500 tracking-wider font-sans uppercase">/10 scans</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-slate-100 font-extrabold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> 10 Premium ATS Scans</li>
              <li className="flex gap-3 text-sm text-slate-100 font-extrabold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Advanced Skill Matching</li>
              <li className="flex gap-3 text-sm text-slate-100 font-extrabold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> AI Bullet Rewrites</li>
              <li className="flex gap-3 text-sm text-slate-100 font-extrabold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Explainability Feedback</li>
            </ul>
            <Link to="/app?checkout=basic">
              <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 font-bold text-[10px] tracking-wider">Buy Credits</Button>
            </Link>
          </motion.div>

          {/* Pro Tier */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-b from-[#0b0f19] to-slate-950 p-8 border border-white/10 rounded-2xl flex flex-col relative py-12 shadow-2xl shadow-black/45"
          >
            <Zap className="w-6 h-6 text-yellow-400 mb-4" />
            <h3 className="text-lg font-bold mb-2 text-white">Pro Unlimited</h3>
            <div className="text-4xl font-black mb-6 font-mono text-white">$19<span className="text-sm font-semibold text-slate-500 tracking-wider font-sans uppercase">/month</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-slate-300 font-semibold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Unlimited ATS Scans</li>
              <li className="flex gap-3 text-sm text-slate-300 font-semibold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Unlimited AI Rewrites</li>
              <li className="flex gap-3 text-sm text-slate-300 font-semibold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Priority Support</li>
              <li className="flex gap-3 text-sm text-slate-300 font-semibold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Multi-Resume Compare</li>
            </ul>
            <Link to="/app?checkout=pro">
              <Button className="w-full h-11 bg-white text-black hover:bg-slate-200 font-bold text-[10px] tracking-wider">Upgrade to Pro</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

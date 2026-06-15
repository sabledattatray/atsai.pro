import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Target, Zap, Server, Edit3, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useSEO } from '../utils/useSEO';

export default function FeaturesPage() {
  useSEO({
    title: 'Resume Copilot Features - AI ATS Checker & Simulator',
    description: 'Explore the features of Resume Copilot. Our platform offers enterprise ATS simulation, semantic skill matching, AI bullet point rewrites, gap priority diagnostics, and PDF formatting checks.',
    keywords: 'ats simulation, resume scanner features, ai bullet rewriter, semantic skill match, check resume formatting',
    ogImage: 'https://cvwithcopilot.vercel.app/landing_page.png'
  });
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="relative flex flex-col w-full min-h-[calc(100vh-80px)] py-24 px-6 bg-[#030712] text-slate-100 overflow-hidden">
      {/* Dense Grid Background Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>

      {/* Ambient background glows */}
      <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-6 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.1)] backdrop-blur-md"
          >
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
            Platform Capabilities
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight"
          >
            Built for <span className="text-gradient">Modern Recruiting</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium"
          >
            Stop guessing what Applicant Tracking Systems want. Our suite of AI tools reverse-engineers the hiring process so you can apply with absolute confidence.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <FeatureBlock 
            variants={itemVariants}
            icon={<Server className="w-5 h-5" />}
            title="Enterprise ATS Simulation"
            desc="Matches exactly how Workday, Taleo, and Greenhouse parse and weigh your resume sections before any human ever sees it."
          />
          <FeatureBlock 
            variants={itemVariants}
            icon={<Target className="w-5 h-5" />}
            title="Semantic Skill Graph"
            desc="Instead of dumb exact-match keyword spotting, our AI understands context (e.g., matching 'Pandas' to a 'Python' requirement)."
          />
          <FeatureBlock 
            variants={itemVariants}
            icon={<FileSearch className="w-5 h-5" />}
            title="Gap Priority Engine"
            desc="Tells you exactly which missing skills are 'critical' vs 'optional' based on industry standards, ensuring you focus on what matters."
          />
          <FeatureBlock 
            variants={itemVariants}
            icon={<Edit3 className="w-5 h-5" />}
            title="AI Bullet Rewriter"
            desc="Transforms weak, generic responsibilities into high-impact, quantified achievements that score high in recruiter keyword searches."
          />
          <FeatureBlock 
            variants={itemVariants}
            icon={<ShieldCheck className="w-5 h-5" />}
            title="Real-time Explainability"
            desc="Never wonder 'why' you got a low score. Click any missing skill to see the AI's exact reasoning process and where you went wrong."
          />
          <FeatureBlock 
            variants={itemVariants}
            icon={<Zap className="w-5 h-5" />}
            title="ATS Format Compliance"
            desc="Detects complex tables, multi-column layouts, and unreadable fonts that secretly cause your resume to be auto-rejected."
          />
        </motion.div>

        {/* CTA section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24 relative overflow-hidden bg-slate-900/30 border border-white/5 rounded-3xl p-12 text-center shadow-2xl backdrop-blur-md max-w-4xl mx-auto group hover:border-white/10 transition-all duration-500"
        >
          {/* Inner Grid Light Overlay */}
          <div className="absolute inset-0 z-0 opacity-10 bg-grid-pattern pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight relative z-10">
            Ready to see it in action?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium relative z-10">
            Upload your resume for a free semantic gap analysis against any job description.
          </p>
          <div className="relative z-10 flex justify-center">
            <Link to="/app">
              <Button size="lg" className="px-8 h-14 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(99,102,241,0.25)] flex items-center gap-2">
                Start Free Scan <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureBlock({ icon, title, desc, variants }: { icon: React.ReactNode, title: string, desc: string, variants: any }) {
  return (
    <motion.div 
      variants={variants}
      className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-white/10 hover:shadow-xl transition-all duration-300 flex flex-col items-start group hover:-translate-y-1.5"
    >
      <div className="w-12 h-12 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-indigo-300 transition-colors">{title}</h3>
      <p className="text-slate-400 text-xs leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}

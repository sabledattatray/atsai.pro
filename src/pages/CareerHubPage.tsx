import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from '../utils/useSEO';

const ARTICLES = [
  {
    title: "How to Beat the ATS: The Ultimate 2026 Guide",
    category: "Resume Strategy",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=60",
    readTime: "8 min read",
    desc: "Discover the exact parsing logic used by Workday and Greenhouse, and how to format your experience to ensure maximum visibility."
  },
  {
    title: "The Art of the Quantifiable Bullet Point",
    category: "Writing Tips",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
    readTime: "5 min read",
    desc: "Learn why saying 'managed a team' is failing you, and how to use the XYZ formula developed at Google to transform your impact."
  },
  {
    title: "Why Soft Skills are Failing Your Keyword Scans",
    category: "Technical Parsing",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60",
    readTime: "6 min read",
    desc: "Stop using words like 'Hardworking' and 'Motivated'. Here is the exact vocabulary tech recruiters are actually querying for."
  },
  {
    title: "Navigating Career Gaps on a Modern Resume",
    category: "Career Advice",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=60",
    readTime: "4 min read",
    desc: "How to cleanly format sabbaticals, parental leave, or layoffs without triggering automatic rejection filters in enterprise ATS systems."
  },
  {
    title: "The Death of the Objective Statement",
    category: "Resume Strategy",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60",
    readTime: "3 min read",
    desc: "What to write instead in your critical top 20% of the page to hook a recruiter's attention in exactly 6.4 seconds."
  },
  {
    title: "Optimizing for the Human After the Robot",
    category: "Design",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
    readTime: "10 min read",
    desc: "Passing the ATS is step one. How to use typography, whitespace, and visual hierarchy to ensure the hiring manager actually reads it."
  }
];

export default function CareerHubPage() {
  useSEO({
    title: 'Career Hub & AI Resume Optimization Blog | Resume Copilot AI',
    description: 'Discover data-backed career strategies, insider ATS knowledge, and tactical advice on resume writing, technical parsing, and interview prep.',
    keywords: 'career hub, resume writing advice, ats guide 2026, google xyz formula, soft skills keyword search',
    ogImage: 'https://cvwithcopilot.vercel.app/landing_page.png'
  });

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-[#030712] text-slate-100 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Hero Section */}
      <section className="relative py-24 px-6 bg-[#030712] border-b border-white/5 overflow-hidden">
        {/* Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2.5 px-4.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-6 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.1)] backdrop-blur-md">
             <BookOpen className="w-3.5 h-3.5" /> Learning Center
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            Career <span className="text-gradient">Hub</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium">
            Data-backed strategies, insider ATS knowledge, and tactical advice to engineer your transition into top-tier tech roles.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16 px-6 relative z-10 hidden md:block">
        <div className="container mx-auto max-w-6xl">
           <div className="relative rounded-2xl overflow-hidden group cursor-pointer border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent group-hover:via-slate-950/30 transition-colors z-10" />
              <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600&auto=format&fit=crop&q=80" alt="Featured" className="w-full h-[450px] object-cover group-hover:scale-[1.01] transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-full p-10 z-20 flex flex-col items-start gap-3">
                 <span className="bg-indigo-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded tracking-widest font-mono">Featured Guide</span>
                 <h2 className="text-3xl sm:text-4xl font-extrabold text-white max-w-3xl leading-tight">Mastering the Tech Interview: From Initial Screen to Final Offer</h2>
                 <p className="text-slate-300 max-w-2xl text-sm md:text-base mb-4 font-medium">A comprehensive definitive guide detailing exact negotiation tactics, system design framing, and behavioral structuring.</p>
                 <Button className="bg-white text-black hover:bg-slate-200 font-bold uppercase tracking-widest text-xs h-12 px-8 shadow-lg">Read Full Guide</Button>
              </div>
           </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
           <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-4">
              <h3 className="text-2xl font-extrabold text-white tracking-tight">Latest Articles</h3>
           </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ARTICLES.map((article, idx) => (
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    key={idx} 
                    className="group cursor-pointer flex flex-col p-5 bg-[#0b0f19]/35 border border-white/5 rounded-2xl shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1.5 hover:border-white/10 transition-all duration-300 backdrop-blur-md"
                 >
                    <div className="relative h-52 bg-slate-950/60 rounded-xl overflow-hidden mb-5 border border-white/5">
                       <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                       <div className="absolute top-3 left-3 z-20">
                          <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded backdrop-blur">
                             {article.category}
                          </span>
                       </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                       <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-2.5 font-mono font-semibold uppercase tracking-wider">
                          <Clock className="w-3 h-3 text-indigo-400" /> {article.readTime}
                       </div>
                       <h4 className="text-lg font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors leading-tight">{article.title}</h4>
                       <p className="text-slate-400 text-xs leading-relaxed mb-6 flex-1 font-medium">{article.desc}</p>
                       <div className="flex items-center text-xs font-bold text-indigo-400 group-hover:text-indigo-300 cursor-pointer uppercase tracking-widest transition-colors mt-auto">
                          Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                       </div>
                    </div>
                 </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="py-28 bg-[#030712] relative overflow-hidden border-t border-white/5 text-center mt-12">
         {/* Inner Grid Light Overlay */}
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#030712] to-[#030712] opacity-80 pointer-events-none"></div>
         
         <div className="container mx-auto max-w-3xl relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tight text-white leading-none">Stop guessing. Start optimizing.</h2>
            <p className="text-slate-400 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed font-medium">Upload your resume to our AI analyzer and see exactly what recruiters see. Get actionable fixes in under 30 seconds.</p>
            <Link to="/app">
               <Button className="h-14 px-8 bg-white text-black hover:bg-slate-100 hover:text-black font-bold uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-transform duration-300">
                  Analyze My Resume Now
               </Button>
            </Link>
         </div>
      </section>
    </div>
  );
}

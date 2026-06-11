import React from 'react';
import { ChevronRight, CheckCircle2, Zap, FileSearch, Target, TrendingUp, TrendingDown, Briefcase, Sparkles, BarChart2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-28 pb-32 bg-[#F8F9FA] overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="container mx-auto px-4 max-w-6xl flex justify-center text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E5E7EB] text-[#1A66FF] text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] mb-8 rounded-full shadow-sm">
              <span className="w-2 h-2 bg-[#1A66FF] rounded-full animate-pulse"></span>
              SaaS AI Engine Now Live
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-[5.5rem] font-extrabold text-black leading-[1.05] tracking-tight mb-8">
              Beat the ATS. <br className="hidden sm:block" />
              <span className="text-[#1A66FF]">Land the Interview.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
              Upload your resume and the job description. Our semantic AI engine analyzes keywords, detects missing skills, and rewrites your achievements for maximum ATS compatibility.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div 
                className="w-full sm:w-auto"
                onClick={() => { window.location.href = '/app'; }}
              >
                <Button size="lg" className="w-full sm:w-auto text-sm px-10 h-14 bg-black hover:bg-gray-800 text-white font-bold tracking-wider uppercase transition-all shadow-xl hover:shadow-2xl">
                  Scan My Resume Free
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4 text-[#1A66FF]" /> No credit card required.
              </div>
            </div>
          </motion.div>
        </div>
          
          {/* Dashboard Preview Mockup - Premium Stripe/Vercel Style */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 mx-auto max-w-6xl bg-white border border-[#E5E7EB] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] rounded-xl flex flex-col text-left mb-10 overflow-hidden relative z-10"
          >
             {/* Header */}
             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FAFAFA]">
                <div className="flex items-center gap-3 relative z-10">
                   <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                     <Target className="w-4 h-4 text-indigo-600" />
                   </div>
                   <div>
                     <h3 className="font-bold text-sm text-gray-900 tracking-tight">Senior Product Engineer</h3>
                     <p className="text-xs text-gray-500 font-medium">Stripe • New York, NY</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 relative z-10 hidden sm:flex">
                   <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold tracking-widest uppercase rounded-full border border-emerald-200 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div> 
                     Live Analysis
                   </div>
                </div>
             </div>

             {/* Main Dashboard Layout */}
             <div className="p-6 lg:p-8 bg-[#FCFCFD] grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
                 {/* Background subtle gradients for glassmorphism feel */}
                 <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                     <div className="absolute top-[-50px] right-[-50px] w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-3xl"></div>
                     <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-purple-50/30 rounded-full blur-3xl"></div>
                 </div>

                 {/* Left Column - 8 cols */}
                 <div className="lg:col-span-8 flex flex-col gap-6 z-10 relative">
                     
                     {/* Insight Cards Row */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Keyword Alignment Insight Card */}
                        <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-1 h-full bg-indigo-500"></div>
                           <div className="flex justify-between items-start mb-5">
                              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Semantic Match</h4>
                              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                                 <TrendingUp className="w-3 h-3" /> +12%
                              </div>
                           </div>
                           <div className="text-4xl font-extrabold text-black tracking-tight mb-2">92<span className="text-gray-400 text-xl font-medium tracking-normal">/100</span></div>
                           <p className="text-[13px] text-gray-500 mb-5 leading-relaxed font-medium">Strong alignment with core engineering requirements. <span className="text-amber-600">Missing specific CI/CD pipeline automation tools.</span></p>
                           <div className="bg-indigo-50/50 rounded-lg p-3 border border-indigo-100 flex gap-3 items-start">
                              <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                              <div className="text-[11px] text-indigo-900 font-medium leading-relaxed">
                                 <strong>Priority Action:</strong> Add GitHub Actions and Docker to your recent experience to boost senior-level matching.
                              </div>
                           </div>
                        </div>

                        {/* Experience Relevance Insight Card */}
                        <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-6 hover:shadow-lg transition-all duration-300">
                           <div className="flex justify-between items-start mb-5">
                              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Experience Depth</h4>
                              <div className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[10px] font-bold">
                                 <TrendingDown className="w-3 h-3" /> -4%
                              </div>
                           </div>
                           <div className="text-4xl font-extrabold text-black tracking-tight mb-2">3.5<span className="text-gray-400 text-xl font-medium tracking-normal"> yrs</span></div>
                           <p className="text-[13px] text-gray-500 mb-5 leading-relaxed font-medium">Job requests 5+ years. Your quantified impact in scaling systems partially bridges this gap.</p>
                           <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex gap-3 items-start">
                              <Target className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                              <div className="text-[11px] text-gray-700 font-medium leading-relaxed">
                                 <strong>Strategic Advisory:</strong> Emphasize architectural decision-making and mentorship in your summary section.
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Semantic Visual: Keyword Heatmap */}
                     <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-shadow duration-300">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                           <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
                             <BarChart2 className="w-4 h-4 text-indigo-500" />
                             Keyword Density & Gap Map
                           </h4>
                           <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 bg-white px-2 py-1 rounded shadow-sm border border-gray-100 hidden sm:block">Workday Engine Simulation</span>
                        </div>
                        <div className="p-6">
                           <div className="flex flex-wrap gap-2.5 mb-6">
                              {/* Hot/Matched */}
                              <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-200/60 text-indigo-700 rounded text-xs font-bold flex items-center justify-between gap-4">
                                 React JS <span className="opacity-50 text-[9px] font-bold uppercase">14x Match</span>
                              </div>
                              <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-200/60 text-indigo-700 rounded text-xs font-bold flex items-center justify-between gap-4">
                                 TypeScript <span className="opacity-50 text-[9px] font-bold uppercase">8x Match</span>
                              </div>
                              <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-200/60 text-indigo-700 rounded text-xs font-bold flex items-center justify-between gap-4">
                                 Node.js <span className="opacity-50 text-[9px] font-bold uppercase">5x Match</span>
                              </div>
                              {/* Warm/Partial */}
                              <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded text-xs font-semibold flex items-center justify-between gap-4">
                                 System Design <span className="opacity-40 text-[9px] font-bold uppercase">2x Match</span>
                              </div>
                              <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded text-xs font-semibold flex items-center justify-between gap-4">
                                 GraphQL <span className="opacity-40 text-[9px] font-bold uppercase">1x Match</span>
                              </div>
                              {/* Missing/Critical */}
                              <div className="px-3 py-1.5 bg-rose-50 border border-rose-200/60 text-rose-700 rounded text-xs font-bold flex items-center justify-between gap-4 cursor-pointer hover:bg-rose-100 transition-colors">
                                 Microservices <span className="text-rose-500 text-[9px] font-extrabold uppercase tracking-widest">Missing</span>
                              </div>
                              <div className="px-3 py-1.5 bg-rose-50 border border-rose-200/60 text-rose-700 rounded text-xs font-bold flex items-center justify-between gap-4 cursor-pointer hover:bg-rose-100 transition-colors">
                                 Docker/Kubernetes <span className="text-rose-500 text-[9px] font-extrabold uppercase tracking-widest">Missing</span>
                              </div>
                           </div>
                           
                           {/* AI Insight Layer */}
                           <div className="bg-[#FAFAFA] rounded border border-gray-100 p-4 flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center shrink-0">
                                <Sparkles className="w-4 h-4 text-[#1A66FF]" />
                              </div>
                              <div>
                                 <h5 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest mb-1.5">Intelligent Context</h5>
                                 <p className="text-[13px] text-gray-500 leading-relaxed font-medium mb-2 w-full">The ATS is strongly indexing for infrastructure. You have exceptional frontend keyword coverage (React, TS), but critical deficits in the required backend/DevOps context.</p>
                                 <p className="text-xs text-[#1A66FF] font-bold cursor-pointer hover:underline">Apply AI Rewrite to Bullet Points →</p>
                              </div>
                           </div>
                        </div>
                     </div>

                 </div>

                 {/* Right Column - 4 cols */}
                 <div className="lg:col-span-4 flex flex-col gap-6 relative z-10 w-full">
                     
                     {/* Premium ATS Score Card */}
                     <div className="bg-[#0A0A0B] rounded-xl shadow-2xl relative border border-gray-800 overflow-hidden group">
                         {/* Subtle glowing effect */}
                         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                         
                         <div className="p-8 relative z-10 flex flex-col items-center">
                            <h3 className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.25em] mb-8 text-center text-balance w-full">Aggregate ATS Score</h3>
                            
                            {/* Simulated Circular Ring */}
                            <div className="relative w-40 h-40 flex items-center justify-center mb-8 shrink-0">
                               <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0" viewBox="0 0 100 100">
                                   <circle cx="50" cy="50" r="45" fill="none" stroke="#262626" strokeWidth="6" />
                                   <circle cx="50" cy="50" r="45" fill="none" stroke="#4F46E5" strokeWidth="6" strokeDasharray="283" strokeDashoffset="31" className="drop-shadow-[0_0_12px_rgba(79,70,229,0.6)] animate-[stroke-dashoffset_1.5s_ease-out_forwards]" strokeLinecap="round" />
                               </svg>
                               <div className="relative z-10 flex flex-col items-center justify-center mt-2">
                                  <span className="text-6xl font-extrabold text-white tracking-tighter leading-none mb-1">89</span>
                                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">Top 12%</span>
                               </div>
                            </div>
                            
                            {/* Breakdown */}
                            <div className="w-full space-y-4">
                               <div>
                                 <div className="flex justify-between items-center text-[11px] mb-1.5">
                                    <span className="text-gray-400 font-bold uppercase tracking-widest">Hard Skills</span>
                                    <span className="text-white font-bold">94/100</span>
                                 </div>
                                 <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[94%] shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                                 </div>
                               </div>
                               <div>
                                 <div className="flex justify-between items-center text-[11px] mb-1.5">
                                    <span className="text-gray-400 font-bold uppercase tracking-widest">Structure Rules</span>
                                    <span className="text-white font-bold">100/100</span>
                                 </div>
                                 <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                                 </div>
                               </div>
                            </div>
                         </div>
                     </div>

                     {/* AI Career Decisions panel */}
                     <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm flex flex-col overflow-hidden hover:border-indigo-200 transition-colors duration-300">
                        <div className="p-4 border-b border-gray-100 bg-indigo-50/50">
                           <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest flex items-center gap-2">
                             <AlertTriangle className="w-4 h-4 text-indigo-600" />
                             Decision Intelligence Layer
                           </h4>
                        </div>
                        <div className="p-6 flex flex-col gap-6">
                           {/* Decision 1 */}
                           <div>
                              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Primary Verdict</div>
                              <div className="flex items-center gap-2 mb-2">
                                 <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]"></div>
                                 <span className="text-sm font-bold text-gray-900 tracking-tight">Highly Recommended to Apply</span>
                              </div>
                              <p className="text-[12px] text-gray-500 leading-relaxed font-medium">Your profile exceeds the threshold for recruiter screening selection by +14%.</p>
                           </div>
                           
                           {/* Priority Action */}
                           <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                              <div className="text-[9px] font-bold text-amber-700 uppercase tracking-widest mb-2 flex items-center justify-between">
                                 Top Priority Intervention
                                 <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[8px] font-black">CRITICAL</span>
                              </div>
                              <span className="text-[13px] font-bold text-gray-900 block mb-1">Quantify System Impact</span>
                              <p className="text-xs text-amber-900/80 font-medium">Inject raw metrics into your last role. Example: "scaled infrastructure to handle 40% increased load."</p>
                           </div>
                        </div>
                     </div>

                 </div>

             </div>
          </motion.div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted by candidates hired at</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <span className="text-2xl font-extrabold font-sans tracking-tight">GOOGLE</span>
            <span className="text-2xl font-extrabold font-sans tracking-tight">MICROSOFT</span>
            <span className="text-2xl font-extrabold font-sans tracking-tight">STRIPE</span>
            <span className="text-2xl font-extrabold font-sans tracking-tight">META</span>
            <span className="text-2xl font-extrabold font-sans tracking-tight">NETFLIX</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl mb-16 text-center">
           <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black mb-6">Built for precision.</h2>
           <p className="text-lg text-gray-500 max-w-2xl mx-auto">Everything you need to circumvent the ATS black hole and land in the right inbox.</p>
        </div>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard 
                index="01"
                title="Structural Integrity"
                description="Score formulas analyzing keyword match, experience relevance, formatting health, and section completeness."
              />
              <FeatureCard 
                index="02"
                title="Missing Skills Detection"
                description="Identify critical gaps between your experience and the job description, ranked by priority."
              />
              <FeatureCard 
                index="03"
                title="AI Rewrite Engine"
                description="Transform generic bullet points into compelling, quantified achievements tailored to the role."
              />
              <FeatureCard 
                index="04"
                title="Interview Predictor"
                description="Get a distinct probability score for passing the ATS, recruiter screen, and landing the interview."
              />
              <FeatureCard 
                index="05"
                title="Application Tracker"
                description="A built-in CRM for your job search. Track applied, interviewing, and offers all in one neat pipeline."
              />
               <FeatureCard 
                index="06"
                title="Perfect Formatting"
                description="Generate instantly downloadable, ATS-safe PDF templates proven to parse correctly every time."
              />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E5E7EB] text-black text-[10px] font-bold uppercase tracking-[0.15em] mb-6 rounded-full shadow-sm">
               Transparent Architecture
             </div>
             <h2 className="text-4xl font-extrabold mb-6 text-black tracking-tight">Built with Absolute Transparency</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
             <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
               <CheckCircle2 className="w-10 h-10 text-[#1A66FF] mb-6" />
               <h3 className="font-bold text-lg mb-3">Simulated Parser Logic</h3>
               <p className="text-sm text-gray-500 leading-relaxed">We don't use arbitrary algorithms. We parse your PDF exactly how Workday and Taleo do.</p>
             </div>
             <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
               <FileSearch className="w-10 h-10 text-[#1A66FF] mb-6" />
               <h3 className="font-bold text-lg mb-3"><Link to="/seo/resume-score-python-developer" className="hover:text-[#1A66FF] transition-colors">View Sample Reports</Link></h3>
               <p className="text-sm text-gray-500 leading-relaxed">See exactly what recruiters see before you hit submit. No hidden scores, absolute transparency.</p>
             </div>
             <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
               <Target className="w-10 h-10 text-[#1A66FF] mb-6" />
               <h3 className="font-bold text-lg mb-3">Real Keyword Extraction</h3>
               <p className="text-sm text-gray-500 leading-relaxed">Our semantic engine matches contextual usage, not just keyword stuffing.</p>
             </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-24 bg-black text-white relative">
         <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest mb-6 rounded-full border border-white/20">
               Get Started Today
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Ready to optimize your career?</h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">Join thousands of professionals landing their dream roles with AI-powered resume optimization. Instantly adapt to any job description.</p>
            <Link to="/app">
               <Button size="lg" className="h-14 px-10 bg-white text-black hover:bg-gray-100 hover:text-black font-bold uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-transform">
                 START FREE OPTIMIZATION
               </Button>
            </Link>
         </div>
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black opacity-60"></div>
      </section>
    </div>
  );
}

function FeatureCard({ index, title, description }: { index: string, title: string, description: string }) {
  return (
    <div className="p-8 flex flex-col justify-start bg-white h-full border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className="w-10 h-10 bg-black text-white flex items-center justify-center mb-6 rounded-lg shadow-md">
        <span className="text-xs font-bold tracking-wider">{index}</span>
      </div>
      <h3 className="font-extrabold text-lg mb-3 text-black">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed font-medium">{description}</p>
    </div>
  );
}

// Ensure Zap icon from lucide is passed cleanly
const ZAP = Zap;

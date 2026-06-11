import React, { useState } from 'react';
import { ChevronRight, CheckCircle2, Zap, FileSearch, Target, TrendingUp, TrendingDown, Briefcase, Sparkles, BarChart2, AlertTriangle, Search, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { coverLetterTemplates, categorizedCoverLetters, slugify } from '../data/coverLetters';

export default function LandingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(categorizedCoverLetters[0].category);
  
  // If search is active, we search globally across all and ignore category tabs visually
  const isSearching = searchTerm.trim().length > 0;
  
  const filteredTemplates = isSearching 
    ? coverLetterTemplates.filter(template => template.toLowerCase().includes(searchTerm.toLowerCase()))
    : categorizedCoverLetters.find(c => c.category === activeCategory)?.items || [];

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-24 lg:pt-36 lg:pb-40 bg-[#121328] overflow-hidden">
        {/* Square Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #4F46E5 1px, transparent 1px), linear-gradient(to bottom, #4F46E5 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        {/* Background Glows */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#1A66FF]/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-4 max-w-7xl flex flex-col lg:flex-row items-center gap-16 relative z-10">
          
          {/* Left Hero Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-blue-300 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] mb-8 rounded-full shadow-[0_0_15px_rgba(26,102,255,0.2)] backdrop-blur-sm">
              <span className="w-2 h-2 bg-[#1A66FF] rounded-full animate-pulse shadow-[0_0_8px_rgba(26,102,255,0.8)]"></span>
              SaaS AI Engine Now Live
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[4.5rem] font-extrabold text-white leading-[1.05] tracking-tight mb-8">
              Beat the ATS. <br className="hidden sm:block lg:hidden xl:block" />
              <span className="text-[#1A66FF]">Land the Interview.</span>
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100/70 mb-10 max-w-2xl leading-relaxed font-medium">
              Upload your resume and the job description. Our semantic AI engine analyzes keywords, detects missing skills, and rewrites your achievements for maximum ATS compatibility.
            </p>
            <div className="flex flex-col flex-wrap sm:flex-row items-center justify-center lg:justify-start gap-4 w-full mb-4">
              <Link to="/app" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-sm px-8 h-14 bg-[#1A66FF] hover:bg-blue-700 text-white font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(26,102,255,0.3)] hover:shadow-[0_0_30px_rgba(26,102,255,0.5)]">
                  Scan My Resume Free
                </Button>
              </Link>
              <Link to="/templates" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm px-8 h-14 border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold tracking-wider uppercase transition-all backdrop-blur-sm">
                  Build Your Resume
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-200/50 uppercase tracking-widest">
              <CheckCircle2 className="w-3 h-3 text-[#1A66FF]" /> No credit card required.
            </div>
          </motion.div>
          
          {/* Right Side Visual Component */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full lg:w-1/2 relative flex justify-center lg:justify-end mt-10 lg:mt-0"
          >
             {/* Decorative Background Elements */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] lg:w-[140%] aspect-square bg-gradient-to-tr from-[#1A66FF]/10 to-purple-500/10 rounded-full blur-3xl shadow-[inset_0_0_100px_rgba(255,255,255,0.5)] z-0 pointer-events-none"></div>

             {/* The Resume Preview Stage */}
             <div className="relative z-10 w-full max-w-sm sm:max-w-md w-[340px] sm:w-[420px] transition-transform hover:scale-[1.02] duration-700 ease-out">
                {/* Main Resume Paper */}
                <div className="bg-[#f8f9fa] rounded-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8),_0_0_40px_rgba(26,102,255,0.2)] border border-white/10 overflow-hidden flex flex-col h-[560px] relative">
                   <div className="h-10 bg-[#e5e7eb] flex items-center px-4 justify-between shrink-0 border-b border-gray-300">
                      <div className="flex gap-2">
                         <div className="w-2.5 h-2.5 rounded-full bg-rose-400 border border-rose-500/20"></div>
                         <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500/20"></div>
                         <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-500/20"></div>
                      </div>
                      <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                         <Zap className="w-3 h-3 text-[#1A66FF]" /> AI Refinement
                      </div>
                   </div>
                   
                   {/* Actual Resume Content - Scaled down */}
                   <div className="flex-1 p-6 relative bg-white m-3 rounded shadow-sm border border-gray-200 overflow-hidden text-left">
                       {/* Header */}
                       <div className="border-b-2 border-gray-900 pb-3 mb-4">
                          <h1 className="text-xl font-serif font-bold text-gray-900 tracking-tight leading-none mb-1 text-center">ALEXANDER WRIGHT</h1>
                          <p className="text-[8px] text-center text-[#1A66FF] font-sans font-bold tracking-[0.2em] uppercase mb-2">Senior Full Stack Engineer</p>
                          <div className="flex justify-center gap-3 text-[7px] text-gray-500 font-sans font-medium">
                             <span>New York, NY</span>
                             <span>•</span>
                             <span>alexander.wright@email.com</span>
                             <span>•</span>
                             <span>github.com/awright</span>
                          </div>
                       </div>
                       
                       {/* Grid Layout */}
                       <div className="flex gap-5">
                          {/* Left Column */}
                          <div className="w-2/3 space-y-4">
                             <div>
                                <h2 className="text-[9px] font-sans font-extrabold text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-1 mb-2">Professional Experience</h2>
                                
                                <div className="mb-3">
                                   <div className="flex justify-between items-baseline mb-0.5">
                                      <h3 className="text-[9px] font-bold text-gray-800">Stripe</h3>
                                      <span className="text-[7px] text-gray-500 font-sans font-semibold">2021 - Present</span>
                                   </div>
                                   <p className="text-[8px] italic text-gray-600 mb-1.5 font-serif">Senior Product Engineer — New York, NY</p>
                                   <ul className="space-y-1.5 text-[7px] text-gray-700 leading-normal font-sans ml-2 list-none">
                                      <li className="relative">
                                         <span className="absolute -left-2 top-1 w-0.5 h-0.5 bg-gray-500 rounded-full"></span>
                                         Architected and led the migration of legacy payment processing pipelines to a modern microservices architecture using Go and Kafka, improving throughput by 40%.
                                      </li>
                                      <li className="relative group">
                                         {/* AI Highlight Backdrop */}
                                         <span className="absolute -inset-x-1 -inset-y-0.5 bg-[#1A66FF]/10 rounded border border-[#1A66FF]/20 -z-10"></span>
                                         <span className="absolute -left-2 top-1 w-1 h-1 bg-[#1A66FF] rounded-full shadow-[0_0_4px_rgba(26,102,255,0.8)]"></span>
                                         <span className="font-medium text-gray-900">Implemented <span className="font-bold text-[#1A66FF]">CI/CD Pipelines</span> using GitHub Actions and <span className="font-bold text-[#1A66FF]">Docker</span>, decreasing deployment times by 65%.</span>
                                         <span className="inline-block bg-[#1A66FF] text-white px-1 py-0 rounded-[2px] font-bold text-[5px] uppercase ml-1 relative -top-0.5 shadow-sm tracking-wider">Optimized ✨</span>
                                      </li>
                                      <li className="relative">
                                         <span className="absolute -left-2 top-1 w-0.5 h-0.5 bg-gray-500 rounded-full"></span>
                                         Mentored junior engineers and established internal conventions for the React component library used by over 50+ developers.
                                      </li>
                                   </ul>
                                </div>
                                
                                <div className="mb-3">
                                   <div className="flex justify-between items-baseline mb-0.5">
                                      <h3 className="text-[9px] font-bold text-gray-800">Vercel</h3>
                                      <span className="text-[7px] text-gray-500 font-sans font-semibold">2018 - 2021</span>
                                   </div>
                                   <p className="text-[8px] italic text-gray-600 mb-1.5 font-serif">Frontend Software Engineer — San Francisco, CA</p>
                                   <ul className="space-y-1.5 text-[7px] text-gray-700 leading-normal font-sans ml-2 list-none">
                                      <li className="relative">
                                         <span className="absolute -left-2 top-1 w-0.5 h-0.5 bg-gray-500 rounded-full"></span>
                                         <div className="space-y-1 w-full mt-1">
                                            <div className="h-1.5 bg-gray-200 rounded-sm w-[95%]"></div>
                                            <div className="h-1.5 bg-gray-200 rounded-sm w-[85%]"></div>
                                         </div>
                                      </li>
                                      <li className="relative mt-1">
                                         <span className="absolute -left-2 top-1 w-0.5 h-0.5 bg-gray-500 rounded-full"></span>
                                         <div className="h-1.5 bg-gray-200 rounded-sm w-[90%] mt-1"></div>
                                      </li>
                                   </ul>
                                </div>
                             </div>
                          </div>
                          
                          {/* Right Column */}
                          <div className="w-1/3 space-y-4">
                             <div>
                                <h2 className="text-[9px] font-sans font-extrabold text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-1 mb-2">Skills</h2>
                                <div className="flex flex-wrap gap-1 font-sans">
                                   <span className="px-1.5 py-0.5 bg-gray-50 text-gray-600 text-[6px] rounded border border-gray-200 font-semibold">React.js</span>
                                   <span className="px-1.5 py-0.5 bg-gray-50 text-gray-600 text-[6px] rounded border border-gray-200 font-semibold">TypeScript</span>
                                   <span className="px-1.5 py-0.5 bg-gray-50 text-gray-600 text-[6px] rounded border border-gray-200 font-semibold">Node.js</span>
                                   <span className="px-1.5 py-0.5 bg-gray-50 text-gray-600 text-[6px] rounded border border-gray-200 font-semibold">PostgreSQL</span>
                                   <span className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[6px] rounded font-bold shadow-sm relative"><span className="absolute -top-1 -right-1 flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span></span>Docker</span>
                                   <span className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[6px] rounded font-bold shadow-sm relative">CI/CD Metrics</span>
                                </div>
                             </div>
                             
                             <div>
                                <h2 className="text-[9px] font-sans font-extrabold text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-1 mb-2">Education</h2>
                                <div className="mb-2">
                                   <div className="text-[8px] font-bold text-gray-800 leading-tight">Univ. of California, Berkeley</div>
                                   <div className="text-[7px] text-gray-600 font-sans mt-0.5 font-medium">B.S. Computer Science</div>
                                   <div className="text-[6px] text-gray-400 font-sans mt-0.5 uppercase tracking-widest">2014 - 2018</div>
                                </div>
                             </div>
                             
                             <div>
                                <h2 className="text-[9px] font-sans font-extrabold text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-1 mb-2">Certifications</h2>
                                <div className="mb-2">
                                   <div className="h-1.5 bg-gray-200 rounded-sm w-[90%] mb-1"></div>
                                   <div className="h-1.5 bg-gray-200 rounded-sm w-[60%]"></div>
                                </div>
                             </div>
                          </div>
                          
                       </div>

                       {/* Scanning overlay effect */}
                       <motion.div 
                         initial={{ top: -50, opacity: 0 }}
                         animate={{ top: '120%', opacity: [0, 1, 1, 0] }}
                         transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                         className="absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-[#1A66FF]/10 to-[#1A66FF]/30 z-10 pointer-events-none border-b border-[#1A66FF]"
                       ></motion.div>
                       
                   </div>
                </div>

                {/* Score Card Floating */}
                <motion.div 
                   animate={{ y: [0, -12, 0] }}
                   transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute -top-6 -right-6 lg:-right-16 bg-white rounded-xl shadow-[0_15px_40px_-5px_rgba(0,0,0,0.15)] p-4 border border-gray-100 flex items-center gap-4 z-20"
                >
                   <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#F3F4F6" strokeWidth="8" />
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#10B981" strokeWidth="8" strokeDasharray="283" strokeDashoffset="28" strokeLinecap="round" />
                      </svg>
                      <span className="absolute font-bold text-gray-900 text-sm">90</span>
                   </div>
                   <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">ATS Match</h4>
                      <p className="text-sm font-bold text-emerald-600">Excellent</p>
                   </div>
                </motion.div>

                {/* Keyword Added Floating */}
                <motion.div 
                   animate={{ y: [0, 8, 0] }}
                   transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                   className="absolute bottom-24 -left-6 lg:-left-12 bg-white rounded-xl shadow-[0_15px_40px_-5px_rgba(0,0,0,0.15)] p-4 border border-gray-100 flex items-center gap-3 z-20"
                >
                   <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                     <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                   </div>
                   <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Keyword Added</h4>
                      <p className="text-xs font-bold text-gray-800">"CI/CD Pipelines"</p>
                   </div>
                </motion.div>
                
                {/* Missing Skill Floating */}
                <motion.div 
                   animate={{ y: [0, -6, 0] }}
                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                   className="absolute top-1/3 -left-8 lg:-left-20 bg-white rounded-xl shadow-[0_15px_40px_-5px_rgba(0,0,0,0.15)] p-3 border border-gray-100 flex items-center gap-3 z-30 hidden sm:flex"
                >
                   <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                     <TrendingDown className="w-3 h-3 text-red-500" />
                   </div>
                   <div>
                      <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Missing</h4>
                      <p className="text-[11px] font-bold text-red-600">Docker</p>
                   </div>
                </motion.div>

             </div>
          </motion.div>
        
        </div>
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
      
      {/* Cover Letters Section */}
      <section className="py-24 bg-[#FAFAFA] border-b border-gray-100" id="cover-letters">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black mb-6">Cover Letters for Every Role</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">Browse hundreds of specialized cover letter templates crafted for your specific industry. Includes Professional, Creative, and Modern variations.</p>
            
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by role (e.g., Software Engineer)" 
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A66FF] shadow-sm text-sm bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {!isSearching && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {categorizedCoverLetters.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(cat.category)}
                  className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all ${
                    activeCategory === cat.category 
                      ? 'bg-[#1A66FF] text-white shadow-md' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cat.category} <span className="opacity-70 font-medium ml-1">({cat.items.length})</span>
                </button>
              ))}
            </div>
          )}

          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template, idx) => (
                    <motion.div
                      key={template}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link to={`/cover-letters/${slugify(template)}`} className="p-3 text-[13px] text-gray-700 hover:text-[#1A66FF] hover:bg-blue-50/50 rounded-lg border border-transparent hover:border-blue-100 transition-colors flex items-center gap-3 font-medium group text-left block w-full h-full">
                        <FileText className="w-4 h-4 text-gray-400 group-hover:text-[#1A66FF] shrink-0" />
                        <span className="truncate" title={template}>{template}</span>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center text-gray-500 font-medium w-full">
                    No cover letters found matching "{searchTerm}".
                  </div>
                )}
              </AnimatePresence>
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

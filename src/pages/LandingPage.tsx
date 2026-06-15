import React, { useState } from 'react';
import { ChevronRight, CheckCircle2, Zap, FileSearch, Target, TrendingUp, TrendingDown, Briefcase, Sparkles, BarChart2, AlertTriangle, Search, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { coverLetterTemplates, categorizedCoverLetters, slugify } from '../data/coverLetters';

export default function LandingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(categorizedCoverLetters[0].category);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  
  // If search is active, we search globally across all and ignore category tabs visually
  const isSearching = searchTerm.trim().length > 0;
  
  const filteredTemplates = isSearching 
    ? coverLetterTemplates.filter(template => template.toLowerCase().includes(searchTerm.toLowerCase()))
    : categorizedCoverLetters.find(c => c.category === activeCategory)?.items || [];

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setShowAllTemplates(false);
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setShowAllTemplates(false);
  };

  const displayedTemplates = showAllTemplates ? filteredTemplates : filteredTemplates.slice(0, 12);

  return (
    <div className="flex flex-col w-full overflow-hidden bg-[#030712] text-slate-100">
      {/* Hero Section */}
      <section className="relative pt-24 pb-28 lg:pt-36 lg:pb-44 bg-[#030712] overflow-hidden">
        {/* Grid Overlay with fade mask */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]"></div>
        

        {/* Background Glows */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[20%] left-[40%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="container mx-auto px-4 max-w-7xl flex flex-col lg:flex-row items-center gap-16 relative z-10">
          
          {/* Left Hero Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2.5 px-4.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-8 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.15)] backdrop-blur-md">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
              SaaS AI Engine Now Live
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[4.5rem] font-black text-white leading-[1.05] tracking-tight mb-8">
              Beat the ATS. <br className="hidden sm:block lg:hidden xl:block" />
              <span className="text-gradient">Land the Interview.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed font-medium">
              Upload your resume and the job description. Our semantic AI engine analyzes keywords, detects missing skills, and rewrites your achievements for maximum ATS compatibility.
            </p>
            <div className="flex flex-col flex-wrap sm:flex-row items-center justify-center lg:justify-start gap-4 w-full mb-6">
              <Link to="/app" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-8 h-14 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                  Scan My Resume Free
                </Button>
              </Link>
              <Link to="/templates" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-14 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold tracking-widest uppercase transition-all backdrop-blur-md">
                  Build Your Resume
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" /> No credit card required.
            </div>
          </motion.div>
          
          {/* Right Side Visual Component */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2 relative flex justify-center lg:justify-end mt-10 lg:mt-0"
          >
             {/* The Resume Preview Stage */}
             <div className="relative z-10 w-full max-w-sm sm:max-w-md w-[340px] sm:w-[420px] transition-transform hover:scale-[1.02] duration-700 ease-out">
                {/* Main Resume Paper */}
                <div className="bg-[#0b0f19] rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[560px] relative shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
                   <div className="h-11 bg-slate-950/80 flex items-center px-4 justify-between shrink-0 border-b border-white/10">
                      <div className="flex gap-2">
                         <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70"></div>
                         <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70"></div>
                         <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></div>
                      </div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                         <Zap className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> AI Refinement
                      </div>
                   </div>
                   
                   {/* Actual Resume Content - Scaled down */}
                   <div className="flex-1 p-6 relative bg-slate-950 m-3 rounded-xl border border-white/5 overflow-hidden text-left shadow-inner">
                        {/* Header */}
                        <div className="border-b border-white/10 pb-3 mb-4 text-center">
                           <h1 className="text-xl font-bold text-white tracking-tight leading-none mb-1">ALEXANDER WRIGHT</h1>
                           <p className="text-[8px] text-indigo-400 font-mono font-bold tracking-[0.25em] uppercase mb-2">Senior Full Stack Engineer</p>
                           <div className="flex justify-center gap-3 text-[7px] text-slate-500 font-medium font-mono">
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
                                 <h2 className="text-[9px] font-extrabold text-white uppercase tracking-widest border-b border-white/5 pb-1 mb-2">Professional Experience</h2>
                                 
                                 <div className="mb-3">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                       <h3 className="text-[9px] font-bold text-slate-200">Stripe</h3>
                                       <span className="text-[7px] text-slate-500 font-mono font-semibold">2021 - Present</span>
                                    </div>
                                    <p className="text-[8px] italic text-slate-400 mb-1.5">Senior Product Engineer — New York, NY</p>
                                    <ul className="space-y-1.5 text-[7px] text-slate-400 leading-normal ml-2 list-none">
                                       <li className="relative">
                                          <span className="absolute -left-2 top-1 w-0.5 h-0.5 bg-slate-600 rounded-full"></span>
                                          Architected and led the migration of legacy payment processing pipelines to a modern microservices architecture using Go and Kafka, improving throughput by 40%.
                                       </li>
                                       <li className="relative group">
                                          {/* AI Highlight Backdrop */}
                                          <span className="absolute -inset-x-1 -inset-y-0.5 bg-indigo-500/10 rounded border border-indigo-500/20 -z-10"></span>
                                          <span className="absolute -left-2 top-1 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
                                          <span className="font-semibold text-slate-200">Implemented <span className="font-bold text-indigo-400">CI/CD Pipelines</span> using GitHub Actions and <span className="font-bold text-indigo-400">Docker</span>, decreasing deployment times by 65%.</span>
                                          <span className="inline-block bg-indigo-500/25 border border-indigo-400/30 text-indigo-300 px-1 py-0.2 rounded font-bold text-[5px] uppercase ml-1 relative -top-0.5 tracking-wider">Optimized ✨</span>
                                       </li>
                                       <li className="relative">
                                          <span className="absolute -left-2 top-1 w-0.5 h-0.5 bg-slate-600 rounded-full"></span>
                                          Mentored junior engineers and established internal conventions for the React component library used by over 50+ developers.
                                       </li>
                                    </ul>
                                 </div>
                                 
                                 <div className="mb-3">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                       <h3 className="text-[9px] font-bold text-slate-200">Vercel</h3>
                                       <span className="text-[7px] text-slate-500 font-mono font-semibold">2018 - 2021</span>
                                    </div>
                                    <p className="text-[8px] italic text-slate-400 mb-1.5">Frontend Software Engineer — San Francisco, CA</p>
                                    <ul className="space-y-1.5 text-[7px] text-slate-400 leading-normal ml-2 list-none">
                                       <li className="relative">
                                          <span className="absolute -left-2 top-1 w-0.5 h-0.5 bg-slate-600 rounded-full"></span>
                                          Co-developed core rendering optimizations for Next.js, reducing LCP latency by 24% across millions of sites.
                                       </li>
                                       <li className="relative">
                                          <span className="absolute -left-2 top-1 w-0.5 h-0.5 bg-slate-600 rounded-full"></span>
                                          Integrated Edge Middleware features, reducing dynamic routing latency to under 10ms.
                                       </li>
                                    </ul>
                                 </div>

                                 <div className="mb-3">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                       <h3 className="text-[9px] font-bold text-slate-200">Google</h3>
                                       <span className="text-[7px] text-slate-500 font-mono font-semibold">2017 - 2018</span>
                                    </div>
                                    <p className="text-[8px] italic text-slate-400 mb-1.5">Software Engineering Intern — Mountain View, CA</p>
                                    <ul className="space-y-1.5 text-[7px] text-slate-400 leading-normal ml-2 list-none">
                                       <li className="relative">
                                          <span className="absolute -left-2 top-1 w-0.5 h-0.5 bg-slate-600 rounded-full"></span>
                                          Optimized Android runtime compilation databases, achieving a 12% memory usage reduction.
                                       </li>
                                    </ul>
                                 </div>
                              </div>
                           </div>
                           
                           {/* Right Column */}
                           <div className="w-1/3 space-y-4">
                              <div>
                                 <h2 className="text-[9px] font-extrabold text-white uppercase tracking-widest border-b border-white/5 pb-1 mb-2">Skills</h2>
                                 <div className="flex flex-wrap gap-1 font-mono">
                                    <span className="px-1 py-0.5 bg-slate-900 text-slate-400 text-[6px] rounded border border-white/5 font-semibold">React.js</span>
                                    <span className="px-1 py-0.5 bg-slate-900 text-slate-400 text-[6px] rounded border border-white/5 font-semibold">TypeScript</span>
                                    <span className="px-1 py-0.5 bg-slate-900 text-slate-400 text-[6px] rounded border border-white/5 font-semibold">Node.js</span>
                                    <span className="px-1 py-0.5 bg-slate-900 text-slate-400 text-[6px] rounded border border-white/5 font-semibold">PostgreSQL</span>
                                    <span className="px-1 py-0.5 bg-indigo-950/50 border border-indigo-500/30 text-indigo-400 text-[6px] rounded font-bold">Docker</span>
                                    <span className="px-1 py-0.5 bg-indigo-950/50 border border-indigo-500/30 text-indigo-400 text-[6px] rounded font-bold">CI/CD Metrics</span>
                                 </div>
                              </div>
                              
                              <div>
                                 <h2 className="text-[9px] font-extrabold text-white uppercase tracking-widest border-b border-white/5 pb-1 mb-2">Education</h2>
                                 <div className="mb-2">
                                    <div className="text-[8px] font-bold text-slate-200 leading-tight">Univ. of California, Berkeley</div>
                                    <div className="text-[7px] text-slate-400 mt-0.5 font-medium">B.S. Computer Science</div>
                                    <div className="text-[6px] text-slate-500 font-mono mt-0.5 uppercase tracking-widest font-bold">2014 - 2018</div>
                                 </div>
                              </div>

                              <div>
                                 <h2 className="text-[9px] font-extrabold text-white uppercase tracking-widest border-b border-white/5 pb-1 mb-2">Certifications</h2>
                                 <div className="space-y-1 text-slate-400 text-[6px] leading-normal font-mono font-medium mb-3">
                                    <div>• AWS Solutions Architect</div>
                                    <div>• Google Cloud DevOps</div>
                                 </div>
                              </div>

                              <div>
                                 <h2 className="text-[9px] font-extrabold text-white uppercase tracking-widest border-b border-white/5 pb-1 mb-2">Projects</h2>
                                 <div className="space-y-2 text-slate-400 text-[5.5px] leading-normal font-mono font-medium">
                                    <div>
                                       <span className="font-bold text-slate-200">OpenSaaS Editor</span>: Built a headless Markdown compiler with 12k GitHub stars.
                                    </div>
                                    <div>
                                       <span className="font-bold text-slate-200">MockData Engine</span>: Local development seeding utility downloaded 100k+ times.
                                    </div>
                                 </div>
                              </div>
                           </div>
                           
                        </div>

                        {/* Scanning overlay effect */}
                        <motion.div 
                          initial={{ top: -50, opacity: 0 }}
                          animate={{ top: '120%', opacity: [0, 1, 1, 0] }}
                          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                          className="absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-indigo-500/10 to-indigo-500/35 z-10 pointer-events-none border-b border-indigo-500"
                        ></motion.div>
                        
                    </div>
                </div>

             </div>
          </motion.div>
        
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-slate-950/40 border-y border-white/5 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.25em] mb-10 font-mono">Trusted by candidates hired at</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-30 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-500">
            <span className="text-xl sm:text-2xl font-black font-sans tracking-tighter text-white">GOOGLE</span>
            <span className="text-xl sm:text-2xl font-black font-sans tracking-tighter text-white">MICROSOFT</span>
            <span className="text-xl sm:text-2xl font-black font-sans tracking-tighter text-white">STRIPE</span>
            <span className="text-xl sm:text-2xl font-black font-sans tracking-tighter text-white">META</span>
            <span className="text-xl sm:text-2xl font-black font-sans tracking-tighter text-white">NETFLIX</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 bg-[#030712] border-b border-white/5 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl mb-20 text-center">
           <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">Built for precision.</h2>
           <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">Everything you need to circumvent the ATS black hole and land in the right inbox.</p>
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
      <section className="py-28 bg-slate-950/20 border-b border-white/5 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-20">
             <div className="inline-flex items-center gap-2.5 px-3.5 py-1 bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest mb-6 rounded-full font-mono">
               Transparent Architecture
             </div>
             <h2 className="text-4xl font-extrabold mb-6 text-white tracking-tight">Built with Absolute Transparency</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
             <div className="p-8 bg-[#0b0f19]/40 border border-white/5 rounded-2xl shadow-xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-md">
               <CheckCircle2 className="w-10 h-10 text-indigo-400 mb-6" />
               <h3 className="font-bold text-lg mb-3 text-white">Simulated Parser Logic</h3>
               <p className="text-sm text-slate-400 leading-relaxed font-medium">We don't use arbitrary algorithms. We parse your PDF exactly how Workday and Taleo do.</p>
             </div>
             <div className="p-8 bg-[#0b0f19]/40 border border-white/5 rounded-2xl shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group backdrop-blur-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <FileSearch className="w-10 h-10 text-indigo-400 mb-6" />
                <h3 className="font-bold text-lg mb-3 text-white"><Link to="/seo/resume-score-python-developer" className="hover:text-indigo-400 transition-colors">View Sample Reports</Link></h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">See exactly what recruiters see before you hit submit. No hidden scores, absolute transparency.</p>
             </div>
             <div className="p-8 bg-[#0b0f19]/40 border border-white/5 rounded-2xl shadow-xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-md">
               <Target className="w-10 h-10 text-indigo-400 mb-6" />
               <h3 className="font-bold text-lg mb-3 text-white">Real Keyword Extraction</h3>
               <p className="text-sm text-slate-400 leading-relaxed font-medium">Our semantic engine matches contextual usage, not just keyword stuffing.</p>
             </div>
          </div>
        </div>
      </section>
      
      {/* Cover Letters Section */}
      <section className="py-28 bg-[#030712] border-b border-white/5 relative z-10" id="cover-letters">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">Cover Letters for Every Role</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 font-medium">Browse hundreds of specialized cover letter templates crafted for your specific industry. Includes Professional, Creative, and Modern variations.</p>
            
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search by role (e.g., Software Engineer)" 
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xl text-sm bg-slate-950/80 text-white placeholder:text-slate-500"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>

          {!isSearching && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {categorizedCoverLetters.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCategoryChange(cat.category)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeCategory === cat.category 
                      ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-500/30' 
                      : 'bg-slate-900 text-slate-400 border border-white/5 hover:bg-slate-800'
                  }`}
                >
                  {cat.category} <span className="opacity-60 font-semibold ml-1">({cat.items.length})</span>
                </button>
              ))}
            </div>
          )}

          <div className="bg-[#0b0f19]/40 p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {displayedTemplates.length > 0 ? (
                  displayedTemplates.map((template) => (
                    <motion.div
                      key={template}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link 
                        to={`/cover-letters/${slugify(template)}`} 
                        className="p-4 rounded-xl border border-white/5 bg-slate-900/30 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all flex items-center gap-3.5 group text-left h-full cursor-pointer relative"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                            {template.length % 3 === 0 ? (
                              <span className="px-1.5 py-0.2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[6px] font-mono uppercase font-bold rounded">
                                Most Used
                              </span>
                            ) : template.length % 3 === 1 ? (
                              <span className="px-1.5 py-0.2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[6px] font-mono uppercase font-bold rounded">
                                Top Ranked
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[6px] font-mono uppercase font-bold rounded">
                                ATS Approved
                              </span>
                            )}
                            <span className="px-1.5 py-0.2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[6px] font-mono uppercase font-bold rounded">
                              {95 + (template.length % 5)}% ATS
                            </span>
                            <span className="text-[7px] text-slate-500 font-mono tracking-normal lowercase">{(((template.charCodeAt(0) || 0) * 7 + template.length) % 15 + 3)}k scans</span>
                          </div>
                          <span className="block text-xs font-bold text-slate-300 group-hover:text-white transition-colors truncate" title={template}>{template}</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center text-slate-500 font-bold w-full">
                    No cover letters found matching "{searchTerm}".
                  </div>
                )}
              </AnimatePresence>
            </div>

            {filteredTemplates.length > 12 && (
              <div className="flex justify-center mt-10">
                <Button 
                  onClick={() => setShowAllTemplates(!showAllTemplates)}
                  className="px-6 h-11 border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all rounded-xl cursor-pointer"
                >
                  {showAllTemplates ? 'Show Less' : `Show All ${filteredTemplates.length} Templates`}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-[#030712] relative overflow-hidden">
         <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/5 text-white text-[10px] font-bold uppercase tracking-widest mb-6 rounded-full border border-white/10 font-mono">
               Get Started Today
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white leading-none">Ready to optimize your career?</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-medium">Join thousands of professionals landing their dream roles with AI-powered resume optimization. Instantly adapt to any job description.</p>
            <Link to="/app">
               <Button size="lg" className="h-14 px-10 bg-white text-black hover:bg-slate-100 hover:text-black font-bold uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-transform duration-300">
                 START FREE OPTIMIZATION
               </Button>
            </Link>
         </div>
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/15 via-[#030712] to-[#030712] opacity-80 pointer-events-none"></div>
      </section>
    </div>
  );
}

function FeatureCard({ index, title, description }: { index: string, title: string, description: string }) {
  return (
    <div className="p-8 flex flex-col justify-start bg-[#0b0f19]/35 border border-white/5 rounded-2xl shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-white/10 transition-all duration-300 backdrop-blur-md">
      <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 rounded-xl shadow-md font-mono">
        <span className="text-xs font-bold tracking-wider">{index}</span>
      </div>
      <h3 className="font-bold text-lg mb-3 text-white">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed font-medium">{description}</p>
    </div>
  );
}

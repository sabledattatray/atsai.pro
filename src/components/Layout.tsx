import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Briefcase, FileText, User, LayoutDashboard, Menu, X, ChevronDown, Sparkles, Github, Linkedin, Twitter, Globe, Terminal, Cpu, Database, Activity, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Logo } from './Logo';
import { categorizedCoverLetters, slugify } from '../data/coverLetters';

const CoverLettersMenu = () => (
  <div className="relative group/cl h-full flex items-center">
    <div className="text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 h-full font-semibold">
      Cover Letters <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover/cl:rotate-180 transition-transform duration-300" />
    </div>
    
    {/* Outer container to position the dropdown. No margin, uses padding-top to bridge hover region */}
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] pt-3 opacity-0 invisible group-hover/cl:opacity-100 group-hover/cl:visible transition-all duration-300 pointer-events-none group-hover/cl:pointer-events-auto z-50">
      {/* Inner visual box */}
      <div className="bg-[#070b14]/98 backdrop-blur-2xl border border-white/5 shadow-[0_30px_70px_rgba(0,0,0,0.8)] rounded-2xl p-6">
        <div className="grid grid-cols-12 gap-8">
          
          {/* Left Side: Dynamic Categories (8 cols) */}
          <div className="col-span-8 grid grid-cols-3 gap-6 pr-6 border-r border-white/5">
            {categorizedCoverLetters.slice(0, 9).map((cat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="text-[8px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 px-2 py-0.5 rounded-md w-fit uppercase tracking-widest font-mono mb-2">
                  {cat.category}
                </div>
                <ul className="flex flex-col gap-1.5 normal-case tracking-normal">
                  {cat.items.slice(0, 3).map(item => (
                    <li key={item} className="group/item">
                      <Link 
                        to={`/cover-letters/${slugify(item)}`} 
                        className="flex items-center justify-between text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/[0.02] -mx-1 transition-all duration-200"
                      >
                        <span className="text-[11px] font-medium truncate max-w-[150px]">{item}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-indigo-500/0 group-hover/item:text-indigo-400 group-hover/item:translate-x-0.5 transition-all duration-200" />
                      </Link>
                    </li>
                  ))}
                  {cat.items.length > 3 && (
                    <li>
                      <a href="/#cover-letters" className="text-slate-500 hover:text-indigo-400 hover:underline text-[9px] font-semibold block pl-1 mt-0.5">
                        + {cat.items.length - 3} more roles
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>

          {/* Right Side: Featured Spotlight Box (4 cols) */}
          <div className="col-span-4 flex flex-col justify-between h-full space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 shadow-inner relative overflow-hidden group/box">
              {/* Ambient subtle glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none group-hover/box:bg-indigo-500/20 transition-all"></div>
              
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[8px] uppercase tracking-widest font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">Featured Engine</span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              </div>
              
              <h5 className="text-[12px] font-bold text-white mb-1 tracking-tight">AI Cover Letter Writer</h5>
              <p className="text-[10px] text-slate-400 leading-normal normal-case tracking-normal font-medium mb-3">
                Craft role-specific cover letters tailored directly to a target job description and your resume achievements.
              </p>
              
              {/* Visual Mini Mockup */}
              <div className="bg-slate-950 p-2.5 rounded-lg border border-white/5 font-mono text-[7px] text-slate-500 space-y-1 select-none">
                <div className="flex justify-between text-slate-400 font-bold border-b border-white/5 pb-1">
                  <span>SYSTEM_PROMPT</span>
                  <span className="text-emerald-400">active</span>
                </div>
                <div>Dear Hiring Team,</div>
                <div className="truncate text-slate-400 font-semibold">I am excited to apply for the role...</div>
                <div className="flex justify-between text-[6px] pt-1">
                  <span>Format: Professional</span>
                  <span className="text-indigo-400">✨ Gemini Optimized</span>
                </div>
              </div>
            </div>
            
            <Link to="/cover-letter-builder" className="w-full">
              <Button size="sm" className="w-full text-[9px] font-bold tracking-widest uppercase h-9 bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                Build Cover Letter
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  </div>
);

const groupedResumes = [
  {
    category: 'Software & Tech',
    items: [
      { name: 'Software Engineer Minimalist', desc: 'Sleek, ATS-optimized layout', url: '/editor?template=tech&role=Software%20Engineer', badge: 'Most Used' },
      { name: 'Data Scientist Standard', desc: 'Math & research focused', url: '/editor?template=tech&role=Data%20Scientist' },
      { name: 'Ultra Minimal', desc: 'High-density pure text layout', url: '/editor?template=minimalist&role=Software%20Engineer', badge: '99% ATS' },
      { name: 'Startup Pitch', desc: 'Modern typography & highlights', url: '/editor?template=startup&role=Software%20Engineer' },
    ]
  },
  {
    category: 'Management & Sales',
    items: [
      { name: 'The PM Executive', desc: 'Metrics & impact focused', url: '/editor?template=executive&role=Product%20Manager', badge: 'Top Ranked' },
      { name: 'Sales Professional', desc: 'Deals & relationship records', url: '/editor?template=business&role=Sales' },
      { name: 'Bold Leadership', desc: 'Highlighting vision & growth', url: '/editor?template=bold&role=Product%20Manager', badge: '98% ATS' },
      { name: 'Accounting Corporate', desc: 'Finance & compliance structured', url: '/editor?template=executive&role=Accounting' },
    ]
  },
  {
    category: 'Creative & Design',
    items: [
      { name: 'Creative Designer', desc: 'Asymmetrical modern grids', url: '/editor?template=modern&role=Designer', badge: 'Most Used' },
      { name: 'Creative Vibrant', desc: 'Splashes of curated colors', url: '/editor?template=creative&role=Designer' },
      { name: 'Marketing Strategist', desc: 'Channels & analytics showcase', url: '/editor?template=business&role=Marketing' },
      { name: 'Infographic Timeline', desc: 'Visual timeline structure', url: '/editor?template=infographic&role=Marketing' },
    ]
  },
  {
    category: 'Engineering & Education',
    items: [
      { name: 'Engineering Pro', desc: 'Math, hardware, & tools list', url: '/editor?template=modern&role=Engineer', badge: '99% ATS' },
      { name: 'Educator Template', desc: 'Lesson plans & credentials', url: '/editor?template=executive&role=Teacher' },
      { name: 'Academic Serif', desc: 'Traditional publications & history', url: '/editor?template=academic&role=Teacher' },
    ]
  },
  {
    category: 'Entry Level / Freshers',
    items: [
      { name: 'Fresher Minimal', desc: 'Education & projects priority', url: '/editor?template=minimalist&role=Fresher', badge: 'Most Used' },
      { name: 'Fresher Modern', desc: 'Projects & quick summary focus', url: '/editor?template=modern&role=Fresher' },
      { name: 'Fresher Clean', desc: 'Compact two-column clean grid', url: '/editor?template=executive&role=Fresher' },
    ]
  }
];

const ResumesMenu = () => (
  <div className="relative group/res h-full flex items-center">
    <div className="text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 h-full font-semibold">
      Resumes <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover/res:rotate-180 transition-transform duration-300" />
    </div>
    
    {/* Outer container to position the dropdown. No margin, uses padding-top to bridge hover region */}
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] pt-3 opacity-0 invisible group-hover/res:opacity-100 group-hover/res:visible transition-all duration-300 pointer-events-none group-hover/res:pointer-events-auto z-50">
      {/* Inner visual box */}
      <div className="bg-[#070b14]/98 backdrop-blur-2xl border border-white/5 shadow-[0_30px_70px_rgba(0,0,0,0.8)] rounded-2xl p-6">
        <div className="grid grid-cols-12 gap-8">
          
          {/* Left Side: Template categories (8 cols) */}
          <div className="col-span-8 grid grid-cols-3 gap-6 pr-6 border-r border-white/5">
            {groupedResumes.slice(0, 3).map((cat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="text-[8px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 px-2 py-0.5 rounded-md w-fit uppercase tracking-widest font-mono mb-2">
                  {cat.category}
                </div>
                <ul className="flex flex-col gap-1.5 normal-case tracking-normal">
                  {cat.items.map(item => (
                    <li key={item.name} className="group/item">
                      <Link 
                        to={item.url} 
                        className="flex flex-col justify-start text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.02] -mx-1.5 border border-transparent hover:border-white/5 transition-all duration-200 text-left"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold tracking-tight text-slate-200 group-hover/item:text-indigo-400 transition-colors">{item.name}</span>
                          {item.badge && (
                            <span className={`px-1 py-0.2 rounded font-mono text-[5px] uppercase font-bold tracking-wider shrink-0 ${
                              item.badge === 'Most Used' 
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm' 
                                : item.badge === 'Top Ranked' 
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm' 
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] text-slate-500 font-medium tracking-normal mt-0.5 leading-tight">{item.desc}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {/* Bottom row of categories */}
            <div className="col-span-3 grid grid-cols-2 gap-6 mt-4 pt-4 border-t border-white/5">
              {groupedResumes.slice(3, 5).map((cat, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="text-[8px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 px-2 py-0.5 rounded-md w-fit uppercase tracking-widest font-mono mb-2">
                    {cat.category}
                  </div>
                  <ul className="flex flex-col gap-1.5 normal-case tracking-normal">
                    {cat.items.slice(0, 2).map(item => (
                      <li key={item.name} className="group/item">
                        <Link 
                          to={item.url} 
                          className="flex items-center justify-between text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/[0.01] -mx-1 transition-all duration-200 text-left"
                        >
                          <span className="text-[10px] font-bold tracking-tight text-slate-300 truncate">{item.name}</span>
                          {item.badge && (
                            <span className="px-1 py-0.2 rounded font-mono text-[5px] uppercase font-bold tracking-wider shrink-0 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Pro Studio Card (4 cols) */}
          <div className="col-span-4 flex flex-col justify-between h-full space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 shadow-inner relative overflow-hidden group/box">
              {/* Ambient subtle glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none group-hover/box:bg-purple-500/20 transition-all"></div>
              
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[8px] uppercase tracking-widest font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded">Builder Studio</span>
                <Cpu className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              </div>
              
              <h5 className="text-[12px] font-bold text-white mb-1 tracking-tight">AI Resume Studio</h5>
              <p className="text-[10px] text-slate-400 leading-normal normal-case tracking-normal font-medium mb-3">
                Generate full-text achievements formatted with recruiter-vetted structures and real-time score auditing.
              </p>
              
              {/* Visual Score Card */}
              <div className="bg-slate-950 p-2.5 rounded-lg border border-white/5 flex items-center justify-between font-mono text-[7px] text-slate-500 select-none">
                <div>
                  <div className="text-slate-400 font-bold">ATS COMPATIBILITY</div>
                  <div className="text-emerald-400 font-bold text-[10px] mt-0.5">98% Passed</div>
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-[8px]">
                  98
                </div>
              </div>
            </div>
            
            <Link to="/templates" className="w-full">
              <Button size="sm" className="w-full text-[9px] font-bold tracking-widest uppercase h-9 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                Browse All Templates
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  </div>
);

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const [consoleInput, setConsoleInput] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    'System ready.',
    'Gemini AI Core: Online',
    'Type /help for telemetry commands.'
  ]);

  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = consoleInput.trim().toLowerCase();
    if (!cmd) return;

    let response = '';
    if (cmd === '/help') {
      response = 'Commands: /status, /stack, /about, /ping, /clear';
    } else if (cmd === '/status') {
      response = 'STATUS: Active | Build: stable-2.4.1 | API: operational';
    } else if (cmd === '/stack') {
      response = 'STACK: React, TypeScript, Tailwind v4, Google Gemini, Vite';
    } else if (cmd === '/about') {
      response = 'DEV: Datta Sable (AI Architect & Full Stack Developer)';
    } else if (cmd === '/ping') {
      response = `PONG: ${Math.floor(Math.random() * 25) + 35}ms latency`;
    } else if (cmd === '/clear') {
      setConsoleOutput([]);
      setConsoleInput('');
      return;
    } else {
      response = `Unknown cmd: "${cmd}". Type /help.`;
    }

    setConsoleOutput(prev => [...prev.slice(-3), `> ${consoleInput}`, response]);
    setConsoleInput('');
  };

  const publicRoutes = ['/', '/pricing', '/features', '/templates', '/cover-letter-builder', '/linkedin-optimizer', '/career-hub', '/interview-guides', '/about', '/privacy-policy', '/terms-of-service', '/signin'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] font-sans text-slate-100">
      <header className="h-20 w-full flex items-center justify-center border-b border-white/5 bg-[#030712]/75 backdrop-blur-md sticky top-0 z-50 print:hidden relative px-4 md:px-12">
        <div className="container mx-auto h-full flex items-center justify-between">
          <Link to="/" className="flex items-center text-white z-50">
            <Logo invertText={true} />
          </Link>
          
          <nav className="hidden lg:flex items-center gap-10 h-full text-xs font-bold text-slate-300 uppercase tracking-widest">
            {isPublicRoute ? (
              <>
                <Link to="/features" className="hover:text-white transition-colors relative py-2 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-indigo-500 after:transition-all">Features</Link>
                <Link to="/pricing" className="hover:text-white transition-colors relative py-2 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-indigo-500 after:transition-all">Pricing</Link>
                <CoverLettersMenu />
                <ResumesMenu />
                <div className="h-4 w-px bg-white/10" />
                <Link to="/signin" className="hover:text-white transition-colors relative py-2 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-indigo-500 after:transition-all">Sign In</Link>
                <Link to="/app">
                  <Button className="font-bold tracking-widest uppercase text-[10px] px-6 h-10">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/app?reset=true" className="hover:text-white transition-colors flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-indigo-400" /> Dashboard
                </Link>
                <Link to="/app/analyze" className="hover:text-white transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" /> New Analysis
                </Link>
                <CoverLettersMenu />
                <ResumesMenu />
                <Link to="/career-hub" className="hover:text-white transition-colors flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Career Pathways
                </Link>
                <div className="h-4 w-px bg-white/10" />
                <button className="flex items-center gap-2 hover:opacity-85 cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-extrabold text-xs uppercase shadow-md shadow-indigo-500/25">
                    ME
                  </div>
                </button>
              </>
            )}
          </nav>
          
          <button 
            className="lg:hidden p-2 text-white z-50 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#030712]/95 backdrop-blur-lg flex flex-col pt-24 px-6 pb-6 lg:hidden overflow-y-auto">
          <nav className="flex flex-col gap-6 text-xl font-extrabold text-white uppercase tracking-tight">
            {isPublicRoute ? (
              <>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-white/5 pb-4">Home</Link>
                <Link to="/features" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-white/5 pb-4">Features</Link>
                <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-white/5 pb-4">Pricing</Link>
                <a href="/#cover-letters" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-white/5 pb-4">Cover Letters</a>
                <Link to="/templates" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-white/5 pb-4">Resumes</Link>
                <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-white/5 pb-4">Sign In</Link>
                <Link to="/app" onClick={() => setIsMobileMenuOpen(false)} className="mt-4">
                  <Button size="lg" className="w-full text-xs tracking-wider">GET STARTED FREE</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/app?reset=true" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-white/5 pb-4 flex items-center gap-3">
                  <LayoutDashboard className="w-6 h-6 text-indigo-400" /> Dashboard
                </Link>
                <Link to="/app/analyze" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-white/5 pb-4 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-indigo-400" /> New Analysis
                </Link>
                <a href="/#cover-letters" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-white/5 pb-4 flex items-center gap-3">
                  Cover Letters
                </a>
                <Link to="/templates" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-white/5 pb-4 flex items-center gap-3">
                  Resumes
                </Link>
                <Link to="/career-hub" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-white/5 pb-4 flex items-center gap-3">
                  Career Pathways
                </Link>
              </>
            )}
          </nav>
        </div>
      )}

      <main className="flex-1 w-full flex flex-col bg-[#030712]">
        <Outlet />
      </main>
      
      {isPublicRoute && location.pathname !== '/signin' && (
        <footer className="relative bg-slate-950 border-t border-white/5 pt-20 pb-12 px-6 md:px-12 text-[10px] font-bold uppercase tracking-widest text-slate-400 overflow-hidden">
          {/* Subtle Background Glow behind footer */}
          <div className="absolute -bottom-1/2 left-1/3 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
          
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10 mb-16">
            {/* Column 1: Brand & Architect Bio (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <Link to="/" className="inline-block">
                <Logo invertText={true} />
              </Link>
              <p className="text-xs leading-relaxed max-w-sm text-slate-400 normal-case tracking-normal font-medium">
                The world's fastest AI-powered ATS resume optimization platform. Engineered with precision for software developers and modern professionals.
              </p>
              
              {/* Creator Card */}
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl backdrop-blur-sm max-w-sm shadow-inner group hover:border-white/10 transition-all">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[14px] font-black tracking-tight shadow-md shadow-indigo-500/10">
                    DS
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white normal-case tracking-normal">
                      Built by <a href="https://dattasable.com" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline">Datta Sable</a>
                    </div>
                    <div className="text-[9px] text-slate-500 normal-case tracking-normal font-medium">AI Architect &amp; SaaS Builder</div>
                  </div>
                </div>
                
                {/* Social icons */}
                <div className="flex gap-3 mt-3">
                  <a href="https://github.com/dattasable" target="_blank" rel="noreferrer" className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/5" title="GitHub">
                    <Github className="w-3.5 h-3.5" />
                  </a>
                  <a href="https://linkedin.com/in/dattasable" target="_blank" rel="noreferrer" className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-all border border-white/5" title="LinkedIn">
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                  <a href="https://twitter.com/dattasable" target="_blank" rel="noreferrer" className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-sky-400 transition-all border border-white/5" title="Twitter">
                    <Twitter className="w-3.5 h-3.5" />
                  </a>
                  <a href="https://dattasable.com" target="_blank" rel="noreferrer" className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-all border border-white/5" title="Portfolio">
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Platform Links (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-white text-xs font-bold tracking-wider flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Platform
              </h4>
              <ul className="space-y-2.5 text-slate-400">
                <li><Link to="/features" className="hover:text-white transition-colors normal-case tracking-normal font-medium">Feature Tour</Link></li>
                <li><Link to="/app" className="hover:text-white transition-colors normal-case tracking-normal font-medium">ATS Resume Checker</Link></li>
                <li><Link to="/cover-letter-builder" className="hover:text-white transition-colors normal-case tracking-normal font-medium">Cover Letter Builder</Link></li>
                <li><Link to="/linkedin-optimizer" className="hover:text-white transition-colors normal-case tracking-normal font-medium">LinkedIn Optimizer</Link></li>
              </ul>
            </div>

            {/* Column 3: Resources (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-white text-xs font-bold tracking-wider flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-indigo-400" /> Resources
              </h4>
              <ul className="space-y-2.5 text-slate-400">
                <li><Link to="/templates" className="hover:text-white transition-colors normal-case tracking-normal font-medium">Resume Templates</Link></li>
                <li><Link to="/career-hub" className="hover:text-white transition-colors normal-case tracking-normal font-medium">Career Hub</Link></li>
                <li><Link to="/interview-guides" className="hover:text-white transition-colors normal-case tracking-normal font-medium">Interview Guides</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors normal-case tracking-normal font-medium">Privacy Protocol</Link></li>
              </ul>
            </div>

            {/* Column 4: Interactive Developer Console (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <h4 className="text-white text-xs font-bold tracking-wider flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" /> System Terminal
              </h4>
              
              <div className="bg-slate-950/80 border border-white/5 rounded-xl overflow-hidden font-mono text-[9px] shadow-2xl relative">
                {/* Window header */}
                <div className="bg-slate-900 px-3 py-1.5 border-b border-white/5 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500/60"></span>
                    <span className="w-2 h-2 rounded-full bg-amber-500/60"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500/60"></span>
                  </div>
                  <span className="text-slate-500 font-semibold tracking-wider uppercase text-[7px]">console@dattasable.com</span>
                </div>
                
                {/* Console logs */}
                <div className="p-3 space-y-1.5 h-28 overflow-y-auto custom-scrollbar select-none text-slate-400">
                  {consoleOutput.map((log, idx) => (
                    <div key={idx} className={log.startsWith('>') ? 'text-indigo-400 font-semibold' : log.startsWith('STATUS') || log.startsWith('STACK') ? 'text-emerald-400' : 'text-slate-400'}>
                      {log}
                    </div>
                  ))}
                </div>
                
                {/* Input Prompt */}
                <form onSubmit={handleConsoleSubmit} className="border-t border-white/5 flex items-center bg-slate-900/40 p-2">
                  <span className="text-indigo-500 mr-1.5 font-bold animate-pulse">&gt;</span>
                  <input
                    type="text"
                    value={consoleInput}
                    onChange={(e) => setConsoleInput(e.target.value)}
                    placeholder="Type /help, /status, /stack..."
                    className="flex-1 bg-transparent text-slate-200 border-none outline-none focus:ring-0 focus:outline-none placeholder-slate-600 lowercase tracking-normal text-[9px]"
                  />
                  <button type="submit" className="text-indigo-400 hover:text-indigo-300 p-1 flex items-center">
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          {/* Bottom Metabar */}
          <div className="container mx-auto pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-[9px] relative z-10">
            <div className="flex items-center gap-6 flex-wrap justify-center md:justify-start">
              <span className="flex items-center gap-1.5 normal-case tracking-normal">
                <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                Telemetry: <span className="text-emerald-400 font-bold">100% operational</span>
              </span>
              <span>Node Latency: <span className="text-slate-400 font-mono">14ms (NY-Edge)</span></span>
              <span>Stack: <span className="text-slate-400">React 18 / Vite 6</span></span>
            </div>
            
            <div className="flex items-center gap-6 flex-wrap justify-center md:justify-end">
              <Link to="/terms-of-service" className="hover:text-slate-300 transition-colors normal-case tracking-normal">Terms of Service</Link>
              <span>&copy; {new Date().getFullYear()} Resume Copilot AI. All Rights Reserved.</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

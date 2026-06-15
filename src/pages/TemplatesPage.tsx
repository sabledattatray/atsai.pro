import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Sparkles, Server, FileCheck, CheckCircle2, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TechTemplate, ExecutiveTemplate, ModernTemplate, BusinessTemplate, CreativeTemplate, MinimalistTemplate, BoldTemplate, AcademicTemplate, StartupTemplate, InfographicTemplate } from './TemplateEditorPage';
import { dummyResumes } from '@/lib/dummyResumes';
import { useSEO } from '../utils/useSEO';

export default function TemplatesPage() {
  useSEO({
    title: 'ATS-Friendly Resume Templates - Resume Copilot AI',
    description: 'Get hired faster with recruiter-vetted, ATS-tested resume templates. 100% machine-readable formats optimized for Workday, Taleo, and Greenhouse parsers.',
    keywords: 'ats resume templates, recruiter vetted resume, resume layout templates, download free resume format, resume templates list',
    ogImage: 'https://cvwithcopilot.vercel.app/pricing_page.png'
  });

  const [activeCategory, setActiveCategory] = React.useState('All');
  const [previewTheme, setPreviewTheme] = React.useState<'light' | 'dark'>('light');
  
  const categories = ['All', 'Data Scientist', 'Product Manager', 'Software Engineer', 'Sales', 'Teacher', 'Engineer', 'Accounting', 'Designer', 'Marketing', 'Freshers'];
  
  const allTemplates = [
    { title: "Data Scientist Standard", desc: "Clean layout emphasizing tools and methodologies.", tags: ['Data', 'Analytical'], category: 'Data Scientist', id: 'tech', roleKey: 'Data Scientist', badge: 'Most Used' },
    { title: "The PM Executive", desc: "Structured formatting focusing on outcomes and leadership.", tags: ['Management', 'Strategy'], category: 'Product Manager', id: 'executive', roleKey: 'Product Manager', badge: 'Top Ranked' },
    { title: "Software Engineer Minimalist", desc: "Clean, single-column design perfect for tech roles.", tags: ['Code', 'Engineering'], category: 'Software Engineer', id: 'tech', roleKey: 'Software Engineer', badge: '99% ATS' },
    { title: "Sales Professional", desc: "Highlights metrics, quotas, and business achievements.", tags: ['Sales', 'Business'], category: 'Sales', id: 'business', roleKey: 'Sales' },
    { title: "Educator Template", desc: "Traditional formatting suitable for academic roles.", tags: ['Academic', 'Teaching'], category: 'Teacher', id: 'executive', roleKey: 'Teacher' },
    { title: "Engineering Pro", desc: "Technical layout for mechanical and civil engineers.", tags: ['Technical', 'CAD'], category: 'Engineer', id: 'modern', roleKey: 'Engineer', badge: '98% ATS' },
    { title: "Accounting Corporate", desc: "Conservative layout for finance professionals.", tags: ['Finance', 'Corporate'], category: 'Accounting', id: 'executive', roleKey: 'Accounting' },
    { title: "Creative Designer", desc: "Stylized layout for showcasing design expertise.", tags: ['Creative', 'UX/UI'], category: 'Designer', id: 'modern', roleKey: 'Designer', badge: 'Most Used' },
    { title: "Marketing Strategist", desc: "Modern structured layout for campaigns and KPIs.", tags: ['Strategy', 'Marketing'], category: 'Marketing', id: 'business', roleKey: 'Marketing' },
    { title: "Creative Vibrant", desc: "Vibrant, bold and highly visual.", tags: ['Visual', 'Creative'], category: 'Designer', id: 'creative', roleKey: 'Designer' },
    { title: "Ultra Minimal", desc: "Space and typography first.", tags: ['Clean', 'Minimal'], category: 'Software Engineer', id: 'minimalist', roleKey: 'Software Engineer' },
    { title: "Bold Leadership", desc: "Strong contrast and decisive layout.", tags: ['Bold', 'Leadership'], category: 'Product Manager', id: 'bold', roleKey: 'Product Manager' },
    { title: "Academic Serif", desc: "Traditional, scholarly structure.", tags: ['Academic', 'Classic'], category: 'Teacher', id: 'academic', roleKey: 'Teacher' },
    { title: "Startup Pitch", desc: "Edgy, vibrant, metrics-driven.", tags: ['Startup', 'Edgy'], category: 'Software Engineer', id: 'startup', roleKey: 'Software Engineer' },
    { title: "Infographic Timeline", desc: "Visual progression and stats focus.", tags: ['Visual', 'Stats'], category: 'Marketing', id: 'infographic', roleKey: 'Marketing' },
    { title: "Fresher Minimal", desc: "Clean layout, focuses on education and projects.", tags: ['Entry-Level', 'Clean'], category: 'Freshers', id: 'minimalist', roleKey: 'Fresher', badge: 'Most Used' },
    { title: "Fresher Modern", desc: "Two column design highlighting skills.", tags: ['Entry-Level', 'Modern'], category: 'Freshers', id: 'modern', roleKey: 'Fresher' },
    { title: "Fresher Clean", desc: "Structured formatting focusing on academics.", tags: ['Entry-Level', 'Classic'], category: 'Freshers', id: 'executive', roleKey: 'Fresher' },
  ];

  const filteredTemplates = activeCategory === 'All' 
    ? allTemplates 
    : allTemplates.filter(t => t.category === activeCategory);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="relative flex flex-col w-full min-h-[calc(100vh-80px)] bg-[#030712] text-slate-100 overflow-hidden">
      {/* Grid Overlay background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>

      {/* Ambient background glows */}
      <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Page Header */}
      <div className="relative z-10 border-b border-white/5 bg-[#030712]/30 backdrop-blur-md py-20 px-6">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-6 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.1)] backdrop-blur-md">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
            Recruiter Vetted
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            ATS-Tested <span className="text-gradient">Resume Templates</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium">
            Beautiful, minimalist templates rigorously tested against Workday, Taleo, and Greenhouse parsers. 100% machine-readable.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 py-16 flex flex-col lg:flex-row gap-12 relative z-10">
        
        {/* Sidebar Categories */}
        <div className="lg:w-64 shrink-0 flex flex-col gap-6">
          <div className="p-5 bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-sm shadow-xl">
            <h3 className="font-bold text-white mb-4 uppercase tracking-widest text-[10px] font-mono flex items-center gap-2 border-b border-white/5 pb-3">
              <Server className="w-3.5 h-3.5 text-indigo-400" /> Categories
            </h3>
            <div className="flex flex-col gap-1">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeCategory === cat 
                      ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-md' 
                      : 'text-slate-400 border border-transparent hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-5 bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border border-indigo-500/10 rounded-2xl text-slate-100 backdrop-blur-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
             
             <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-white mb-2 flex items-center gap-1.5">
               <FileCheck className="w-4 h-4 text-indigo-400" /> Audit Resume
             </h3>
             <p className="text-slate-400 text-xs mb-5 leading-relaxed font-medium">Test your current format against our parser to identify potential compatibility errors.</p>
             <Link to="/app">
               <Button className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-widest uppercase text-[10px] shadow-[0_0_20px_rgba(99,102,241,0.25)]">
                 Test My Resume
               </Button>
             </Link>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex justify-between items-center bg-slate-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-sm">
            <span className="text-xs font-bold text-slate-400 font-mono">
              SHOWING {filteredTemplates.length} TEMPLATE{filteredTemplates.length !== 1 ? 'S' : ''}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 font-mono mr-2">RESUME THEME:</span>
              <button
                onClick={() => setPreviewTheme('light')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                  previewTheme === 'light'
                    ? 'bg-white text-slate-900 shadow-md scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
              <button
                onClick={() => setPreviewTheme('dark')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                  previewTheme === 'dark'
                    ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
            </div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map(template => (
                <TemplateCard 
                  key={template.title}
                  title={template.title}
                  desc={template.desc}
                  tags={template.tags}
                  category={template.id}
                  roleKey={template.roleKey}
                  badge={template.badge}
                  variants={itemVariants}
                  theme={previewTheme}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function RealisticPreview({ category, roleKey, theme = 'light' }: { category: string, roleKey: string, theme?: 'light' | 'dark' }) {
  const scale = 180 / 794;
  const data = dummyResumes[roleKey] || dummyResumes['Software Engineer'];
  const renderTemplate = () => {
    switch (category) {
      case 'tech': return <TechTemplate data={data} color="indigo" spacingClass="space-y-4" paddingClass="p-10" theme={theme} />;
      case 'executive': return <ExecutiveTemplate data={data} color="slate" spacingClass="space-y-4" paddingClass="p-10" theme={theme} />;
      case 'modern': return <ModernTemplate data={data} color="teal" spacingClass="space-y-4" paddingClass="p-6" theme={theme} />;
      case 'business': return <BusinessTemplate data={data} color="blue" spacingClass="space-y-4" paddingClass="p-8" theme={theme} />;
      case 'creative': return <CreativeTemplate data={data} color="pink" spacingClass="space-y-4" paddingClass="p-10" theme={theme} />;
      case 'minimalist': return <MinimalistTemplate data={data} color="zinc" spacingClass="space-y-4" paddingClass="p-10" theme={theme} />;
      case 'bold': return <BoldTemplate data={data} color="rose" spacingClass="space-y-4" paddingClass="p-10" theme={theme} />;
      case 'academic': return <AcademicTemplate data={data} color="stone" spacingClass="space-y-4" paddingClass="p-10" theme={theme} />;
      case 'startup': return <StartupTemplate data={data} color="emerald" spacingClass="space-y-4" paddingClass="p-10" theme={theme} />;
      case 'infographic': return <InfographicTemplate data={data} color="orange" spacingClass="space-y-4" paddingClass="p-10" theme={theme} />;
      default: return <TechTemplate data={data} color="indigo" spacingClass="space-y-4" paddingClass="p-10" theme={theme} />;
    }
  };

  return (
    <div className={`w-[794px] h-[1123px] origin-top-left ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'} text-left overflow-hidden pointer-events-none`} style={{ transform: `scale(${scale})` }}>
      {renderTemplate()}
    </div>
  );
}

const TemplateCard: React.FC<{ 
  title: string; 
  desc: string; 
  tags: string[]; 
  category: string; 
  roleKey: string; 
  badge?: string; 
  variants: any; 
  theme: 'light' | 'dark';
}> = ({ title, desc, tags, category, roleKey, badge, variants, theme }) => {
  return (
    <motion.div 
      variants={variants}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-panel rounded-2xl border border-white/5 overflow-hidden shadow-xl hover:shadow-2xl hover:border-white/10 transition-all duration-300 group flex flex-col hover:-translate-y-1.5 bg-slate-900/10"
    >
      <div className="h-64 bg-slate-950/60 overflow-hidden relative border-b border-white/5 flex items-center justify-center p-4">
         {/* Intersecting lights background inside preview container */}
         <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>

         {/* Optional top-right score/rank badge */}
         {badge && (
           <div className={`absolute top-3 right-3 px-2 py-0.5 rounded font-mono text-[6px] uppercase font-bold tracking-wider border shadow-md z-20 ${
             badge === 'Most Used' 
               ? 'bg-indigo-500/25 border-indigo-400/30 text-indigo-300' 
               : badge === 'Top Ranked' 
                 ? 'bg-amber-500/25 border-amber-400/30 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)]' 
                 : 'bg-emerald-500/25 border-emerald-400/30 text-emerald-300'
           }`}>
             {badge}
           </div>
         )}

         {/* Page Visual mockup */}
         <div className={`w-[180px] h-[254px] ${theme === 'dark' ? 'bg-slate-950 border-white/5' : 'bg-white border-black/5'} shadow-xl rounded border overflow-hidden opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500 relative z-10`}>
           <RealisticPreview category={category} roleKey={roleKey} theme={theme} />
         </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
         <div className="flex flex-wrap gap-1.5 mb-4">
             {tags.map(t => (
                 <span key={t} className="text-[8px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 px-2.5 py-0.5 rounded uppercase tracking-wider font-mono">{t}</span>
             ))}
         </div>
         <h3 className="text-base font-bold text-white mb-2 tracking-tight group-hover:text-indigo-400 transition-colors">{title}</h3>
         <p className="text-slate-400 text-xs leading-relaxed mb-6 flex-1 font-medium">{desc}</p>
         
         <Link to={`/editor?template=${category}&role=${encodeURIComponent(roleKey)}&theme=${theme}`}>
           <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest h-9 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
             <Download className="w-3.5 h-3.5" /> Use Template
           </Button>
         </Link>
      </div>
    </motion.div>
  );
}

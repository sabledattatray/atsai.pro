import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';
import { useSEO } from '../utils/useSEO';

export default function SharedReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useSEO({
    title: report?.fileName ? `ATS Report: ${report.fileName} - Resume Copilot AI` : 'ATS Scan Report - Resume Copilot AI',
    description: 'View this verified ATS compatibility scan report. Discover semantic skills matching, experience alignment scores, and detailed priority diagnostics.',
    keywords: 'ats scan report, verified resume score, resume analysis matching, resume checker',
    ogImage: 'https://cvwithcopilot.vercel.app/landing_page.png'
  });

  useEffect(() => {
    fetch(`/api/share/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setReport(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load shared report');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#030712] text-slate-100 p-4 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-[30%] left-[30%] w-[300px] h-[300px] bg-rose-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 text-center">
          <h1 className="text-2xl font-black mb-4 text-white tracking-tight">Report Not Found</h1>
          <p className="text-slate-400 mb-8 max-w-sm font-medium">This shared ATS score may have expired or does not exist.</p>
          <Link to="/app">
             <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold">Analyze Your Own Resume</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden flex flex-col">
      {/* Dense Grid Background Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>

      {/* Ambient background glows */}
      <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-4xl w-full mx-auto py-24 px-6 relative z-10 flex-1 flex flex-col justify-center">
         <div className="text-center">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-6 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.1)] backdrop-blur-md">
               <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
               Verified ATS Scan Report
           </div>
           <h1 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight text-white leading-tight">
              {report.fileName ? (
                <>
                  {report.fileName.replace(/\.[^/.]+$/, "")} scored <span className="text-gradient">{report.atsScore}%</span>
                </>
              ) : (
                <>
                  Resume scored <span className="text-gradient">{report.atsScore}%</span>
                </>
              )}
           </h1>
           <p className="text-slate-400 font-medium text-base md:text-lg mb-12">Scored by Resume Copilot Simulation Engine</p>
         </div>
         
         <div className="bg-[#0b0f19]/40 p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/5 flex flex-col md:flex-row items-center gap-12 text-left relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
            
            <div className="flex-shrink-0 flex flex-col justify-center items-center relative z-10 w-full md:w-auto px-6">
               <div className={`text-8xl font-black tracking-tighter ${report.atsScore >= 80 ? 'text-emerald-450' : report.atsScore >= 60 ? 'text-amber-450' : 'text-rose-450'} mb-2 font-mono`}>
                   {report.atsScore}
               </div>
               <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 font-mono">Match Score</div>
            </div>
            
            <div className="flex-1 space-y-6 w-full relative z-10">
               <div>
                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2 text-slate-400 font-mono">Skills Map Match <span className="text-white font-sans">{report.matchBreakdown?.skillsMatch || 0}%</span></div>
                 <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                     <div className="h-full bg-indigo-500 rounded-full" style={{width: `${report.matchBreakdown?.skillsMatch || 0}%`}}></div>
                 </div>
               </div>
               <div>
                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2 text-slate-400 font-mono">Experience Alignment <span className="text-white font-sans">{report.matchBreakdown?.experienceMatch || 0}%</span></div>
                 <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                     <div className="h-full bg-amber-500 rounded-full" style={{width: `${report.matchBreakdown?.experienceMatch || 0}%`}}></div>
                 </div>
               </div>
               
               {report.resumeStrengths?.length > 0 && (
                   <div className="pt-4 border-t border-white/5">
                       <h3 className="text-[10px] uppercase font-bold text-slate-500 font-mono mb-2 tracking-wider">Key Strengths</h3>
                       <p className="text-sm font-medium text-slate-300 line-clamp-2 leading-relaxed">{report.resumeStrengths[0]}</p>
                   </div>
               )}
            </div>
         </div>

         <div className="mt-20 bg-slate-900/30 border border-white/5 p-12 rounded-3xl shadow-2xl text-center backdrop-blur-md relative overflow-hidden group hover:border-white/10 transition-colors duration-300">
            {/* Inner Grid Light Overlay */}
            <div className="absolute inset-0 z-0 opacity-10 bg-grid-pattern pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>
            
            <div className="relative z-10">
                <h2 className="text-3xl font-extrabold mb-4 tracking-tight text-white">Curious about your own score?</h2>
                <p className="text-slate-400 mb-10 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium">Get Enterprise ATS parser feedback, semantic keyword gap analysis, and AI-powered bullet rewrites to beat the algorithms.</p>
                <Link to="/app">
                  <Button size="lg" className="bg-white text-[#030712] hover:bg-slate-200 h-14 px-8 text-base shadow-xl rounded-full font-bold uppercase tracking-wider">
                      Analyze Your Resume <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <p className="mt-6 text-[10px] text-slate-500 uppercase tracking-widest font-bold font-mono">Includes 3 free AI comparisons • No credit card required</p>
            </div>
         </div>
      </div>
    </div>
  );
}

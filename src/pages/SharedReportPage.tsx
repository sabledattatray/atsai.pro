import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';

export default function SharedReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h1 className="text-2xl font-bold mb-4 text-black">Report Not Found</h1>
        <p className="text-gray-500 mb-8">This shared ATS score may have expired or does not exist.</p>
        <Link to="/app">
           <Button>Analyze Your Own Resume</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
         <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 border border-indigo-100 shadow-sm">
             Verified ATS Scan Report
         </div>
         <h1 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight text-slate-900 leading-tight">
            {report.fileName ? `${report.fileName} scored ${report.atsScore}%` : `Resume scored ${report.atsScore}%`}
         </h1>
         <p className="text-gray-500 font-medium text-lg mb-12">Scored by Resume Copilot Simulation Engine</p>
         
         <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 flex flex-col md:flex-row items-center gap-12 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
            
            <div className="flex-1 flex flex-col justify-center items-center relative z-10 w-full md:w-auto">
               <div className={`text-8xl font-black tracking-tighter ${report.atsScore >= 80 ? 'text-emerald-600' : report.atsScore >= 60 ? 'text-amber-500' : 'text-rose-500'} mb-2`}>
                   {report.atsScore}
               </div>
               <div className="text-xs uppercase tracking-widest font-bold text-gray-400">Match Score</div>
            </div>
            
            <div className="flex-1 space-y-6 w-full relative z-10">
               <div>
                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Skills Map Match <span className="text-black">{report.matchBreakdown?.skillsMatch || 0}%</span></div>
                 <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500 rounded-full" style={{width: `${report.matchBreakdown?.skillsMatch || 0}%`}}></div>
                 </div>
               </div>
               <div>
                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Experience Alignment <span className="text-black">{report.matchBreakdown?.experienceMatch || 0}%</span></div>
                 <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                     <div className="h-full bg-amber-500 rounded-full" style={{width: `${report.matchBreakdown?.experienceMatch || 0}%`}}></div>
                 </div>
               </div>
               
               {report.resumeStrengths?.length > 0 && (
                   <div className="pt-4 border-t border-gray-100">
                       <h3 className="text-[10px] uppercase font-bold text-gray-400 mb-2">Key Strengths</h3>
                       <p className="text-sm font-medium text-gray-700 line-clamp-2">{report.resumeStrengths[0]}</p>
                   </div>
               )}
            </div>
         </div>

         <div className="mt-20 bg-gradient-to-br from-gray-900 to-black p-12 rounded-3xl shadow-2xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="relative z-10">
                <h2 className="text-3xl font-extrabold mb-4 tracking-tight">Curious about your own score?</h2>
                <p className="text-gray-400 mb-10 max-w-xl mx-auto font-medium">Get Enterprise ATS parser feedback, semantic keyword gap analysis, and AI-powered bullet rewrites to beat the algorithms.</p>
                <Link to="/app">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100 h-14 px-8 text-base shadow-xl rounded-full">
                    Analyze Your Resume <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                </Link>
                <p className="mt-6 text-[10px] text-gray-500 uppercase tracking-widest font-bold">Includes 3 free AI comparisons • No credit card required</p>
            </div>
         </div>
      </div>
    </div>
  );
}

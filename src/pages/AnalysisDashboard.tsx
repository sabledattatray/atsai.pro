import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, Loader2, Download, History, ChevronRight, Eye, Search, Maximize2, Server, Terminal, Command, Zap, Plus, X, Lock, Share2, Users, LayoutDashboard, Target, TrendingUp, TrendingDown, Sparkles, BarChart2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

declare global {
  interface Window {
    Razorpay: any;
  }
}

type AnalysisState = 'IDLE' | 'UPLOADING' | 'PARSING' | 'ANALYZING' | 'COMPLETE';

interface TimelineEvent {
  time: string;
  label: string;
  status: 'pending' | 'active' | 'done';
}

export default function AnalysisDashboard() {
  const [status, setStatus] = useState<AnalysisState>('IDLE');
  const [jobDescription, setJobDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [activeResultIdx, setActiveResultIdx] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<{ id: number, score: number, date: string }[]>([]);
  const [showCmd, setShowCmd] = useState(false);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [credits, setCredits] = useState(3);
  const [showPaywall, setShowPaywall] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/app/analyze' || location.pathname === '/app') {
      setStatus('IDLE');
      setJobDescription('');
      setFiles([]);
      setResults([]);
      setErrorMsg(null);
    }
  }, [location.pathname]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('atsHistory');
    if (savedHistory) {
      try { 
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        } else {
          setHistory([]);
        }
      } catch (e) {
        setHistory([]);
      }
    }
    const savedCredits = localStorage.getItem('atsCredits');
    if (savedCredits !== null) {
      const parsedCredits = parseInt(savedCredits, 10);
      if (!isNaN(parsedCredits)) {
        setCredits(parsedCredits);
      }
    }

    // Handle Stripe redirect parameters
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_success')) {
        setCredits(prev => {
            const newCredits = prev + 10;
            localStorage.setItem('atsCredits', newCredits.toString());
            return newCredits;
        });
        // cleanup url
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCmd(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowCmd(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (files.length >= 3) return; // limit to 3
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles].slice(0, 3));
      setErrorMsg(null);
    }
  };

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  }

  const saveToHistory = (score: number) => {
    const newEntry = { id: Date.now(), score, date: new Date().toLocaleDateString() };
    const updatedHistory = [newEntry, ...history].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem('atsHistory', JSON.stringify(updatedHistory));
  };

  const getTimeNode = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  const handleCheckout = async (plan: 'basic' | 'pro') => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, mock: false })
      });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      
      if (data.orderId) {
        const options = {
            key: data.keyId,
            amount: data.amount,
            currency: data.currency,
            name: "Resume Copilot",
            description: plan === 'pro' ? "Unlimited Scans" : "10 Premium Scans",
            order_id: data.orderId,
            handler: async function (response: any) {
                try {
                  const verifyRes = await fetch('/api/verify-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_signature: response.razorpay_signature
                    })
                  });
                  const verifyData = await verifyRes.json();
                  if (verifyData.success) {
                    window.location.href = '/app?payment_success=true';
                  } else {
                    alert('Payment verification failed.');
                  }
                } catch (err) {
                  alert('Payment verification error.');
                }
            },
            prefill: {
                name: "Job Seeker",
                email: "seeker@example.com",
            },
            theme: {
                color: "#4f46e5"
            }
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    if (!results || results.length === 0) return;
    setSharing(true);
    try {
      const resp = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(results[activeResultIdx])
      });
      const data = await resp.json();
      const url = `${window.location.origin}/share/${data.shareId}`;
      navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } catch (err) {
      console.error('Failed to share', err);
    } finally {
      setSharing(false);
    }
  };

  const handleAnalyze = async () => {
    if (files.length === 0 || !jobDescription) return;

    if (credits < files.length) {
       setShowPaywall(true);
       return;
    }

    setStatus('UPLOADING');
    setErrorMsg(null);
    setTimeline([
      { time: getTimeNode(), label: 'Initializing secure connection...', status: 'done' },
      { time: getTimeNode(), label: 'Uploading document(s)...', status: 'active' },
      { time: '', label: 'Semantic extraction & OCR', status: 'pending' },
      { time: '', label: 'Matching against JD & scoring', status: 'pending' }
    ]);
    
    try {
      const allResults = [];
      // Deduct credits
      const newCredits = credits - files.length;
      setCredits(newCredits);
      localStorage.setItem('atsCredits', newCredits.toString());

      // Loop through files sequentially to save API rate limits and build comparison
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (files.length > 1) {
          setTimeline(t => [...t.slice(0, 2), { time: getTimeNode(), label: `Semantic extraction (Resume ${i+1}/${files.length})...`, status: 'active' }]);
        } else {
          setTimeline(t => [t[0], { ...t[1], status: 'done' }, { time: getTimeNode(), label: 'Semantic extraction & ATS parsing...', status: 'active' }, t[3]]);
        }

        const formData = new FormData();
        formData.append('resume', f);
        formData.append('jobDescription', jobDescription);

        const response = await fetch('/api/analyze', { method: 'POST', body: formData });
        let data;
        const text = await response.text();
        try { data = JSON.parse(text); } catch (err) { data = { error: 'Invalid response from server.' }; }

        if (response.ok && !data.error) {
            data.fileName = f.name;
            allResults.push(data);
        } else {
            throw new Error(data.error || 'Failed to analyze: received unexpected response format.');
        }
      }

      setResults(allResults);
      setActiveResultIdx(0);
      setStatus('COMPLETE');
      saveToHistory(allResults[0].atsScore || 0);

    } catch (err: any) {
      setErrorMsg(err.message || 'A network error occurred while communicating with the server.');
      setStatus('IDLE');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-black selection:text-white pb-20 font-sans">
      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        
        {/* Top bar replacements (Credits mapping & CmdK prompt) */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
           <div className="text-sm font-semibold text-gray-500 flex items-center gap-2">
             <LayoutDashboard className="w-4 h-4" /> Workspace Overview
           </div>
           <div className="flex items-center gap-3">
               <div 
                  className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200 shadow-sm cursor-pointer hover:bg-amber-100 transition-colors" 
                  onClick={() => setShowPaywall(true)}
               >
                   <Zap className="w-4 h-4" /> <span className="font-bold text-[13px]">{credits} credits left</span>
               </div>
               <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-400 font-medium cursor-pointer hover:border-gray-300" onClick={() => setShowCmd(true)}>
                   <Search className="w-3.5 h-3.5" /> <kbd className="font-mono text-[10px] bg-gray-100 px-1 rounded ml-1">⌘K</kbd>
               </div>
           </div>
        </div>

        {status === 'IDLE' && (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="mb-10 max-w-3xl">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-black mb-4 tracking-tighter leading-tight">Master the ATS.<br/>Land the interview.</h1>
                <p className="text-gray-500 text-lg sm:text-xl font-medium tracking-tight">Upload your resume to instantly simulate Enterprise ATS logic, uncover missing keywords, and get AI-driven rewrites.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 flex flex-col space-y-6">
                  
                  <div className="p-[1px] bg-gradient-to-b from-gray-200 to-gray-100 rounded-xl">
                    <div className="bg-white rounded-[11px] p-4 flex flex-col shadow-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {files.map((f, i) => (
                           <div key={i} className="flex border border-gray-200 rounded-lg p-3 items-center justify-between bg-gray-50/50">
                               <div className="flex items-center gap-2 overflow-hidden">
                                   <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                                   <span className="text-xs font-semibold text-black truncate" title={f.name}>{f.name}</span>
                               </div>
                               <X className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-red-500 shrink-0 ml-2" onClick={(e) => { e.stopPropagation(); removeFile(i); }} />
                           </div>
                        ))}
                        {files.length < 3 && (
                            <div 
                              className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-gray-200/60 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group min-h-[60px]"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" multiple onChange={handleFileChange} />
                              <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 group-hover:text-black transition-colors">
                                <Plus className="w-4 h-4" /> Add Resume {files.length > 0 && '(Compare)'}
                              </div>
                            </div>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium mt-3 uppercase tracking-widest text-center">PDF format only (Max 3 variations)</p>
                    </div>
                  </div>

                  <div className="p-[1px] bg-gradient-to-b from-gray-200 to-gray-100 rounded-xl shadow-sm">
                    <div className="bg-white rounded-[11px] overflow-hidden flex flex-col h-[280px]">
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <span className="text-sm font-semibold flex items-center gap-2"><FileText className="w-4 h-4"/> Target Job Description</span>
                            {jobDescription.length > 0 && <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Ready</span>}
                        </div>
                        <textarea 
                          className="flex-1 p-5 focus:outline-none resize-none text-sm leading-relaxed placeholder:text-gray-400"
                          placeholder="Paste the job description here... (include responsibilities and requirements)"
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </div>
                  </div>

                  {errorMsg && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 items-center p-4 bg-red-50/50 border border-red-100 rounded-xl text-red-600 font-medium text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
                    </motion.div>
                  )}

                  <div className="flex justify-end pt-2">
                    <Button 
                      size="lg" 
                      className="px-8 shadow-lg shadow-black/10 transition-all active:scale-95 group rounded-full"
                      disabled={files.length === 0 || !jobDescription}
                      onClick={handleAnalyze}
                    >
                      Run Full Analysis <Command className="ml-2 w-4 h-4 opacity-50 transition-opacity group-hover:opacity-100" />
                    </Button>
                  </div>

                </div>
                
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm p-5 shadow-sm">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2"><History className="w-3.5 h-3.5"/> Recent Scans</h3>
                    {history.length > 0 ? (
                      <ul className="space-y-3">
                        {history.map((item, index) => (
                          <li key={item.id} className="flex justify-between items-center text-sm p-3 bg-white rounded border border-gray-100 shadow-sm cursor-pointer hover:border-black transition-colors">
                            <div className="flex flex-col">
                                <span className="font-semibold">v{history.length - index} Resume</span>
                                <span className="text-xs text-gray-400">{item.date}</span>
                            </div>
                            <span className={`font-mono font-bold px-2 py-1 rounded bg-gray-50 border border-gray-100 ${item.score >= 80 ? 'text-green-600' : 'text-amber-500'}`}>
                                {item.score}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-6">
                        <Terminal className="w-8 h-8 text-gray-300 mx-auto mb-2 opacity-50" />
                        <p className="text-xs text-gray-400 font-medium">No history yet.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-5 overflow-hidden relative group cursor-pointer">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
                        <Maximize2 className="w-24 h-24 text-indigo-500"/>
                    </div>
                    <h3 className="text-sm font-bold text-indigo-900 mb-1">Unlock Multi-Compare</h3>
                    <p className="text-xs text-indigo-700/70 mb-4 pr-4">Test variations of your resume simultaneously against the same JD.</p>
                    <span className="text-[10px] uppercase tracking-widest font-bold bg-white text-indigo-600 px-2 py-1 rounded-sm shadow-sm inline-block">Pro Feature</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {status !== 'IDLE' && status !== 'COMPLETE' && (
          <div className="max-w-xl mx-auto pt-20">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden shadow-black/5">
                <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <span className="ml-2 text-xs font-mono text-gray-500 line-clamp-1">Processing Job Engine Simulation...</span>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center animate-pulse shadow-inner shadow-white/50">
                            <Server className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-black tracking-tight">{status === 'ANALYZING' ? 'AI Scoring Engine Active' : 'Parsing Secure Document'}</h2>
                            <p className="text-sm text-gray-500">Estimating completion in a few seconds.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4 font-mono text-xs">
                        {timeline.map((event, i) => (
                            <div key={i} className={`flex items-start gap-4 ${event.status === 'pending' ? 'opacity-40' : 'opacity-100'}`}>
                                <div className="w-16 shrink-0 text-gray-400 pt-0.5">{event.time || '—:—:—'}</div>
                                <div className="flex-1 flex gap-3 itmes-center">
                                    <div className="mt-0.5">
                                        {event.status === 'done' ? (
                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                        ) : event.status === 'active' ? (
                                            <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                                        ) : (
                                            <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />
                                        )}
                                    </div>
                                    <span className={event.status === 'active' ? 'text-blue-600 font-semibold' : 'text-gray-700'}>{event.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        )}

        {status === 'COMPLETE' && results && results.length > 0 && (
          <div className="space-y-6 pt-6">
            {results.length > 1 && (
               <div className="bg-white rounded-xl border border-indigo-200 ring-2 ring-indigo-50 shadow-sm p-4 overflow-x-auto flex items-center gap-3">
                 <div className="text-xs font-bold uppercase tracking-widest text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-md border border-indigo-100 flex items-center gap-2">
                   <Server className="w-3.5 h-3.5" /> Best Match Picked
                 </div>
                 {results.sort((a,b) => b.atsScore - a.atsScore).map((r, i) => (
                    <div 
                      key={i} 
                      onClick={() => setActiveResultIdx(results.indexOf(r))}
                      className={`flex flex-col min-w-[200px] border rounded-lg p-3 cursor-pointer transition-all ${results.indexOf(r) === activeResultIdx ? 'border-indigo-500 bg-indigo-50/30 ring-2 ring-indigo-500/20' : 'border-gray-200 hover:border-indigo-300'}`}
                    >
                       <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold truncate text-black max-w-[120px]" title={r.fileName}>{r.fileName || `Resume Variation ${i+1}`}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${r.atsScore >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>Score: {r.atsScore}</span>
                       </div>
                    </div>
                 ))}
               </div>
            )}
            
            {/* Viral Referral Banner */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-4 shadow-lg text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">Earn 10 Free Premium Scans</h4>
                        <p className="text-xs text-indigo-100">Share your analysis link on LinkedIn or with a friend to unlock free usage.</p>
                    </div>
                </div>
                <Button 
                    onClick={handleShare} 
                    disabled={sharing}
                    className="bg-white text-indigo-700 hover:bg-gray-100 font-bold uppercase text-[10px] tracking-widest shrink-0 h-9"
                >
                    {sharing ? <Loader2 className="w-4 h-4 animate-spin" /> : shareCopied ? 'Link Copied!' : 'Copy Share Link'}
                </Button>
            </div>

            <ResultsView results={results[activeResultIdx]} onReset={() => { setStatus('IDLE'); setFiles([]); }} handleShare={handleShare} shareCopied={shareCopied} sharing={sharing} />
          </div>
        )}

      </div>

      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPaywall(false)}></div>
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden border border-gray-200/50">
              <div className="bg-gradient-to-r from-gray-900 to-black p-8 text-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 cursor-pointer" onClick={() => setShowPaywall(false)}>
                    <X className="w-5 h-5 text-gray-400 hover:text-white" />
                 </div>
                 <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <Lock className="w-5 h-5 text-white" />
                 </div>
                 <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Upgrade to ATS Pro</h2>
                 <p className="text-gray-400 text-sm font-medium">You've run out of free scans. Upgrade to access unlimited analysis and multi-resume comparison.</p>
              </div>
              <div className="p-8 bg-gray-50 flex flex-col md:flex-row gap-6">
                  <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6 flex flex-col">
                     <h3 className="text-lg font-bold text-black mb-1">Pay-as-you-go</h3>
                     <p className="text-gray-500 text-sm mb-4">Perfect for quick optimizations.</p>
                     <div className="text-3xl font-black text-black mb-6">$5<span className="text-sm font-medium text-gray-400"> / 10 scans</span></div>
                     <ul className="space-y-3 mb-8 flex-1">
                        <li className="flex items-center gap-2 text-sm text-gray-600 font-medium"><CheckCircle2 className="w-4 h-4 text-indigo-500"/> Advanced Parser</li>
                        <li className="flex items-center gap-2 text-sm text-gray-600 font-medium"><CheckCircle2 className="w-4 h-4 text-indigo-500"/> AI Bullet Rewrites</li>
                     </ul>
                     <Button className="w-full h-11" variant="outline" onClick={() => handleCheckout('basic')}>Buy 10 Credits</Button>
                  </div>
                  <div className="flex-1 bg-white rounded-xl border-2 border-indigo-600 p-6 flex flex-col relative shadow-xl shadow-indigo-100">
                     <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-indigo-600 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded shadow-sm">Popular</div>
                     <h3 className="text-lg font-bold text-black mb-1">Pro Unlimited</h3>
                     <p className="text-gray-500 text-sm mb-4">For serious job seekers.</p>
                     <div className="text-3xl font-black text-indigo-600 mb-6">$19<span className="text-sm font-medium text-gray-500"> / month</span></div>
                     <ul className="space-y-3 mb-8 flex-1">
                        <li className="flex items-center gap-2 text-sm text-black font-semibold"><CheckCircle2 className="w-4 h-4 text-indigo-500"/> Multi-Resume Compare</li>
                        <li className="flex items-center gap-2 text-sm text-black font-semibold"><CheckCircle2 className="w-4 h-4 text-indigo-500"/> ATS System Simulation</li>
                        <li className="flex items-center gap-2 text-sm text-black font-semibold"><CheckCircle2 className="w-4 h-4 text-indigo-500"/> Unlimited Scans</li>
                     </ul>
                     <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20" onClick={() => handleCheckout('pro')}>Upgrade to Pro</Button>
                  </div>
              </div>
           </motion.div>
        </div>
      )}

      {showCmd && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCmd(false)}></div>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="flex items-center px-4 py-3 border-b border-gray-100">
                    <Search className="w-4 h-4 text-gray-400 mr-3" />
                    <input type="text" autoFocus placeholder="Type a command or search..." className="flex-1 outline-none text-sm placeholder:text-gray-300 font-medium" />
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">ESC</span>
                </div>
                <div className="p-2 space-y-1">
                    <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</div>
                    <div className="flex justify-between items-center px-3 py-2 text-sm text-black hover:bg-gray-100 rounded-lg cursor-pointer" onClick={() => { setShowCmd(false); setStatus('IDLE'); }}>
                        <span className="flex items-center gap-2"><UploadCloud className="w-4 h-4"/> New Analysis</span>
                        <kbd className="font-mono text-[10px] text-gray-400">⌘N</kbd>
                    </div>
                    <div className="flex justify-between items-center px-3 py-2 text-sm text-black hover:bg-gray-100 rounded-lg cursor-pointer">
                        <span className="flex items-center gap-2"><Download className="w-4 h-4"/> Download Report</span>
                    </div>
                    <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">Tools</div>
                    <Link to="/cover-letter-builder" onClick={() => setShowCmd(false)} className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <span className="flex items-center gap-2">Cover Letter Generator <span className="px-1.5 py-0.5 border border-indigo-200 bg-indigo-50 text-indigo-600 text-[9px] rounded uppercase font-bold tracking-widest ml-2">Beta</span></span>
                    </Link>
                    <Link to="/templates" onClick={() => setShowCmd(false)} className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <span className="flex items-center gap-2">Templates</span>
                    </Link>
                </div>
            </motion.div>
        </div>
      )}
    </div>
  );
}

function ResultsView({ results, onReset, handleShare, shareCopied, sharing }: { results: any, onReset: () => void, handleShare?: () => void, shareCopied?: boolean, sharing?: boolean }) {
  const [recruiterView, setRecruiterView] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-500";
    return "text-rose-500";
  };
  
  const getScoreStroke = (score: number) => {
    if (score >= 80) return "#10b981"; // emerald-500
    if (score >= 60) return "#f59e0b"; // amber-500
    return "#f43f5e"; // rose-500
  };

  const getScoreRing = (score: number) => {
      if (score >= 80) return "ring-emerald-500/20";
      if (score >= 60) return "ring-amber-500/20";
      return "ring-rose-500/20";
  }

  const breakdown = results.sectionBreakdown || {};
  const heatmap = results.keywordHeatmap || [];
  const simulations = results.atsSimulation || [];
  const matchBreakdown = results.matchBreakdown || {};

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="space-y-6 pb-12"
    >
      <div className="bg-white sticky top-[57px] z-30 pt-4 pb-4 border-b border-gray-100 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold tracking-tight text-black flex items-center gap-3">
                Analysis Results
            </h2>
            <p className="text-sm text-gray-500 font-medium">Your resume has been parsed against the job profile.</p>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          {handleShare && (
              <Button variant="ghost" size="sm" className="shrink-0 h-9 rounded-full px-3 text-indigo-600 hover:bg-indigo-50 font-semibold text-xs" onClick={handleShare}>
                  {sharing ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Share2 className="w-4 h-4 mr-1" />}
                  {shareCopied ? 'Copied Link' : 'Share Score'}
              </Button>
          )}
          <div 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer text-sm font-semibold transition-all shrink-0 ${recruiterView ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            onClick={() => setRecruiterView(!recruiterView)}
          >
             <Eye className={`w-4 h-4 ${recruiterView ? 'text-purple-600' : 'text-gray-400'}`} /> Recruiter View
          </div>
          <Button variant="outline" size="sm" className="shrink-0 h-9 rounded-full px-4 shadow-sm" onClick={() => window.print()}>
             Download PDF
          </Button>
          <Button size="sm" className="shrink-0 h-9 rounded-full px-5 shadow-md shadow-black/10" onClick={onReset}>
              New Scan
          </Button>
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all ${recruiterView ? 'filter sepia-[.1] saturate-150' : ''}`}>
        
        {/* Core Score Card */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
            <Card className={`overflow-hidden border-0 shadow-xl shadow-black-[0.02] ring-1 ring-inset ${getScoreRing(results.atsScore || 0)} bg-white relative`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-500/10 rounded-full blur-3xl"></div>
                <CardContent className="pt-8 pb-8 flex flex-col items-center text-center relative z-10">
                    <div className="relative w-44 h-44 mb-6 drop-shadow-md">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="46" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                        <circle 
                            cx="50" cy="50" r="46" fill="none" strokeLinecap="round"
                            stroke={getScoreStroke(results.atsScore || 0)} 
                            strokeWidth="6" 
                            strokeDasharray={`${2 * Math.PI * 46}`} 
                            strokeDashoffset={`${2 * Math.PI * 46 * (1 - (results.atsScore || 0) / 100)}`}
                            className="transition-all duration-1000 ease-out"
                        />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className={`text-5xl font-black tracking-tighter ${getScoreColor(results.atsScore || 0)}`}>
                            {results.atsScore || 0}
                        </span>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1 opacity-80">ATS Match</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ATS Systems Simulation */}
            {simulations.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-5">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-1 flex items-center gap-2"><Server className="w-3.5 h-3.5" /> ATS Simulation Engine</h4>
                    <p className="text-[11px] text-gray-500 mb-4 pb-4 border-b border-gray-100 font-medium">How major parsers read your file</p>
                    <div className="space-y-3 font-medium text-sm">
                        {simulations.map((sim: any, i: number) => (
                            <div key={i} className="flex justify-between items-center group">
                                <span className="text-gray-700">{sim.system}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${sim.status === 'PASSED' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : sim.status === 'MEDIUM MATCH' ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                                    {sim.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Breakdown Panel */}
        <div className="lg:col-span-2 flex flex-col space-y-6">
            <div className={`bg-white rounded-xl border p-6 flex flex-col md:flex-row gap-6 shadow-sm transition-colors ${recruiterView ? 'border-purple-200 ring-2 ring-purple-100' : 'border-gray-200'}`}>
                <div className={`md:w-1/2 pr-6 border-b md:border-b-0 md:border-r ${recruiterView ? 'border-purple-100' : 'border-gray-100'}`}>
                    <h3 className="text-sm font-bold text-black mb-4">Job Match Breakdown</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                                <span className="text-gray-500">Skills Matrix</span>
                                <span className="text-black">{matchBreakdown.skillsMatch || 0}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-black rounded-full" style={{ width: `${matchBreakdown.skillsMatch || 0}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                                <span className="text-gray-500">Experience Alignment</span>
                                <span className="text-black">{matchBreakdown.experienceMatch || 0}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-black rounded-full" style={{ width: `${matchBreakdown.experienceMatch || 0}%` }}></div>
                            </div>
                        </div>
                    </div>
                    {matchBreakdown.impactExplanation && (
                        <div className={`mt-5 p-3 rounded-lg text-xs font-medium leading-relaxed ${recruiterView ? 'bg-purple-50 text-purple-900 border border-purple-100' : 'bg-gray-50 text-gray-700'}`}>
                            {matchBreakdown.impactExplanation}
                        </div>
                    )}
                </div>
                <div className="md:w-1/2 flex flex-col justify-center">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Parser Extraction Quality</h3>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                        <SectionScore label="Contact Info" score={breakdown.contactInformation} />
                        <SectionScore label="Summary" score={breakdown.professionalSummary} />
                        <SectionScore label="Experience" score={breakdown.workExperience} />
                        <SectionScore label="Skills" score={breakdown.skillsSection} />
                        <SectionScore label="Education" score={breakdown.education} />
                        <SectionScore label="Formatting" score={breakdown.atsFormatting} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-emerald-200/60 shadow-sm bg-gradient-to-b from-white to-emerald-50/20">
                <CardHeader className="pb-3">
                    <CardTitle className="text-[13px] uppercase tracking-widest font-bold text-emerald-800">Key Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3 font-medium">
                        {(results.resumeStrengths || []).map((strength: string, i: number) => (
                            <li key={i} className="flex gap-3 text-[13px] text-gray-800 leading-snug items-start">
                            <CheckCircle2 className="w-4 h-4 mt-[2px] text-emerald-500 shrink-0"/>
                            <span>{strength}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                </Card>

                <Card className={`shadow-sm bg-gradient-to-b from-white to-rose-50/20 ${recruiterView ? 'border-red-400 ring-4 ring-red-100' : 'border-rose-200/60'}`}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-[13px] uppercase tracking-widest font-bold flex gap-2 items-center text-rose-800">
                        {recruiterView ? <><Eye className="w-4 h-4"/> 6-Sec Recruiter Glaring Red Flags</> : 'Critical Skill Gaps'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    {results.missingSkills?.critical?.length > 0 && (
                        <div>
                        <div className="flex flex-wrap gap-2">
                            {results.missingSkills.critical.map((s: string, i: number) => <span key={i} className={`px-2.5 py-1 text-xs font-bold rounded border ${recruiterView ? 'bg-red-600 text-white border-red-700 shadow-md transform scale-105' : 'bg-rose-50 text-rose-800 border-rose-200 shadow-sm'}`}>{s}</span>)}
                        </div>
                        </div>
                    )}
                    {results.missingSkills?.important?.length > 0 && (
                        <div>
                        <h4 className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>Important To Add</h4>
                        <div className="flex flex-wrap gap-2">
                            {results.missingSkills.important.map((s: string, i: number) => <span key={i} className="px-2 py-0.5 bg-amber-50 border border-amber-200/60 text-amber-800 text-[11px] font-semibold rounded">{s}</span>)}
                        </div>
                        </div>
                    )}
                    {results.missingSkillsExplainer?.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-rose-100/50">
                            <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">AI Reasoning</h4>
                            <div className="space-y-3">
                                {results.missingSkillsExplainer.map((explainer: any, i: number) => (
                                    <div key={i} className="bg-white/60 p-3 rounded-lg border border-rose-100/50 shadow-sm pointer-events-auto">
                                        <div className="text-xs font-extrabold text-black mb-1">{explainer.skill}</div>
                                        <div className="text-[11px] text-gray-500 font-medium leading-relaxed">{explainer.reasoning}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
                </Card>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-gray-200/60">
          <CardHeader className="border-b border-gray-100/50 bg-gray-50/30">
            <CardTitle className="text-sm font-bold text-black flex items-center justify-between">
                <span>Keyword Heatmap</span>
                <span className="text-[10px] uppercase font-bold text-gray-400 bg-white px-2 py-1 rounded shadow-sm border border-gray-100">JD vs Resume</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {heatmap.map((item: any, i: number) => (
                <div key={i} className={`flex items-center justify-between p-2 rounded-md border text-[11px] font-semibold font-mono ${item.found ? 'border-emerald-100 bg-emerald-50/50 text-emerald-800' : 'border-rose-100 bg-rose-50/50 text-rose-800'}`}>
                  <span className="truncate mr-2">{item.keyword}</span>
                  {item.found ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0"/> : <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200/60">
          <CardHeader className="border-b border-gray-100/50 bg-gray-50/30">
             <CardTitle className="text-sm font-bold text-black flex items-center justify-between">
                 <span>System Risk Analysis</span>
             </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
             <div>
                <ul className="space-y-2.5">
                  {(results.atsRiskAssessment?.lowRisk || []).map((risk: string, i: number) => (
                    <li key={i} className="flex gap-2.5 text-[13px] font-medium text-gray-600 items-start">
                      <div className="w-4 h-4 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-3 h-3"/></div>
                      <span className="leading-snug">{risk}</span>
                    </li>
                  ))}
                </ul>
             </div>
             {(results.atsRiskAssessment?.warnings && results.atsRiskAssessment.warnings.length > 0) && (
             <div className="pt-2 border-t border-gray-100">
                <ul className="space-y-2.5 mt-3">
                  {(results.atsRiskAssessment?.warnings || []).map((warn: string, i: number) => (
                    <li key={i} className="flex gap-2.5 text-[13px] font-medium text-gray-600 items-start">
                      <div className="w-4 h-4 rounded bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5"><AlertCircle className="w-3 h-3"/></div>
                      <span className="leading-snug text-amber-900">{warn}</span>
                    </li>
                  ))}
                </ul>
             </div>
             )}
          </CardContent>
        </Card>
      </div>

      {results.aiRewriteSummary && (
        <Card className="shadow-lg border-gray-200 overflow-hidden bg-white">
          <div className="flex flex-col md:flex-row h-full">
            <div className="md:w-2/5 bg-gray-50/80 p-6 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><AlertCircle className="w-3 h-3 text-red-400" /> Current Summary</h4>
                <p className="text-[13px] text-gray-500 font-serif leading-relaxed line-through decoration-red-200 opacity-80">
                    {results.aiRewriteSummary.before || "No summary found."}
                </p>
            </div>
            <div className="md:w-3/5 p-6 bg-white flex flex-col relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-full pointer-events-none"></div>
                <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Job-Tailored Rewrite</h4>
                <p className="text-sm text-gray-900 font-serif leading-relaxed font-medium">
                    {results.aiRewriteSummary.after || "Could not generate rewrite."}
                </p>
                <div className="mt-5 flex justify-start">
                    <Button variant="secondary" size="sm" className="h-8 shadow-sm flex items-center gap-2 font-semibold text-xs" onClick={() => navigator.clipboard.writeText(results.aiRewriteSummary?.after || '')}>
                        Copy Suggested Snippet
                    </Button>
                </div>
            </div>
          </div>
        </Card>
      )}

      {results.bulletRewrites && results.bulletRewrites.length > 0 && (
        <Card className="shadow-sm border-gray-200 bg-white">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100">
             <CardTitle className="text-sm font-bold text-black">Bullet Experience Optimizations</CardTitle>
             <p className="text-xs text-gray-500 mt-1">Impactful, metric-driven rewrites based on the JD requirements.</p>
          </CardHeader>
          <div className="divide-y divide-gray-100">
             {results.bulletRewrites.map((rewrite: any, i: number) => (
               <div key={i} className="p-5 flex flex-col xl:flex-row gap-5 items-start xl:items-center hover:bg-gray-50/30 transition-colors">
                  <div className="xl:w-[40%] text-[13px] text-gray-500 font-serif line-through decoration-red-200 opacity-80">
                      {rewrite.original}
                  </div>
                  <div className="xl:w-[45%] text-[13px] text-gray-900 font-serif font-medium leading-relaxed bg-blue-50/50 border border-blue-100/50 p-3 rounded-lg shadow-sm">
                      {rewrite.suggested}
                  </div>
                  <div className="xl:w-[15%] flex xl:justify-end w-full gap-2 mt-2 xl:mt-0">
                      <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-gray-500 hover:text-red-600 w-full xl:w-auto">Reject</Button>
                      <Button size="sm" className="h-8 text-xs shadow-sm bg-black text-white hover:bg-gray-800 w-full xl:w-auto" onClick={() => navigator.clipboard.writeText(rewrite.suggested)}>Accept</Button>
                  </div>
               </div>
             ))}
          </div>
        </Card>
      )}
    </motion.div>
  );
}

function SectionScore({ label, score }: { label: string, score: number }) {
  const getScoreColor = (s: number) => {
    if (s == null) return "text-gray-400 font-medium";
    if (s >= 80) return "text-emerald-600 font-bold";
    if (s >= 60) return "text-amber-500 font-bold";
    return "text-rose-500 font-bold";
  };
  
  return (
    <div className="flex justify-between items-center text-[12px] border-b border-gray-100 py-1.5 last:border-0 border-dashed">
      <span className="text-gray-600 font-semibold">{label}</span>
      <span className={`font-mono ${getScoreColor(score)}`}>{score != null ? `${score}%` : '—'}</span>
    </div>
  );
}

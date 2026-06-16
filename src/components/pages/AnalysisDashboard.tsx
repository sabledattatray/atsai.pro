'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, User, CheckCircle2, AlertCircle, ArrowRight, Loader2, Download, History, ChevronRight, Eye, Search, Maximize2, Server, Terminal, Command, Zap, Plus, X, Lock, Share2, Users, LayoutDashboard, Target, TrendingUp, TrendingDown, Sparkles, BarChart2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { auth, onAuthStateChanged, signOut } from '@/lib/firebase';
import { updatePassword, sendEmailVerification } from 'firebase/auth';

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
  const router = useRouter();
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
  const searchParamsHook = useSearchParams();
  const pathnameCurrent = usePathname();
  const [activeTab, setActiveTab] = useState<'scan' | 'settings' | 'admin'>('scan');
  const [user, setUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passChanging, setPassChanging] = useState(false);
  const [passMsg, setPassMsg] = useState('');

  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const searchParams = searchParamsHook;
    const tab = searchParamsHook.get('tab');
    if (tab === 'settings') {
      setActiveTab('settings');
    } else if (tab === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('scan');
    }

    if (pathnameCurrent === '/app/analyze' || searchParamsHook.get('reset') === 'true') {
      setStatus('IDLE');
      setJobDescription('');
      setFiles([]);
      setResults([]);
      setErrorMsg(null);
    }
  }, [pathnameCurrent, searchParamsHook.toString()]);

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
                color: "#6366f1"
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

    // Admin Bypass for scan limits
    // if (credits < files.length) {
    //    setShowPaywall(true);
    //    return;
    //  }

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
      // Admin Bypass: Deduct credits commented out
      // const newCredits = credits - files.length;
      // setCredits(newCredits);
      // localStorage.setItem('atsCredits', newCredits.toString());

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
        if (!response.ok && text.trim().startsWith('<')) {
           // It's likely an HTML error page from a reverse proxy
           if (response.status === 413) {
              throw new Error('Your file is too large. Please upload a smaller file under 1MB, or remove images from the PDF.');
           } else if (response.status === 504 || response.status === 502) {
              throw new Error('The server timed out while analyzing your resume. This usually means the AI took too long. Please try a shorter resume.');
           } else {
              throw new Error(`Server error (${response.status}): ${response.statusText}`);
           }
        }
        
        try { data = JSON.parse(text); } catch (err) { data = { error: 'Invalid response from server: ' + text.substring(0, 50) }; }

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

  const isOAuthUser = user?.providerData?.some((p: any) => p.providerId === 'google.com' || p.providerId === 'github.com');
  const isAdmin = user?.email?.toLowerCase().includes('admin') || user?.email === 'seeker@example.com' || !user;

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendMsg('');
    if (auth && auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setResendMsg('Sent!');
        setTimeout(() => setResendMsg(''), 3000);
      } catch (err: any) {
        console.error("Resend verification error:", err);
        alert(err.message || 'Failed to send verification email.');
      } finally {
        setResendLoading(false);
      }
    } else {
      await new Promise(r => setTimeout(r, 800));
      setResendMsg('Sent (Simulated)!');
      setTimeout(() => setResendMsg(''), 3000);
      setResendLoading(false);
    }
  };

  const getAdminHeaders = async () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (auth && auth.currentUser) {
      try {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      } catch (err) {
        console.error("Failed to retrieve ID token:", err);
      }
    } else {
      headers['x-mock-email'] = user?.email || 'seeker@example.com';
    }
    return headers;
  };

  const handleRefreshVerification = async () => {
    if (auth && auth.currentUser) {
      setResendLoading(true);
      setResendMsg('');
      try {
        await auth.currentUser.reload();
        const freshUser = auth.currentUser;
        setUser({ ...freshUser });
        if (freshUser.emailVerified) {
          // Sync with backend
          const headers = await getAdminHeaders();
          await fetch('/api/admin/users/register', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              uid: freshUser.uid,
              email: freshUser.email,
              emailVerified: true
            })
          });
          window.location.reload();
        } else {
          setResendMsg('Email is still unverified. Please check your inbox.');
          setTimeout(() => setResendMsg(''), 4000);
        }
      } catch (err: any) {
        console.error("Failed to reload user session:", err);
        setResendMsg(err.message || 'Failed to refresh verification status.');
        setTimeout(() => setResendMsg(''), 4000);
      } finally {
        setResendLoading(false);
      }
    } else {
      window.location.reload();
    }
  };

  const fetchAdminUsers = async () => {
    setAdminLoading(true);
    try {
      const headers = await getAdminHeaders();
      const resp = await fetch('/api/admin/users', {
        headers
      });
      if (resp.ok) {
        const data = await resp.json();
        setAdminUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch admin users:", err);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleUpdateUserCredits = async (uid: string, currentCredits: number, offset: number) => {
    const newCredits = Math.max(0, currentCredits + offset);
    try {
      const headers = await getAdminHeaders();
      const resp = await fetch('/api/admin/users/update-credits', {
        method: 'POST',
        headers,
        body: JSON.stringify({ uid, credits: newCredits })
      });
      if (resp.ok) {
        setAdminUsers(prev => prev.map(u => u.uid === uid ? { ...u, credits: newCredits } : u));
      }
    } catch (err) {
      console.error("Failed to update credits:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'admin' && isAdmin) {
      fetchAdminUsers();
    }
  }, [activeTab, user]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg('');
    if (newPassword !== confirmPassword) {
      setPassMsg('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPassMsg('Password must be at least 6 characters.');
      return;
    }

    setPassChanging(true);
    if (auth && auth.currentUser) {
      try {
        await updatePassword(auth.currentUser, newPassword);
        setPassMsg('Password updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
      } catch (err: any) {
        console.error("Password update error:", err);
        setPassMsg(err.message || 'Failed to update password. You may need to re-authenticate or re-login.');
      } finally {
        setPassChanging(false);
      }
    } else {
      await new Promise(r => setTimeout(r, 1000));
      setPassMsg('Password updated successfully (Simulated)!');
      setNewPassword('');
      setConfirmPassword('');
      setPassChanging(false);
    }
  };

  if (user && !isOAuthUser && !user.emailVerified) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 text-slate-100 font-sans relative">
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none bg-grid-pattern"></div>
        <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="w-full max-w-md relative z-10 p-8 bg-[#0b0f19]/60 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md text-center space-y-6">
          <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Verify your email address</h2>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              We have sent a verification link to <strong className="text-slate-200">{user.email}</strong>. Please check your inbox and click the link to activate your account.
            </p>
          </div>

          <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 space-y-3 font-semibold text-xs text-left">
            <p className="text-slate-400 leading-normal font-medium">
              Once you have clicked the verification link, refresh this page to access your workspace.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Button 
              onClick={handleRefreshVerification}
              disabled={resendLoading}
              className="w-full h-11 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl cursor-pointer"
            >
              {resendLoading ? 'Checking...' : 'I have verified - Refresh'}
            </Button>
            
            {window.location.hostname === 'localhost' && (
              <button
                onClick={async () => {
                  try {
                    await fetch('/api/admin/users/register', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        uid: user.uid,
                        email: user.email,
                        emailVerified: true
                      })
                    });
                    alert("Email verification bypassed in dev mode. Reloading page...");
                    window.location.reload();
                  } catch (err) {
                    console.error("Failed to bypass:", err);
                  }
                }}
                className="w-full h-11 text-xs font-bold uppercase tracking-wider bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl cursor-pointer mt-2"
              >
                Bypass Verification (Local Dev Mode)
              </button>
            )}
            
            <div className="flex justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest font-mono pt-2">
              <button
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                {resendLoading ? 'Sending...' : 'Resend Email'}
              </button>
              
              <button
                onClick={async () => {
                  if (auth) {
                    await signOut(auth);
                    router.push('/signin');
                  }
                }}
                className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                Sign Out
              </button>
            </div>
            
            {resendMsg && (
              <div className="p-2.5 rounded-lg text-[9px] font-bold uppercase font-mono tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-center">
                {resendMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] selection:bg-indigo-500/20 pb-20 font-sans text-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        
        {/* Top bar replacements */}
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/5">
           <div className="flex items-center gap-6">
             <button 
               onClick={() => setActiveTab('scan')}
               className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 font-mono pb-4 -mb-4 border-b-2 transition-all cursor-pointer ${activeTab === 'scan' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
             >
               <LayoutDashboard className="w-4 h-4" /> Workspace Overview
             </button>
             <button 
               onClick={() => setActiveTab('settings')}
               className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 font-mono pb-4 -mb-4 border-b-2 transition-all cursor-pointer ${activeTab === 'settings' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
             >
               <User className="w-4 h-4" /> Account Settings
             </button>
             {isAdmin && (
               <button 
                 onClick={() => setActiveTab('admin')}
                 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 font-mono pb-4 -mb-4 border-b-2 transition-all cursor-pointer ${activeTab === 'admin' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
               >
                 <Users className="w-4 h-4" /> Admin Portal
               </button>
             )}
           </div>
           <div className="flex items-center gap-3">
               <div 
                  className="flex items-center gap-2 bg-indigo-500/10 text-indigo-300 px-3.5 py-1.5 rounded-full border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)] cursor-pointer hover:bg-indigo-500/20 transition-all font-mono" 
                  onClick={() => setShowPaywall(true)}
               >
                   <Zap className="w-3.5 h-3.5 text-indigo-400" /> <span className="font-extrabold text-xs">{credits > 50 ? 'Admin Unlimited' : 'Upgrade Pro'}</span>
               </div>
               <div className="hidden sm:flex items-center gap-2 bg-slate-900/60 hover:bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-white/5 text-xs text-slate-400 font-semibold cursor-pointer hover:border-white/10 transition-colors font-mono" onClick={() => setShowCmd(true)}>
                   <Search className="w-3.5 h-3.5 text-slate-500" /> <kbd className="font-mono text-[9px] bg-slate-950 px-1.5 py-0.5 rounded border border-white/10 ml-1">âŒ˜K</kbd>
               </div>
           </div>
        </div>

        {activeTab === 'scan' ? (
          <>
            {status === 'IDLE' && (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                  <div className="mb-10 max-w-3xl">
                    <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight leading-none">Master the ATS.<br/><span className="text-gradient">Land the interview.</span></h1>
                    <p className="text-slate-400 text-lg font-medium">Upload your resume to instantly simulate Enterprise ATS logic, uncover missing keywords, and get AI-driven rewrites.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 flex flex-col space-y-6">
                      
                      {/* File Upload Box */}
                      <div className="p-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-2xl shadow-2xl">
                        <div className="bg-[#0b0f19]/60 backdrop-blur-md rounded-[15px] p-5 flex flex-col border border-white/5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {files.map((f, i) => (
                               <div key={i} className="flex border border-white/5 rounded-xl p-3 items-center justify-between bg-slate-950/50 hover:border-white/10 transition-colors">
                                   <div className="flex items-center gap-2 overflow-hidden">
                                       <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                                       <span className="text-xs font-semibold text-slate-200 truncate" title={f.name}>{f.name}</span>
                                   </div>
                                   <X className="w-4 h-4 text-slate-500 cursor-pointer hover:text-rose-400 shrink-0 ml-2 transition-colors" onClick={(e) => { e.stopPropagation(); removeFile(i); }} />
                               </div>
                            ))}
                            {files.length < 3 && (
                                <div 
                                  className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-white/10 rounded-xl bg-slate-950/20 hover:bg-slate-950/40 hover:border-indigo-500/50 transition-all cursor-pointer group min-h-[60px]"
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" multiple onChange={handleFileChange} />
                                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors font-mono">
                                    <Plus className="w-4 h-4 text-indigo-400" /> Add Resume {files.length > 0 && '(Compare)'}
                                  </div>
                                </div>
                            )}
                          </div>
                          <p className="text-[9px] text-slate-500 font-bold font-mono mt-3.5 uppercase tracking-widest text-center">PDF format only (Max 3 variations)</p>
                        </div>
                      </div>

                      {/* Target Job Description */}
                      <div className="p-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-2xl shadow-2xl">
                        <div className="bg-[#0b0f19]/60 backdrop-blur-md rounded-[15px] overflow-hidden flex flex-col h-[280px] border border-white/5">
                            <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between bg-slate-950/40">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 font-mono"><FileText className="w-4 h-4 text-indigo-400"/> Target Job Description</span>
                                {jobDescription.length > 0 && <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25 font-mono">Ready</span>}
                            </div>
                            <textarea 
                              className="flex-1 p-5 focus:outline-none resize-none text-sm leading-relaxed placeholder:text-slate-500 bg-slate-950/20 text-white"
                              placeholder="Paste the job description here... (include responsibilities and requirements)"
                              value={jobDescription}
                              onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>
                      </div>

                      {errorMsg && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 items-center p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 font-semibold text-xs uppercase tracking-wider font-mono">
                          <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
                        </motion.div>
                      )}

                      <div className="flex justify-end pt-2">
                        <Button 
                          size="lg" 
                          className="px-8 shadow-xl shadow-indigo-500/10 transition-all active:scale-98 group rounded-xl"
                          disabled={files.length === 0 || !jobDescription}
                          onClick={handleAnalyze}
                        >
                          Run Full Analysis <Command className="ml-2 w-4 h-4 opacity-60 transition-opacity group-hover:opacity-100" />
                        </Button>
                      </div>

                    </div>
                    
                    {/* Right Sidebar */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                      
                      {/* Account & Plan Overview Card */}
                      <div className="rounded-2xl border border-white/5 bg-[#0b0f19]/30 backdrop-blur-md p-5 shadow-2xl space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-extrabold text-xs uppercase shadow-md shadow-indigo-500/25">
                            {user ? (user.displayName ? user.displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : user.email?.substring(0, 2).toUpperCase()) : 'DS'}
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="text-xs font-bold text-slate-200 truncate">{user?.displayName || 'Guest User'}</h4>
                            <p className="text-[10px] text-slate-400 truncate">{user?.email || 'seeker@example.com'}</p>
                          </div>
                        </div>

                        <div className="border-t border-white/5 pt-3.5 space-y-3 text-xs font-mono font-semibold">
                          <div className="flex justify-between items-center text-slate-300">
                            <span className="font-sans">Active Plan</span>
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${credits > 50 ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-400 border border-white/5'}`}>
                              {credits > 50 ? 'Pro Unlimited' : 'Spark Free'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-slate-300">
                            <span className="font-sans">Scan Credits</span>
                            <span className="text-slate-200">{credits > 50 ? 'Unlimited' : `${credits} Remaining`}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-300">
                            <span className="font-sans">Downloads/Edits</span>
                            <span className="text-emerald-400">Unlimited</span>
                          </div>
                        </div>

                        <div className="border-t border-white/5 pt-3 flex justify-between">
                          <button
                            onClick={() => setActiveTab('settings')}
                            className="text-[9px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors font-mono cursor-pointer bg-transparent border-none p-0"
                          >
                            Manage Account â†’
                          </button>
                          {!isOAuthUser && (
                            <button
                              onClick={() => { setActiveTab('settings'); }}
                              className="text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors font-mono cursor-pointer bg-transparent border-none p-0"
                            >
                              Change Password
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/5 bg-[#0b0f19]/30 backdrop-blur-md p-5 shadow-2xl">
                        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2 font-mono"><History className="w-3.5 h-3.5 text-indigo-400"/> Recent Scans</h3>
                        {history.length > 0 ? (
                          <ul className="space-y-3">
                            {history.map((item, index) => (
                              <li key={item.id} className="flex justify-between items-center text-xs p-3 bg-slate-950/40 rounded-xl border border-white/5 shadow-inner cursor-pointer hover:border-white/20 transition-all">
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-bold text-slate-200">v{history.length - index} Resume</span>
                                    <span className="text-[10px] text-slate-500 font-mono font-medium">{item.date}</span>
                                </div>
                                <span className={`font-mono font-bold px-2 py-1 rounded-md border ${item.score >= 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                                    {item.score}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-center py-8">
                            <Terminal className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-50" />
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">No history yet.</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 to-slate-900/40 p-5 overflow-hidden relative group cursor-pointer shadow-xl">
                        <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-2 -translate-y-2 group-hover:scale-115 transition-transform duration-300">
                            <Maximize2 className="w-24 h-24 text-indigo-400"/>
                        </div>
                        <h3 className="text-sm font-bold text-white mb-1">Unlock Multi-Compare</h3>
                        <p className="text-xs text-slate-400 mb-4 pr-4 leading-relaxed font-medium">Test variations of your resume simultaneously against the same JD.</p>
                        <span className="text-[8px] uppercase tracking-widest font-mono font-bold bg-indigo-500 text-white px-2 py-1 rounded shadow-md">Pro Feature</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Processing/Loading Screen */}
            {status !== 'IDLE' && status !== 'COMPLETE' && (
              <div className="max-w-xl mx-auto pt-20">
                <div className="bg-[#0b0f19]/70 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden">
                    <div className="bg-slate-950/90 border-b border-white/5 px-4 py-3.5 flex items-center justify-between">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 tracking-wider">Processing Job Engine Simulation...</span>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/25 rounded-xl flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                <Server className="w-5 h-5 text-indigo-400 animate-spin" />
                            </div>
                            <div>
                                <h2 className="text-base font-extrabold text-white tracking-tight leading-none mb-1">{status === 'ANALYZING' ? 'AI Scoring Engine Active' : 'Parsing Secure Document'}</h2>
                                <p className="text-xs text-slate-400">Estimating completion in a few seconds.</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4 font-mono text-[10px]">
                            {timeline.map((event, i) => (
                                <div key={i} className={`flex items-start gap-4 transition-all duration-300 ${event.status === 'pending' ? 'opacity-30' : 'opacity-100'}`}>
                                    <div className="w-16 shrink-0 text-slate-500 pt-0.5">{event.time || 'â€”:â€”:â€”'}</div>
                                    <div className="flex-1 flex gap-3 items-center">
                                        <div className="mt-0.5">
                                            {event.status === 'done' ? (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                                            ) : event.status === 'active' ? (
                                                <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                                            ) : (
                                                <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />
                                            )}
                                        </div>
                                        <span className={event.status === 'active' ? 'text-indigo-300 font-bold' : 'text-slate-300'}>{event.label}</span>
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
                   <div className="bg-[#0b0f19]/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl p-4 overflow-x-auto flex items-center gap-3">
                     <div className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 flex items-center gap-2 font-mono shrink-0">
                       <Server className="w-3.5 h-3.5" /> Best Match Picked
                     </div>
                     {results.sort((a,b) => b.atsScore - a.atsScore).map((r, i) => (
                        <div 
                          key={i} 
                          onClick={() => setActiveResultIdx(results.indexOf(r))}
                          className={`flex flex-col min-w-[200px] border rounded-xl p-3 cursor-pointer transition-all ${results.indexOf(r) === activeResultIdx ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]' : 'border-white/5 bg-slate-950/20 hover:border-white/10'}`}
                        >
                           <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold truncate text-slate-200 max-w-[120px]" title={r.fileName}>{r.fileName || `Resume Variation ${i+1}`}</span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${r.atsScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>Score: {r.atsScore}</span>
                           </div>
                        </div>
                     ))}
                   </div>
                )}
                
                {/* Referral Banner */}
                <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 rounded-2xl p-5 shadow-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-indigo-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
                    <div className="flex items-center gap-3.5 relative z-10">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold tracking-tight">Earn 10 Free Premium Scans</h4>
                            <p className="text-xs text-indigo-200 mt-0.5 font-medium">Share your analysis link on LinkedIn or with a friend to unlock free usage.</p>
                        </div>
                    </div>
                    <Button 
                        onClick={handleShare} 
                        disabled={sharing}
                        className="bg-white text-indigo-700 hover:bg-slate-100 hover:text-indigo-800 font-extrabold uppercase text-[9px] tracking-widest shrink-0 h-9 px-5 rounded-lg shadow-xl relative z-10"
                    >
                        {sharing ? <Loader2 className="w-4 h-4 animate-spin" /> : shareCopied ? 'Link Copied!' : 'Copy Share Link'}
                    </Button>
                </div>

                <ResultsView results={results[activeResultIdx]} onReset={() => { setStatus('IDLE'); setFiles([]); }} handleShare={handleShare} shareCopied={shareCopied} sharing={sharing} />
              </div>
            )}
          </>
        ) : activeTab === 'settings' ? (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left side: Account details & security */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Profile Card */}
              <div className="p-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-2xl shadow-2xl">
                <div className="bg-[#0b0f19]/60 backdrop-blur-md rounded-[15px] p-6 border border-white/5 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-500/20">
                      {user ? (user.displayName ? user.displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : user.email?.substring(0, 2).toUpperCase()) : 'DS'}
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-white">{user?.displayName || 'Datta Sable'}</h2>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{user?.email || 'seeker@example.com'}</p>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mt-2 font-mono">
                        {isOAuthUser ? `Linked via ${user?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : user?.providerData?.[0]?.providerId === 'github.com' ? 'GitHub' : 'OAuth'}` : 'Email/Password Account'}
                      </span>
                      
                      {/* Email Verification Status */}
                      <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">Email Status:</span>
                          {user ? (
                            user.emailVerified ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold uppercase text-[9px] font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-400 font-bold uppercase text-[9px] font-mono bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                                Unverified
                              </span>
                            )
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold uppercase text-[9px] font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                              Verified (Simulated)
                            </span>
                          )}
                        </div>
                        
                        {user && !user.emailVerified && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleResendVerification}
                              disabled={resendLoading}
                              className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors font-mono cursor-pointer bg-transparent border-none p-0"
                            >
                              {resendLoading ? 'Sending link...' : 'Resend Verification Link'}
                            </button>
                            {resendMsg && (
                              <span className="text-[9px] font-bold text-emerald-400 font-mono uppercase bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                                {resendMsg}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Management */}
              <div className="p-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-2xl shadow-2xl">
                <div className="bg-[#0b0f19]/60 backdrop-blur-md rounded-[15px] p-6 border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-400" /> Security & Password
                  </h3>
                  
                  {isOAuthUser ? (
                    <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 text-xs text-slate-400 leading-relaxed font-semibold">
                      Your account is managed via **{user?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'GitHub'} OAuth**. Passwords and security credentials are authenticated directly by your provider.
                    </div>
                  ) : (
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">New Password</label>
                          <input 
                            type="password" 
                            required 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" 
                            className="w-full h-11 px-4 rounded-xl border border-white/10 bg-slate-950/70 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-xs font-semibold" 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Confirm Password</label>
                          <input 
                            type="password" 
                            required 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" 
                            className="w-full h-11 px-4 rounded-xl border border-white/10 bg-slate-950/70 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-xs font-semibold" 
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit" disabled={passChanging} size="sm" className="h-10 px-5 text-[10px] tracking-widest font-mono font-bold uppercase cursor-pointer">
                          {passChanging ? 'Updating...' : 'Update Password'}
                        </Button>
                      </div>
                      {passMsg && (
                        <div className={`p-3 rounded-lg text-[10px] font-bold uppercase font-mono tracking-wider ${passMsg.includes('successfully') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                          {passMsg}
                        </div>
                      )}
                    </form>
                  )}
                </div>
              </div>

            </div>

            {/* Right side: billing, credits, etc */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Plan Card */}
              <div className="rounded-2xl border border-white/5 bg-[#0b0f19]/30 backdrop-blur-md p-5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2 font-mono">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" /> Plan & Billing
                </h3>
                
                <div className="p-4 bg-slate-950/40 rounded-xl border border-white/5 mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-300 font-sans">Active Plan</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md font-mono">
                      {credits > 50 ? 'Pro Unlimited' : 'Spark Free'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">Billing Cycle: {credits > 50 ? 'Monthly Recurring' : 'Free tier limitations'}</p>
                </div>

                <div className="space-y-3 font-semibold text-xs border-b border-white/5 pb-4 mb-4 font-mono">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="font-sans">Scan Credits</span>
                    <span className="text-white">{credits > 50 ? 'Unlimited' : `${credits} Remaining`}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="font-sans">PDF Downloads</span>
                    <span className="text-white">Unlimited</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="font-sans">Cover Letter Edits</span>
                    <span className="text-white">Unlimited</span>
                  </div>
                </div>

                <Button 
                  onClick={() => setShowPaywall(true)}
                  className="w-full h-10 text-[9px] font-bold tracking-widest uppercase bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-lg cursor-pointer"
                >
                  {credits > 50 ? 'Manage Subscription' : 'Upgrade Plan'}
                </Button>
              </div>

              {/* Usage telemetry meter */}
              <div className="rounded-2xl border border-white/5 bg-[#0b0f19]/30 backdrop-blur-md p-5 shadow-2xl">
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2 font-mono">
                  <BarChart2 className="w-3.5 h-3.5 text-indigo-400" /> Usage Telemetry
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5 font-mono">
                      <span className="text-slate-400 font-sans">Monthly Scans</span>
                      <span className="text-slate-300">{credits > 50 ? '12 / âˆž' : `${10 - credits} / 10`}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: credits > 50 ? '25%' : `${(10 - credits) * 10}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5 font-mono">
                      <span className="text-slate-400 font-sans">PDF Downloads</span>
                      <span className="text-slate-300">4 / âˆž</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5 font-mono">
                      <span className="text-slate-400 font-sans">Cover Letter Edits</span>
                      <span className="text-slate-300">2 / âˆž</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <Users className="w-6 h-6 text-indigo-400" /> System User Database
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Manage credentials, audit telemetry credits, and check email verification status.</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 border border-white/5 rounded-xl px-3.5 py-2 w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500" />
                <input 
                  type="text"
                  placeholder="Search name or email..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-500 w-full focus:ring-0 focus:outline-none"
                />
              </div>
            </div>

            {adminLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              </div>
            ) : (
              <div className="border border-white/5 bg-[#0b0f19]/30 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/5 bg-slate-950/40 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 font-mono">
                        <th className="p-4">User</th>
                        <th className="p-4">Auth Provider</th>
                        <th className="p-4">Verification</th>
                        <th className="p-4">Credits</th>
                        <th className="p-4">Registered Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03] font-medium text-slate-300">
                      {adminUsers
                        .filter(u => 
                          (u.displayName?.toLowerCase().includes(adminSearch.toLowerCase()) || 
                           u.email?.toLowerCase().includes(adminSearch.toLowerCase()))
                        )
                        .map((userItem) => (
                          <tr key={userItem.uid} className="hover:bg-white/[0.01] transition-colors">
                            <td className="p-4 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px] uppercase">
                                {userItem.displayName ? userItem.displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : userItem.email?.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="overflow-hidden max-w-[180px]">
                                <p className="text-white font-bold truncate">{userItem.displayName}</p>
                                <p className="text-[10px] text-slate-500 truncate mt-0.5">{userItem.email}</p>
                              </div>
                            </td>
                            <td className="p-4 font-mono text-[10px] uppercase">
                              <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-bold ${userItem.providerId === 'google.com' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : userItem.providerId === 'github.com' ? 'bg-slate-800 text-slate-300 border border-white/5' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                                {userItem.providerId.replace('.com', '')}
                              </span>
                            </td>
                            <td className="p-4">
                              {userItem.emailVerified ? (
                                <span className="inline-flex items-center gap-1 text-emerald-400 font-bold uppercase text-[9px] font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                                  Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-amber-400 font-bold uppercase text-[9px] font-mono bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                                  Unverified
                                </span>
                              )}
                            </td>
                            <td className="p-4 font-mono font-bold text-white">
                              {userItem.credits} Scans
                            </td>
                            <td className="p-4 text-slate-500 font-mono text-[10px]">
                              {new Date(userItem.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-right space-x-1.5">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-2 text-[9px] font-bold tracking-wider font-mono uppercase cursor-pointer"
                                onClick={() => handleUpdateUserCredits(userItem.uid, userItem.credits, 10)}
                              >
                                +10 Credits
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-2 text-[9px] font-bold tracking-wider font-mono uppercase border-rose-500/20 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                                onClick={() => handleUpdateUserCredits(userItem.uid, userItem.credits, -10)}
                              >
                                -10 Credits
                              </Button>
                            </td>
                          </tr>
                      ))}
                      {adminUsers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500 font-mono uppercase tracking-widest text-[10px]">
                            No registered users found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}

      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowPaywall(false)}></div>
           <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-[#0b0f19]/95 border border-white/10 rounded-2xl w-full max-w-2xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl">
              <div className="bg-gradient-to-b from-slate-950 to-[#0b0f19] p-8 text-center border-b border-white/5 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 cursor-pointer" onClick={() => setShowPaywall(false)}>
                    <X className="w-5 h-5 text-slate-500 hover:text-white transition-colors" />
                 </div>
                 <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/25 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <Lock className="w-5 h-5 text-indigo-400" />
                 </div>
                 <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Upgrade to ATS Pro</h2>
                 <p className="text-slate-400 text-sm font-medium">You've run out of free scans. Upgrade to access unlimited analysis and multi-resume comparison.</p>
              </div>
              <div className="p-8 bg-slate-950/20 flex flex-col md:flex-row gap-6">
                  <div className="flex-1 bg-[#0b0f19]/40 border border-white/5 rounded-2xl p-6 flex flex-col backdrop-blur-sm shadow-xl">
                     <h3 className="text-base font-bold text-white mb-1">Pay-as-you-go</h3>
                     <p className="text-slate-500 text-xs mb-4 font-medium">Perfect for quick optimizations.</p>
                     <div className="text-3xl font-black text-white mb-6 font-mono">$5<span className="text-xs font-semibold text-slate-500 tracking-wider uppercase font-sans"> / 10 scans</span></div>
                     <ul className="space-y-3 mb-8 flex-1">
                        <li className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold"><CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0"/> Advanced Parser</li>
                        <li className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold"><CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0"/> AI Bullet Rewrites</li>
                     </ul>
                     <Button className="w-full h-11" variant="outline" onClick={() => handleCheckout('basic')}>Buy 10 Credits</Button>
                  </div>
                  <div className="flex-1 bg-[#0b0f19]/80 border-2 border-indigo-500 rounded-2xl p-6 flex flex-col relative shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                     <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-indigo-500 text-white text-[8px] uppercase tracking-widest font-mono font-bold px-3 py-1 rounded shadow-md">Popular</div>
                     <h3 className="text-base font-bold text-white mb-1">Pro Unlimited</h3>
                     <p className="text-slate-500 text-xs mb-4 font-medium">For serious job seekers.</p>
                     <div className="text-3xl font-black text-indigo-400 mb-6 font-mono">$19<span className="text-xs font-semibold text-slate-500 tracking-wider uppercase font-sans"> / month</span></div>
                     <ul className="space-y-3 mb-8 flex-1">
                        <li className="flex items-center gap-2.5 text-xs text-slate-100 font-extrabold"><CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0"/> Multi-Resume Compare</li>
                        <li className="flex items-center gap-2.5 text-xs text-slate-100 font-extrabold"><CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0"/> ATS System Simulation</li>
                        <li className="flex items-center gap-2.5 text-xs text-slate-100 font-extrabold"><CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0"/> Unlimited Scans</li>
                     </ul>
                     <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20" onClick={() => handleCheckout('pro')}>Upgrade to Pro</Button>
                  </div>
              </div>
           </motion.div>
        </div>
      )}

      {/* CmdK Modal */}
      {showCmd && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCmd(false)}></div>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-[#0d1325]/95 w-full max-w-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden backdrop-blur-xl">
                <div className="flex items-center px-4 py-3.5 border-b border-white/5 bg-slate-950/40">
                    <Search className="w-4 h-4 text-slate-500 mr-3" />
                    <input type="text" autoFocus placeholder="Type a command or search..." className="flex-1 bg-transparent outline-none text-xs text-white placeholder:text-slate-500 font-semibold" />
                    <span className="text-[8px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-white/10 uppercase font-bold">ESC</span>
                </div>
                <div className="p-3 space-y-1">
                    <div className="px-2 py-1.5 text-[8px] font-extrabold uppercase tracking-widest text-slate-500 font-mono">Actions</div>
                    <div className="flex justify-between items-center px-3 py-2 text-xs text-slate-200 hover:bg-white/5 rounded-xl cursor-pointer transition-colors" onClick={() => { setShowCmd(false); setStatus('IDLE'); }}>
                        <span className="flex items-center gap-2.5 font-semibold"><UploadCloud className="w-4 h-4 text-indigo-400"/> New Analysis</span>
                        <kbd className="font-mono text-[9px] text-slate-500">âŒ˜N</kbd>
                    </div>
                    <div className="flex justify-between items-center px-3 py-2 text-xs text-slate-200 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
                        <span className="flex items-center gap-2.5 font-semibold"><Download className="w-4 h-4 text-indigo-400"/> Download Report</span>
                    </div>
                    <div className="px-2 py-1.5 text-[8px] font-extrabold uppercase tracking-widest text-slate-500 font-mono mt-3">Tools</div>
                    <Link href="/cover-letter-builder" onClick={() => setShowCmd(false)} className="flex items-center px-3 py-2 text-xs text-slate-300 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
                        <span className="flex items-center gap-2.5 font-semibold">Cover Letter Generator <span className="px-2 py-0.5 border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-[8px] rounded uppercase font-bold tracking-widest ml-2 font-mono">Beta</span></span>
                    </Link>
                    <Link href="/templates" onClick={() => setShowCmd(false)} className="flex items-center px-3 py-2 text-xs text-slate-300 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
                        <span className="flex items-center gap-2.5 font-semibold">Templates</span>
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
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-rose-400";
  };
  
  const getScoreStroke = (score: number) => {
    if (score >= 80) return "#10b981"; // emerald-500
    if (score >= 60) return "#f59e0b"; // amber-500
    return "#ef4444"; // rose-500
  };

  const getScoreRing = (score: number) => {
      if (score >= 80) return "ring-emerald-500/10 border-emerald-500/10";
      if (score >= 60) return "ring-amber-500/10 border-amber-500/10";
      return "ring-rose-500/10 border-rose-500/10";
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
      <div className="bg-[#030712]/80 backdrop-blur-md sticky top-[80px] z-30 pt-4 pb-4 border-b border-white/5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                Analysis Results
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Your resume has been parsed against the job profile.</p>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 font-mono">
          {handleShare && (
              <Button variant="ghost" size="sm" className="shrink-0 h-9 rounded-lg px-3 text-indigo-400 hover:bg-indigo-500/10 font-bold text-[10px]" onClick={handleShare}>
                  {sharing ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Share2 className="w-4 h-4 mr-1.5" />}
                  {shareCopied ? 'Copied Link' : 'Share Score'}
              </Button>
          )}
          <div 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer text-[10px] font-bold tracking-widest uppercase transition-all shrink-0 ${recruiterView ? 'bg-purple-500/10 text-purple-300 border-purple-500/25 shadow-md shadow-purple-500/5' : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10'}`}
            onClick={() => setRecruiterView(!recruiterView)}
          >
             <Eye className={`w-4 h-4 ${recruiterView ? 'text-purple-400' : 'text-slate-500'}`} /> Recruiter View
          </div>
          <Button variant="outline" size="sm" className="shrink-0 h-9 rounded-lg px-4 shadow-sm" onClick={() => window.print()}>
             Download PDF
          </Button>
          <Button size="sm" className="shrink-0 h-9 rounded-lg px-5 shadow-lg shadow-indigo-500/20" onClick={onReset}>
              New Scan
          </Button>
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all ${recruiterView ? 'filter saturate-125 brightness-110' : ''}`}>
        
        {/* Core Score Card */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
            <Card className={`overflow-hidden border border-white/5 shadow-2xl shadow-black/60 bg-[#0b0f19]/40 backdrop-blur-md relative`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/10 rounded-full blur-3xl"></div>
                <CardContent className="pt-8 pb-8 flex flex-col items-center text-center relative z-10">
                    <div className="relative w-44 h-44 mb-6 drop-shadow-[0_0_25px_rgba(99,102,241,0.15)]">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
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
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-80 font-mono">ATS Match</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ATS Systems Simulation */}
            {simulations.length > 0 && (
                <div className="bg-[#0b0f19]/30 backdrop-blur-md rounded-2xl border border-white/5 p-5 shadow-2xl">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-2 font-mono"><Server className="w-3.5 h-3.5 text-indigo-400" /> ATS Simulation</h4>
                    <p className="text-[9px] text-slate-500 mb-4 pb-4 border-b border-white/5 font-bold uppercase tracking-widest font-mono">Parser Engine Assessment</p>
                    <div className="space-y-3 font-semibold text-xs">
                        {simulations.map((sim: any, i: number) => (
                            <div key={i} className="flex justify-between items-center group font-mono">
                                <span className="text-slate-300 font-sans">{sim.system}</span>
                                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${sim.status === 'PASSED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : sim.status === 'MEDIUM MATCH' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
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
            <div className={`bg-[#0b0f19]/30 backdrop-blur-md rounded-2xl border p-6 flex flex-col md:flex-row gap-6 shadow-2xl transition-all ${recruiterView ? 'border-purple-500/30 ring-4 ring-purple-500/5' : 'border-white/5'}`}>
                <div className={`md:w-1/2 pr-6 border-b md:border-b-0 md:border-r ${recruiterView ? 'border-purple-500/10' : 'border-white/5'}`}>
                    <h3 className="text-sm font-bold text-white mb-4">Job Match Breakdown</h3>
                    <div className="space-y-4 font-mono">
                        <div>
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                                <span className="text-slate-500 font-sans">Skills Matrix</span>
                                <span className="text-white">{matchBreakdown.skillsMatch || 0}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" style={{ width: `${matchBreakdown.skillsMatch || 0}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                                <span className="text-slate-500 font-sans">Experience Alignment</span>
                                <span className="text-white">{matchBreakdown.experienceMatch || 0}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" style={{ width: `${matchBreakdown.experienceMatch || 0}%` }}></div>
                            </div>
                        </div>
                    </div>
                    {matchBreakdown.impactExplanation && (
                        <div className={`mt-5 p-4 rounded-xl text-xs font-semibold leading-relaxed ${recruiterView ? 'bg-purple-500/10 text-purple-200 border border-purple-500/20' : 'bg-slate-950/40 border border-white/5 text-slate-400'}`}>
                            {matchBreakdown.impactExplanation}
                        </div>
                    )}
                </div>
                <div className="md:w-1/2 flex flex-col justify-center">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 font-mono">Parser Quality Control</h3>
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
                {/* Key Strengths */}
                <Card className="border-emerald-500/10 shadow-2xl bg-gradient-to-b from-[#0b0f19]/40 to-emerald-950/10">
                <CardHeader className="pb-3">
                    <CardTitle className="text-[11px] uppercase tracking-widest font-extrabold text-emerald-400 font-mono">Key Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3 font-semibold">
                        {(results.resumeStrengths || []).map((strength: string, i: number) => (
                            <li key={i} className="flex gap-3 text-xs text-slate-200 leading-normal items-start">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0"/>
                            <span>{strength}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                </Card>

                {/* Skill Gaps */}
                <Card className={`shadow-2xl bg-gradient-to-b from-[#0b0f19]/40 to-rose-950/10 ${recruiterView ? 'border-rose-500 ring-4 ring-rose-500/5' : 'border-rose-500/10'}`}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-[11px] uppercase tracking-widest font-extrabold flex gap-2 items-center text-rose-400 font-mono">
                        {recruiterView ? <><Eye className="w-4 h-4 text-rose-400 animate-pulse"/> Recruiter Glaring Red Flags</> : 'Critical Skill Gaps'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    {results.missingSkills?.critical?.length > 0 && (
                        <div>
                        <div className="flex flex-wrap gap-2">
                            {results.missingSkills.critical.map((s: string, i: number) => <span key={i} className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${recruiterView ? 'bg-rose-600 text-white border-rose-500 shadow-lg transform scale-105' : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-sm font-mono'}`}>{s}</span>)}
                        </div>
                        </div>
                    )}
                    {results.missingSkills?.important?.length > 0 && (
                        <div>
                        <h4 className="text-[9px] font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 font-mono"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>Important To Add</h4>
                        <div className="flex flex-wrap gap-2">
                            {results.missingSkills.important.map((s: string, i: number) => <span key={i} className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-semibold rounded font-mono">{s}</span>)}
                        </div>
                        </div>
                    )}
                    {results.missingSkillsExplainer?.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-rose-500/10">
                            <h4 className="text-[9px] font-bold text-rose-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-mono">AI Reasoning</h4>
                            <div className="space-y-3">
                                {results.missingSkillsExplainer.map((explainer: any, i: number) => (
                                    <div key={i} className="bg-slate-950/40 p-3 rounded-xl border border-white/5 shadow-inner">
                                        <div className="text-xs font-bold text-slate-200 mb-1">{explainer.skill}</div>
                                        <div className="text-[11px] text-slate-400 font-medium leading-relaxed">{explainer.reasoning}</div>
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
        {/* Heatmap */}
        <Card className="shadow-2xl border-white/5 bg-[#0b0f19]/30 backdrop-blur-md">
          <CardHeader className="border-b border-white/5 bg-slate-950/20">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center justify-between font-mono">
                <span>Keyword Heatmap</span>
                <span className="text-[8px] uppercase font-bold text-slate-500 bg-slate-950 px-2 py-1 rounded border border-white/5 font-mono">JD vs Resume</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {heatmap.map((item: any, i: number) => (
                <div key={i} className={`flex items-center justify-between p-2.5 rounded-lg border text-[11px] font-bold font-mono ${item.found ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-rose-500/20 bg-rose-500/10 text-rose-400'}`}>
                  <span className="truncate mr-2">{item.keyword}</span>
                  {item.found ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0"/> : <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Risk */}
        <Card className="shadow-2xl border-white/5 bg-[#0b0f19]/30 backdrop-blur-md">
          <CardHeader className="border-b border-white/5 bg-slate-950/20">
             <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">
                 <span>System Risk Analysis</span>
             </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
             <div>
                <ul className="space-y-2.5">
                  {(results.atsRiskAssessment?.lowRisk || []).map((risk: string, i: number) => (
                    <li key={i} className="flex gap-2.5 text-xs font-semibold text-slate-300 items-start">
                      <div className="w-4 h-4 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-3 h-3"/></div>
                      <span className="leading-snug">{risk}</span>
                    </li>
                  ))}
                </ul>
             </div>
             {(results.atsRiskAssessment?.warnings && results.atsRiskAssessment.warnings.length > 0) && (
              <div className="pt-4 border-t border-white/5">
                <ul className="space-y-2.5">
                  {(results.atsRiskAssessment?.warnings || []).map((warn: string, i: number) => (
                    <li key={i} className="flex gap-2.5 text-xs font-semibold text-slate-300 items-start">
                      <div className="w-4 h-4 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5"><AlertCircle className="w-3 h-3"/></div>
                      <span className="leading-snug text-amber-300">{warn}</span>
                    </li>
                  ))}
                </ul>
              </div>
             )}
          </CardContent>
        </Card>
      </div>

      {results.aiRewriteSummary && (
        <Card className="shadow-2xl border-white/5 overflow-hidden bg-[#0b0f19]/30 backdrop-blur-md">
          <div className="flex flex-col md:flex-row h-full">
            <div className="md:w-2/5 bg-slate-950/40 p-6 border-b md:border-b-0 md:border-r border-white/5 flex flex-col">
                <h4 className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-mono"><AlertCircle className="w-3 h-3 text-rose-400" /> Original Summary</h4>
                <p className="text-xs text-slate-400 leading-relaxed line-through decoration-rose-500/35 opacity-75 font-serif">
                    {results.aiRewriteSummary.before || "No summary found."}
                </p>
            </div>
            <div className="md:w-3/5 p-6 bg-slate-950/20 flex flex-col relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-bl-full pointer-events-none"></div>
                <h4 className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-mono"><Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Job-Tailored Rewrite</h4>
                <p className="text-sm text-slate-200 leading-relaxed font-bold font-serif">
                    {results.aiRewriteSummary.after || "Could not generate rewrite."}
                </p>
                <div className="mt-5 flex justify-start">
                    <Button variant="secondary" size="sm" className="h-8 shadow-md flex items-center gap-2 font-bold text-[10px]" onClick={() => navigator.clipboard.writeText(results.aiRewriteSummary?.after || '')}>
                        Copy Suggested Snippet
                    </Button>
                </div>
            </div>
          </div>
        </Card>
      )}

      {results.bulletRewrites && results.bulletRewrites.length > 0 && (
        <Card className="shadow-2xl border-white/5 bg-[#0b0f19]/30 backdrop-blur-md overflow-hidden">
          <CardHeader className="bg-slate-950/30 border-b border-white/5">
             <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">Bullet Experience Optimizations</CardTitle>
             <p className="text-xs text-slate-500 mt-1 font-medium">Impactful, metric-driven rewrites based on the JD requirements.</p>
          </CardHeader>
          <div className="divide-y divide-white/5 bg-slate-950/10">
             {results.bulletRewrites.map((rewrite: any, i: number) => (
               <div key={i} className="p-5 flex flex-col xl:flex-row gap-5 items-start xl:items-center hover:bg-white/2 transition-colors">
                  <div className="xl:w-[40%] text-xs text-slate-400 line-through decoration-rose-500/35 opacity-75 font-serif">
                      {rewrite.original}
                  </div>
                  <div className="xl:w-[45%] text-xs text-slate-200 leading-relaxed bg-indigo-500/5 border border-indigo-500/20 p-3 rounded-xl shadow-inner font-serif font-bold">
                      {rewrite.suggested}
                  </div>
                  <div className="xl:w-[15%] flex xl:justify-end w-full gap-2 mt-2 xl:mt-0 font-mono">
                      <Button variant="ghost" size="sm" className="h-8 text-[9px] font-bold text-slate-500 hover:text-rose-400 w-full xl:w-auto rounded-lg">Reject</Button>
                      <Button size="sm" className="h-8 text-[9px] font-bold shadow-md bg-white text-black hover:bg-slate-200 w-full xl:w-auto rounded-lg" onClick={() => navigator.clipboard.writeText(rewrite.suggested)}>Accept</Button>
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
    if (s == null) return "text-slate-500 font-mono";
    if (s >= 80) return "text-emerald-400 font-bold";
    if (s >= 60) return "text-amber-400 font-bold";
    return "text-rose-400 font-bold";
  };
  
  return (
    <div className="flex justify-between items-center text-xs border-b border-white/5 py-2 last:border-0 border-dashed font-mono">
      <span className="text-slate-400 font-semibold font-sans">{label}</span>
      <span className={`${getScoreColor(score)}`}>{score != null ? `${score}%` : 'â€”'}</span>
    </div>
  );
}

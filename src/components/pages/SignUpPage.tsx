'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { auth, googleProvider, githubProvider, signInWithPopup } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { Loader2, AlertCircle } from 'lucide-react';

export default function SignUpPage() {
  // SEO handled via Next.js metadata

  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    if (auth) {
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        try {
          await sendEmailVerification(result.user);
          console.log("Verification email sent.");
        } catch (verErr) {
          console.error("Failed to send verification email:", verErr);
        }
        console.log("Email Sign-Up success:", result.user);
        router.push('/app');
      } catch (err: any) {
        console.error("Email Sign-Up failed:", err);
        if (err.code === 'auth/operation-not-allowed') {
          setErrorMsg('Email/Password provider is not enabled in your Firebase Console. Please go to Firebase Console > Authentication > Sign-in method, select Email/Password under "Add new provider", toggle "Enable", and click Save.');
        } else {
          setErrorMsg(err.message || 'Failed to create account. Please check your credentials and try again.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Mock Fallback
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.warn("Firebase Auth is not configured. Redirecting to mock session.");
      router.push('/app');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || !googleProvider) {
      console.warn("Firebase Auth is not configured. Falling back to mock session.");
      router.push('/app');
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google Sign-In success:", result.user);
      router.push('/app');
    } catch (error: any) {
      console.error("Google Sign-In failed:", error);
      if (error.code !== 'auth/popup-closed-by-user') {
        alert(`Authentication error: ${error.message}`);
      }
    }
  };

  const handleGithubSignIn = async () => {
    if (!auth || !githubProvider) {
      console.warn("Firebase Auth is not configured. Falling back to mock session.");
      router.push('/app');
      return;
    }
    try {
      const result = await signInWithPopup(auth, githubProvider);
      console.log("GitHub Sign-In success:", result.user);
      router.push('/app');
    } catch (error: any) {
      console.error("GitHub Sign-In failed:", error);
      if (error.code !== 'auth/popup-closed-by-user') {
        alert(`Authentication error: ${error.message}`);
      }
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-[#030712] text-slate-100">
      {/* Left side banner */}
      <div className="hidden md:flex w-1/2 bg-slate-950 flex-col justify-between p-12 text-white relative overflow-hidden border-r border-white/5">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none bg-grid-pattern"></div>
        {/* Radial Ambient Glow */}
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center text-white hover:opacity-85 transition-opacity">
            <Logo invertText />
          </Link>
        </div>

        {/* Premium live ATS analyzer stats card */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 max-w-sm relative overflow-hidden shadow-2xl backdrop-blur-md">
             {/* Gradient glow inside the card */}
             <div className="absolute -right-20 -top-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
             
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">Live ATS Analyzer</span>
                </div>
                <span className="text-[10px] font-bold text-indigo-400 font-mono">V2.4.0</span>
             </div>

             <div className="space-y-4">
                <div>
                   <div className="flex justify-between items-end mb-1.5">
                      <span className="text-xs font-semibold text-slate-300">ATS Readability Rate</span>
                      <span className="text-sm font-black text-emerald-400 font-mono">98%</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '98%' }}></div>
                   </div>
                </div>

                <div>
                   <div className="flex justify-between items-end mb-1.5">
                      <span className="text-xs font-semibold text-slate-300">Semantic Keyword Match</span>
                      <span className="text-sm font-black text-indigo-400 font-mono">92%</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '92%' }}></div>
                   </div>
                </div>

                <div className="h-px bg-white/5 my-4" />

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1">Total Scans</p>
                      <p className="text-lg font-black text-white font-mono">54,281</p>
                   </div>
                   <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1">AI Optimizations</p>
                      <p className="text-lg font-black text-white font-mono">124k+</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-black mb-6 leading-tight text-white tracking-tight">Join the top 1% of candidates.</h2>
          <p className="text-slate-400 font-medium leading-relaxed">Our semantic AI has analyzed over 50,000 successful resumes, reverse-engineering the exact patterns that get past modern ATS filters.</p>
          
          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3 text-sm text-slate-300">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mt-0.5">
                <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white">Live ATS Readability Audit</p>
                <p className="text-xs text-slate-400 mt-0.5">Detect parsing blockers, formatting issues, and structural layout errors instantly.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 text-sm text-slate-300">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mt-0.5">
                <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white">Semantic Keyword Matching</p>
                <p className="text-xs text-slate-400 mt-0.5">Align your skills and accomplishments directly with core and secondary JD terms.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[#030712] relative">
        <div className="absolute top-[40%] right-[-10%] w-[350px] h-[350px] bg-purple-600/5 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Create your account</h1>
            <p className="text-slate-400 font-medium">Get started with your free ATS analysis and optimizations.</p>
          </div>

          {errorMsg && (
            <div className="flex gap-2.5 items-center p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 font-semibold text-xs uppercase tracking-wider font-mono mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 font-mono">Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 font-mono">Email Address</label>
              <input 
                type="email" 
                placeholder="seeker@example.com" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 font-mono">Password</label>
                <input 
                  type="password" 
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 font-mono">Confirm</label>
                <input 
                  type="password" 
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
                />
              </div>
            </div>
            
            <Button type="submit" disabled={loading} className="w-full h-12 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl mt-6 cursor-pointer">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-widest font-mono">
              <span className="bg-[#030712] px-3.5 text-slate-500">Or sign up with</span>
            </div>
          </div>

          {/* Google & GitHub Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button" 
              onClick={handleGoogleSignIn}
              className="h-12 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-widest transition-all active:scale-98 cursor-pointer select-none"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Google
            </button>

            <button 
              type="button" 
              onClick={handleGithubSignIn}
              className="h-12 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-widest transition-all active:scale-98 cursor-pointer select-none"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-slate-500 font-medium">
            Already have an account? <Link href="/signin" className="text-indigo-400 font-bold hover:text-indigo-300">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

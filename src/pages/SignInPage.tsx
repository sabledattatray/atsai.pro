import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';

export default function SignInPage() {
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login -> redirect to app dashboard
    navigate('/app');
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
          <Link to="/" className="flex items-center text-white hover:opacity-85 transition-opacity">
            <Logo invertText />
          </Link>
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-black mb-6 leading-tight text-white tracking-tight">Join the top 1% of candidates.</h2>
          <p className="text-slate-400 font-medium leading-relaxed">Our semantic AI has analyzed over 50,000 successful resumes, reverse-engineering the exact patterns that get past modern ATS filters.</p>
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[#030712] relative">
        <div className="absolute top-[40%] right-[-10%] w-[350px] h-[350px] bg-purple-600/5 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome back</h1>
            <p className="text-slate-400 font-medium">Sign in to your account to continue.</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 font-mono">Email Address</label>
              <input 
                type="email" 
                placeholder="seeker@example.com" 
                required
                className="w-full h-12 px-4 rounded-xl border border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
                defaultValue="seeker@example.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2 font-mono text-[10px]">
                 <label className="block font-bold uppercase tracking-widest text-slate-500">Password</label>
                 <a href="#" className="font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300">Forgot password?</a>
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                className="w-full h-12 px-4 rounded-xl border border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
                defaultValue="password123"
              />
            </div>
            
            <Button type="submit" className="w-full h-12 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl mt-6">
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-widest font-mono">
              <span className="bg-[#030712] px-3.5 text-slate-500">Or continue with</span>
            </div>
          </div>

          {/* Google Button */}
          <button 
            type="button" 
            onClick={() => navigate('/app')}
            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all active:scale-98 cursor-pointer select-none"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <div className="mt-8 text-center text-xs text-slate-500 font-medium">
            Don't have an account? <Link to="/app" className="text-indigo-400 font-bold hover:text-indigo-300">Create one for free</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

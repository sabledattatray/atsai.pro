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
    <div className="flex w-full min-h-screen bg-gray-50">
      <div className="hidden md:flex w-1/2 bg-black flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black pointer-events-none"></div>
        <div className="relative z-10">
          <Link to="/" className="flex items-center text-white hover:opacity-80 transition-opacity">
            <Logo invertText />
          </Link>
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-black mb-6 leading-tight text-white">Join the top 1% of candidates.</h2>
          <p className="text-gray-400">Our semantic AI has analyzed over 50,000 successful resumes, reverse-engineering the exact patterns that get past modern ATS filters.</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-black mb-2">Welcome back</h1>
            <p className="text-gray-500">Sign in to your account to continue.</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="seeker@example.com" 
                required
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors"
                defaultValue="seeker@example.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-xs uppercase tracking-widest font-bold text-gray-400">Password</label>
                 <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Forgot password?</a>
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors"
                defaultValue="password123"
              />
            </div>
            
            <Button type="submit" className="w-full h-12 text-base font-semibold bg-black text-white hover:bg-gray-800 rounded-xl mt-4">
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? <Link to="/app" className="text-indigo-600 font-semibold hover:text-indigo-700">Create one for free</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

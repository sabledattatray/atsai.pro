import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Briefcase, FileText, User, LayoutDashboard, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Logo } from './Logo';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const publicRoutes = ['/', '/pricing', '/features', '/templates', '/cover-letter-builder', '/linkedin-optimizer', '/career-hub', '/interview-guides', '/about', '/privacy-policy', '/terms-of-service', '/signin'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] font-sans text-[#1A1A1A]">
      <header className="h-20 w-full px-4 md:px-12 flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto h-full flex items-center justify-between">
          <Link to="/" className="flex items-center text-black z-50">
            <Logo />
          </Link>
          
          <nav className="hidden lg:flex items-center gap-10 text-sm font-semibold text-gray-600 uppercase tracking-widest">
            {isPublicRoute ? (
              <>
                <Link to="/features" className="hover:text-black transition-colors">Features</Link>
                <Link to="/pricing" className="hover:text-black transition-colors">Pricing</Link>
                <Link to="/templates" className="hover:text-black transition-colors">Templates</Link>
                <div className="h-4 w-px bg-gray-200" />
                <Link to="/signin" className="hover:text-black transition-colors">Sign In</Link>
                <Link to="/app">
                  <Button className="font-bold tracking-widest uppercase text-xs px-6">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/app" className="hover:text-black transition-colors flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link to="/app/analyze" className="hover:text-black transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" /> New Analysis
                </Link>
                <Link to="/templates" className="hover:text-black transition-colors">Templates</Link>
                <Link to="/career-hub" className="hover:text-black transition-colors">Career Pathways</Link>
                <div className="h-4 w-px bg-gray-200" />
                <button className="flex items-center gap-2 hover:text-black">
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs uppercase">
                    ME
                  </div>
                </button>
              </>
            )}
          </nav>
          
          <button 
            className="lg:hidden p-2 text-black z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col pt-24 px-6 pb-6 lg:hidden overflow-y-auto">
          <nav className="flex flex-col gap-6 text-xl font-extrabold text-black uppercase tracking-tight">
            {isPublicRoute ? (
              <>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-gray-100 pb-4">Home</Link>
                <Link to="/features" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-gray-100 pb-4">Features</Link>
                <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-gray-100 pb-4">Pricing</Link>
                <Link to="/templates" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-gray-100 pb-4">Templates</Link>
                <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-gray-100 pb-4">Sign In</Link>
                <Link to="/app" onClick={() => setIsMobileMenuOpen(false)} className="mt-4">
                  <Button size="lg" className="w-full text-sm">GET STARTED FREE</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/app" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-gray-100 pb-4 flex items-center gap-3">
                  <LayoutDashboard className="w-6 h-6" /> Dashboard
                </Link>
                <Link to="/app/analyze" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-gray-100 pb-4 flex items-center gap-3">
                  <FileText className="w-6 h-6" /> New Analysis
                </Link>
                <Link to="/templates" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-gray-100 pb-4 flex items-center gap-3">
                  Templates
                </Link>
                <Link to="/career-hub" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-gray-100 pb-4 flex items-center gap-3">
                  Career Pathways
                </Link>
              </>
            )}
          </nav>
        </div>
      )}

      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>
      
      {isPublicRoute && location.pathname !== '/signin' && (
        <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4 md:px-12 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="inline-block mb-4">
                <Logo />
              </Link>
              <p className="text-[10px] leading-relaxed max-w-[200px]">The world's fastest AI-powered ATS resume optimization platform.</p>
            </div>
            <div>
              <h4 className="text-black mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/features" className="hover:text-black">Feature Tour</Link></li>
                <li><Link to="/app" className="hover:text-black">ATS Resume Checker</Link></li>
                <li><Link to="/cover-letter-builder" className="hover:text-black">Cover Letter Builder</Link></li>
                <li><Link to="/linkedin-optimizer" className="hover:text-black">LinkedIn Optimizer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-black mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/templates" className="hover:text-black">Resume Templates</Link></li>
                <li><Link to="/career-hub" className="hover:text-black">Career Hub</Link></li>
                <li><Link to="/interview-guides" className="hover:text-black">Interview Guides</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-black mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-black">About</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-black">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-black">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="container mx-auto mt-12 pt-8 border-t border-gray-200 flex flex-col items-center justify-center gap-8">
            <div className="flex flex-col items-center text-center gap-2 p-6 bg-gray-100 rounded-2xl w-full max-w-2xl border border-gray-200">
               <div className="text-sm font-semibold text-black">
                 Built by <a href="https://dattasable.com" target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-700 hover:underline">Datta Sable</a>
               </div>
               <div className="text-xs text-gray-500 normal-case tracking-normal">AI Systems Architect • SaaS Builder • Web & Automation Developer</div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
              <div className="flex gap-8">
                 <span>Global Presence: NY / LDN / TYO</span>
                 <span>Status: Systems Operational</span>
              </div>
              <div className="flex gap-8">
                 <span>Privacy Protocol</span>
                 <span>&copy; {new Date().getFullYear()} Resume Copilot</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

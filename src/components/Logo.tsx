import React from 'react';

export function Logo({ className = "", showText = true, invertText = false }: { className?: string, showText?: boolean, invertText?: boolean }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Premium UI/UX Custom Logo Mark */}
      <div className="relative group shrink-0">
        {/* Glow effect behind the logo icon */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
        
        {/* Main Logo Container */}
        <div className="relative w-9 h-9 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center shadow-lg overflow-hidden">
          {/* Inner Custom SVG Geometric Mark */}
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300"
          >
            {/* Gradients */}
            <defs>
              <linearGradient id="logo-gradient-1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#818cf8" /> {/* indigo-400 */}
                <stop offset="50%" stopColor="#6366f1" /> {/* indigo-500 */}
                <stop offset="100%" stopColor="#4f46e5" /> {/* indigo-600 */}
              </linearGradient>
              <linearGradient id="logo-gradient-2" x1="0" y1="32" x2="32" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#d946ef" /> {/* fuchsia-500 */}
                <stop offset="100%" stopColor="#a855f7" /> {/* purple-500 */}
              </linearGradient>
            </defs>

            {/* Background geometric grid nodes */}
            <circle cx="8" cy="8" r="1.5" fill="white" fillOpacity="0.15" />
            <circle cx="24" cy="8" r="1.5" fill="white" fillOpacity="0.15" />
            <circle cx="8" cy="24" r="1.5" fill="white" fillOpacity="0.15" />
            <circle cx="24" cy="24" r="1.5" fill="white" fillOpacity="0.15" />

            {/* Modern Abstract Document/Folder shape */}
            <path
              d="M6 8C6 6.89543 6.89543 6 8 6H18L26 14V24C26 25.1046 25.1046 26 24 26H8C6.89543 26 6 25.1046 6 24V8Z"
              stroke="url(#logo-gradient-1)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.85"
            />

            {/* Overlapping Connected Node / Sparkle path */}
            <path
              d="M14 14.5L16 11L18 14.5L21.5 16.5L18 18.5L16 22L14 18.5L10.5 16.5L14 14.5Z"
              fill="url(#logo-gradient-2)"
              className="animate-pulse"
            />
            
            {/* Sparkle core center */}
            <circle cx="16" cy="16.5" r="1" fill="white" />
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex items-center gap-1.5 font-display">
          <span className={`font-extrabold text-lg tracking-tight ${invertText ? 'text-white' : 'text-slate-900'}`}>
            Resume
          </span>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Copilot
          </span>
          <span className="px-1.5 border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-[7px] uppercase font-bold tracking-widest rounded-md font-mono relative -top-0.5">
            AI
          </span>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Network } from 'lucide-react';

export function Logo({ className = "", showText = true, invertText = false }: { className?: string, showText?: boolean, invertText?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1A66FF] to-indigo-600 flex items-center justify-center shadow-md">
        <Network className="w-5 h-5 text-white" />
      </div>
      {showText && (
        <span className={`font-extrabold text-xl tracking-tight ${invertText ? 'text-white' : 'text-black'}`}>
          Resume <span className={`${invertText ? 'text-gray-300' : 'text-gray-500'} font-medium`}>Copilot</span>
        </span>
      )}
    </div>
  );
}

import React from 'react';
import { useSEO } from '../utils/useSEO';

export default function AboutPage() {
  useSEO({
    title: 'About Us - Resume Copilot AI',
    description: 'Learn about our mission to level the playing field for job seekers by reverse-engineering enterprise ATS filters and leveraging semantic AI analysis.',
    keywords: 'about resume copilot, ats resume engine mission, developer resume optimization tech',
    ogImage: 'https://www.atsai.pro/landing_page.png'
  });
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-[#030712] text-slate-100 py-24 px-6 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="container mx-auto max-w-3xl relative z-10">
        <h1 className="text-4xl md:text-5xl font-black mb-10 tracking-tight text-white">
          About <span className="text-gradient">Resume Copilot</span>
        </h1>
        
        <div className="prose prose-lg max-w-none text-slate-400 space-y-6">
           <p className="text-lg md:text-xl leading-relaxed text-slate-200 font-medium mb-8">
             We believe that brilliant candidates shouldn't be rejected by algorithms just because they didn't format a PDF correctly.
           </p>

           <h3 className="text-xl font-bold text-white mt-12 mb-3">The Problem</h3>
           <p className="leading-relaxed text-sm md:text-base">
             Modern hiring is broken. Over 75% of resumes are rejected by Applicant Tracking Systems (ATS) before a human ever sets eyes on them. It's no longer just about your experience; it's about parser-friendly formatting and playing a game with rigid software.
           </p>

           <h3 className="text-xl font-bold text-white mt-12 mb-3">Our Mission</h3>
           <p className="leading-relaxed text-sm md:text-base">
             We built Resume Copilot to level the playing field. By reverse-engineering enterprise ATS platforms like Workday, Taleo, and Greenhouse, and coupling them with Google's Gemini AI, we give candidates the exact insights they need to pass screening filters.
           </p>
           
           <h3 className="text-xl font-bold text-white mt-12 mb-3">Our Tech</h3>
           <p className="leading-relaxed text-sm md:text-base">
             We don't just do simple regex substring matching. Our analysis engine processes your resume semantically against the provided job description. It understands that a "React UI Developer" satisfies the requirement for a "Frontend Engineer", identifying deep contextual matches that traditional parsers miss or penalize.
           </p>
        </div>
      </div>
    </div>
  );
}

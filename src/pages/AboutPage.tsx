import React from 'react';

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-white text-black py-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-5xl font-extrabold mb-10 tracking-tight">About Resume Copilot</h1>
        
        <div className="prose prose-lg max-w-none text-gray-600">
           <p className="text-xl leading-relaxed text-black font-medium mb-8">
             We believe that brilliant candidates shouldn't be rejected by algorithms just because they didn't format a PDF correctly.
           </p>

           <h3 className="text-2xl font-bold text-black mt-12 mb-4">The Problem</h3>
           <p>
             Modern hiring is broken. Over 75% of resumes are rejected by Applicant Tracking Systems (ATS) before a human ever sets eyes on them. It's no longer just about your experience; it's about semantic keyword densities, parser-friendly formatting, and playing a game with rigid software.
           </p>

           <h3 className="text-2xl font-bold text-black mt-12 mb-4">Our Mission</h3>
           <p>
             We built Resume Copilot to level the playing field. By reverse-engineering enterprise ATS platforms like Workday, Taleo, and Greenhouse, and coupling it with Google's Gemini AI, we give candidates the exact insights they need to pass the screening filters.
           </p>
           
           <h3 className="text-2xl font-bold text-black mt-12 mb-4">Our Tech</h3>
           <p>
             We don't just do simple regex substring matching. Our analysis engine processes your resume semantically against the provided job description. It understands that a "React UI Developer" satisfies the requirement for a "Frontend Engineer", identifying deep contextual matches that traditional parsers miss or penalize.
           </p>
        </div>
      </div>
    </div>
  );
}

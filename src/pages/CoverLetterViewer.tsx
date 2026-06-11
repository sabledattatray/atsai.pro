import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, CheckCircle2, FileText, Sparkles, Zap, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { coverLetterTemplates, slugify } from '../data/coverLetters';
import { generateCoverLetter, CoverLetterStyle, getBaseRole } from '../utils/coverLetterGenerator';

export default function CoverLetterViewer() {
  const { slug } = useParams<{ slug: string }>();
  const [templateName, setTemplateName] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<CoverLetterStyle>('Professional');
  const [content, setContent] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Form State
  const [companyName, setCompanyName] = useState('[Company Name]');
  const [candidateName, setCandidateName] = useState('[Your Name]');

  useEffect(() => {
    if (slug) {
      const match = coverLetterTemplates.find(t => slugify(t) === slug);
      if (match) {
        setTemplateName(match);
      } else {
        // Fallback if not found perfectly
        setTemplateName(slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
      }
    }
  }, [slug]);

  useEffect(() => {
    if (templateName) {
      const role = getBaseRole(templateName);
      setContent(generateCoverLetter(role, selectedStyle, companyName, candidateName));
    }
  }, [templateName, selectedStyle, companyName, candidateName]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStyleIcon = (style: CoverLetterStyle) => {
    switch(style) {
      case 'Professional': return <Briefcase className="w-4 h-4" />;
      case 'Creative': return <Sparkles className="w-4 h-4" />;
      case 'Modern': return <Zap className="w-4 h-4" />;
    }
  };

  if (!templateName) {
    return <div className="p-20 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 max-w-5xl py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{templateName}</h1>
              <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">AI-Generated Template Versions</p>
            </div>
          </div>
          <Button onClick={handleCopy} className="gap-2 shrink-0 bg-black hover:bg-gray-800">
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl mt-8 flex flex-col lg:flex-row gap-8">
        
        {/* Controls Sidebar */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-widest">Personalize Variables</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Target Company</label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#1A66FF] focus:border-transparent outline-none"
                  placeholder="e.g. Google, Apple, etc."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Your Name</label>
                <input 
                  type="text" 
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#1A66FF] focus:border-transparent outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-widest">Select Tone & Style</h3>
            </div>
            <div className="flex flex-col p-2 space-y-1">
              {(['Professional', 'Creative', 'Modern'] as CoverLetterStyle[]).map(style => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors font-medium text-sm ${selectedStyle === style ? 'bg-blue-50 text-[#1A66FF] border border-blue-100' : 'text-gray-600 hover:bg-gray-100 border border-transparent'}`}
                >
                  <div className={`p-1.5 rounded-md ${selectedStyle === style ? 'bg-[#1A66FF] text-white shadow-sm' : 'bg-gray-200 text-gray-500'}`}>
                    {getStyleIcon(style)}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{style}</div>
                    <div className="text-[10px] opacity-70">
                      {style === 'Professional' && "Formal, structured, and traditional."}
                      {style === 'Creative' && "Story-driven, passionate, unique."}
                      {style === 'Modern' && "Punchy, confident, results-focused."}
                    </div>
                  </div>
                  {selectedStyle === style && <CheckCircle2 className="w-4 h-4 text-[#1A66FF]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Paper View */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-200 overflow-hidden">
            <div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
               <div className="ml-4 text-xs text-gray-400 font-mono flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> preview.txt
               </div>
            </div>
            <div className="p-8 sm:p-12 font-serif text-gray-800 leading-relaxed whitespace-pre-wrap text-[15px]">
               {content}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

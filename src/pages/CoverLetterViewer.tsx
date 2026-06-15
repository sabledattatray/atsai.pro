import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Copy, CheckCircle2, FileText, Sparkles, Zap, Briefcase, Camera, Trash2, Printer, Download, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { coverLetterTemplates, slugify } from '../data/coverLetters';
import { generateCoverLetter, CoverLetterStyle, getBaseRole, CoverLetterStructuredContent } from '../utils/coverLetterGenerator';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image-more';
import { jsPDF } from 'jspdf';

type ColorTheme = 'classic' | 'navy' | 'emerald' | 'burgundy';

const THEME_COLORS = {
  classic: { bg: 'bg-white', text: 'text-gray-900', border: 'border-gray-200', accent: 'text-gray-800' },
  navy: { bg: 'bg-[#0A192F]', text: 'text-white', border: 'border-[#172A45]', accent: 'text-blue-400' },
  emerald: { bg: 'bg-[#064e3b]', text: 'text-white', border: 'border-[#065f46]', accent: 'text-emerald-400' },
  burgundy: { bg: 'bg-[#4c0519]', text: 'text-white', border: 'border-[#701a2f]', accent: 'text-rose-400' },
};

export default function CoverLetterViewer() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const initialTheme = (searchParams.get('theme') || 'light') as 'light' | 'dark';
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);

  const [templateName, setTemplateName] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<CoverLetterStyle>('Professional');
  const [content, setContent] = useState<CoverLetterStructuredContent | null>(null);
  const [copied, setCopied] = useState(false);

  // Styling & Options
  const [colorTheme, setColorTheme] = useState<ColorTheme>('classic');
  const [headshotUrl, setHeadshotUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (slug) {
      const match = coverLetterTemplates.find(t => slugify(t) === slug);
      if (match) {
        setTemplateName(match);
      } else {
        setTemplateName(slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
      }
    }
  }, [slug]);

  useEffect(() => {
    if (templateName) {
      const role = getBaseRole(templateName);
      setContent(generateCoverLetter(role, selectedStyle, '[Company Name]', '[Your Name]'));
    }
  }, [templateName, selectedStyle]);

  // Auto-resize body textarea
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.style.height = 'inherit';
      bodyRef.current.style.height = `${bodyRef.current.scrollHeight}px`;
    }
  }, [content?.body]);

  const handleCopy = () => {
    if (!content) return;
    const fullText = `${content.applicantDetails}\n\n${content.recipientDetails}\n\n${content.greeting}\n\n${content.body}\n\n${content.signOff}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pdfRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handlePrint = async () => {
    const element = pdfRef.current;
    if (!element) return;
    
    try {
      setIsGeneratingPdf(true);
      await new Promise(resolve => setTimeout(resolve, 100)); // allow React to render the spinner
      
      const scale = 2; // High resolution
      
      const targetWidth = element.offsetWidth;
      const targetHeight = element.offsetHeight;
      
      const dataUrl = await domtoimage.toJpeg(element, {
        quality: 1.0,
        height: targetHeight * scale,
        width: targetWidth * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: targetWidth + 'px',
          height: targetHeight + 'px',
          margin: '0',
          padding: '0'
        }
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (targetHeight * pdfWidth) / targetWidth;
      
      pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${templateName?.replace(/\s+/g, '_') || 'Cover_Letter'}.pdf`);
    } catch (e) {
      console.error('Error generating PDF:', e);
      alert('Could not generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeadshotUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getStyleIcon = (style: CoverLetterStyle) => {
    switch(style) {
      case 'Professional': return <Briefcase className="w-4 h-4" />;
      case 'Creative': return <Sparkles className="w-4 h-4" />;
      case 'Modern': return <Zap className="w-4 h-4" />;
    }
  };

  const updateContent = (field: keyof CoverLetterStructuredContent, value: string) => {
    setContent(prev => prev ? { ...prev, [field]: value } : null);
  };

  // Adjust textarea height on change
  const handleTextareaChange = (field: keyof CoverLetterStructuredContent, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateContent(field, e.target.value);
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  if (!templateName || !content) {
    return <div className="p-20 text-center">Loading...</div>;
  }

  const getHeaderThemeClasses = () => {
    if (theme === 'dark' && colorTheme === 'classic') {
      return {
        bg: 'bg-slate-950',
        text: 'text-white',
        border: 'border-slate-800',
        accent: 'text-slate-400'
      };
    }
    return THEME_COLORS[colorTheme];
  };

  const themeClasses = getHeaderThemeClasses();

  return (
    <div className={`min-h-screen pb-24 print:bg-white print:pb-0 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0f172a] text-slate-100' : 'bg-[#F8F9FA] text-gray-900'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-30 print:hidden transition-colors duration-300 border-b ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className="container mx-auto px-4 max-w-7xl py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-350' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{templateName} Editor</h1>
              <p className={`text-xs font-medium tracking-wide ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Edit exactly what you want, directly on the page.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Quick theme toggler */}
            <div className={`flex p-0.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-200'}`}>
               <button 
                 onClick={() => setTheme('light')} 
                 className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${theme === 'light' ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-800'}`}
               >
                  <Sun className="w-3.5 h-3.5" /> Light
               </button>
               <button 
                 onClick={() => setTheme('dark')} 
                 className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${theme === 'dark' ? 'bg-slate-900 shadow text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-300'}`}
               >
                  <Moon className="w-3.5 h-3.5" /> Dark
               </button>
            </div>

            <Button variant="outline" onClick={handlePrint} className={`gap-2 ${theme === 'dark' ? 'border-slate-750 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white' : ''}`} disabled={isGeneratingPdf}>
              {isGeneratingPdf ? <CheckCircle2 className="w-4 h-4 animate-pulse" /> : <Download className="w-4 h-4" />}
              {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
            </Button>
            <Button onClick={handleCopy} className={`gap-2 ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-750 text-white' : 'bg-black hover:bg-gray-800'}`}>
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-8 flex flex-col lg:flex-row gap-8 lg:items-start">
        
        {/* Controls Sidebar */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6 print:hidden sticky top-32">
          
          <div className={`rounded-xl shadow-sm border overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-850' : 'bg-white border-gray-200'}`}>
            <div className={`p-4 border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-gray-50 border-gray-100'}`}>
              <h3 className={`font-bold text-sm tracking-wide ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Writing Style</h3>
            </div>
            <div className="flex flex-col p-2 space-y-1">
              {(['Professional', 'Creative', 'Modern'] as CoverLetterStyle[]).map(style => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors font-medium text-sm ${selectedStyle === style ? (theme === 'dark' ? 'bg-blue-950/30 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-[#1A66FF] border border-blue-100') : (theme === 'dark' ? 'text-slate-350 hover:bg-slate-800 border border-transparent' : 'text-gray-600 hover:bg-gray-100 border border-transparent')}`}
                >
                  <div className={`p-1.5 rounded-md ${selectedStyle === style ? (theme === 'dark' ? 'bg-blue-600 text-white shadow-sm' : 'bg-[#1A66FF] text-white shadow-sm') : (theme === 'dark' ? 'bg-slate-800 text-slate-500' : 'bg-gray-200 text-gray-500')}`}>
                    {getStyleIcon(style)}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{style}</div>
                  </div>
                  {selectedStyle === style && <CheckCircle2 className="w-4 h-4 text-[#1A66FF]" />}
                </button>
              ))}
            </div>
          </div>

          <div className={`rounded-xl shadow-sm border overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-850' : 'bg-white border-gray-200'}`}>
            <div className={`p-4 border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-gray-50 border-gray-100'}`}>
              <h3 className={`font-bold text-sm tracking-wide ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Color Theme</h3>
            </div>
            <div className="p-4 grid grid-cols-4 gap-3">
              {(Object.keys(THEME_COLORS) as ColorTheme[]).map((themeVal) => (
                <button
                  key={themeVal}
                  onClick={() => setColorTheme(themeVal)}
                  className={`aspect-square rounded-full border-2 transition-all ${colorTheme === themeVal ? 'ring-2 ring-offset-2 ring-[#1A66FF] border-white' : 'border-transparent hover:scale-105'}`}
                  style={{
                    backgroundColor: themeVal === 'classic' ? '#ffffff' : (themeVal === 'navy' ? '#0A192F' : (themeVal === 'emerald' ? '#064e3b' : '#4c0519')),
                    boxShadow: themeVal === 'classic' ? 'inset 0 0 0 1px #e5e7eb' : 'none'
                  }}
                  title={themeVal}
                />
              ))}
            </div>
          </div>

          <div className={`rounded-xl shadow-sm border overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-850' : 'bg-white border-gray-200'}`}>
            <div className={`p-4 border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-gray-50 border-gray-100'}`}>
              <h3 className={`font-bold text-sm tracking-wide ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Headshot Image</h3>
            </div>
            <div className="p-4 flex flex-col items-center gap-3">
              {headshotUrl ? (
                <div className="relative group">
                  <img src={headshotUrl} alt="Headshot" className={`w-24 h-24 rounded-full object-cover border shadow-sm ${theme === 'dark' ? 'border-slate-750' : 'border-gray-200'}`} />
                  <button 
                    onClick={() => setHeadshotUrl(null)}
                    className="absolute inset-0 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-24 h-24 rounded-full border-2 border-dashed flex flex-col items-center justify-center transition-colors ${theme === 'dark' ? 'border-slate-700 text-slate-500 hover:text-blue-400 hover:border-blue-500 hover:bg-blue-950/20' : 'border-gray-300 text-gray-500 hover:text-[#1A66FF] hover:border-[#1A66FF] hover:bg-blue-50'}`}
                >
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                </button>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>

        </div>

        {/* Paper View - Fully Editable */}
        <div className="w-full lg:flex-1">
          <div id="cover-letter-content" ref={pdfRef} className={`rounded-xl overflow-hidden transition-colors duration-300 print:shadow-none print:border-none print:m-0 print:p-0 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
            
            {/* Header portion with colored background option */}
            <div className={`p-8 sm:p-14 border-b ${themeClasses.border} flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between ${themeClasses.bg} ${themeClasses.text}`}>
              <div className="flex-1 w-full">
                <textarea 
                  value={content.applicantDetails}
                  onChange={(e) => handleTextareaChange('applicantDetails', e)}
                  spellCheck={false}
                  className={`w-full bg-transparent resize-none outline-none font-sans leading-relaxed focus:ring-1 focus:ring-blue-500/50 rounded overflow-hidden text-inherit ${colorTheme !== 'classic' ? 'placeholder-white/50' : 'placeholder-gray-400'}`}
                  rows={content.applicantDetails.split('\n').length}
                />
              </div>
              {headshotUrl && (
                <div className="shrink-0">
                  <img src={headshotUrl} alt="Applicant Headshot" className={`w-28 h-28 rounded-full object-cover border-4 shadow-sm ${colorTheme !== 'classic' ? 'border-white/20' : 'border-white'}`} style={{ boxShadow: colorTheme === 'classic' ? '0 4px 14px rgba(0,0,0,0.08)' : 'none' }} />
                </div>
              )}
            </div>

            {/* Main content area */}
            <div className={`p-8 sm:p-14 pt-8 font-serif leading-relaxed text-[15px] flex flex-col gap-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-gray-800'}`}>
              
              <textarea 
                value={content.recipientDetails}
                onChange={(e) => handleTextareaChange('recipientDetails', e)}
                spellCheck={false}
                className="w-full bg-transparent resize-none outline-none focus:ring-1 focus:ring-blue-500/50 rounded overflow-hidden text-inherit"
                rows={content.recipientDetails.split('\n').length}
              />

              <input 
                value={content.greeting}
                onChange={(e) => updateContent('greeting', e.target.value)}
                spellCheck={false}
                className="w-full bg-transparent outline-none focus:ring-1 focus:ring-blue-500/50 rounded font-bold text-inherit"
              />

              <textarea 
                ref={bodyRef}
                value={content.body}
                onChange={(e) => handleTextareaChange('body', e)}
                spellCheck={false}
                className="w-full bg-transparent resize-none outline-none focus:ring-1 focus:ring-blue-500/50 rounded overflow-hidden leading-relaxed text-inherit"
                rows={Math.max(10, content.body.split('\n').length)}
              />

              <textarea 
                value={content.signOff}
                onChange={(e) => handleTextareaChange('signOff', e)}
                spellCheck={false}
                className="w-full bg-transparent resize-none outline-none focus:ring-1 focus:ring-blue-500/50 rounded overflow-hidden mt-4 text-inherit"
                rows={content.signOff.split('\n').length}
              />

            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}

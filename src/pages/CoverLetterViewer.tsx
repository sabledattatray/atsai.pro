import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, CheckCircle2, FileText, Sparkles, Zap, Briefcase, Camera, Trash2, Printer, Download } from 'lucide-react';
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
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const scale = 2; // High resolution
      const dataUrl = await domtoimage.toJpeg(element, {
        quality: 1.0,
        height: element.offsetHeight * scale,
        width: element.offsetWidth * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: element.offsetWidth + 'px',
          height: element.offsetHeight + 'px'
        }
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate margins and dimensions
      const margin = 10;
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const availableWidth = pdfWidth - margin * 2;
      const imgHeight = (element.offsetHeight * availableWidth) / element.offsetWidth;
      
      pdf.addImage(dataUrl, 'JPEG', margin, margin, availableWidth, imgHeight);
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

  const themeClasses = THEME_COLORS[colorTheme];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 print:bg-white print:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 print:hidden">
        <div className="container mx-auto px-4 max-w-7xl py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{templateName} Editor</h1>
              <p className="text-xs text-gray-500 font-medium tracking-wide">Edit exactly what you want, directly on the page.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handlePrint} className="gap-2" disabled={isGeneratingPdf}>
              {isGeneratingPdf ? <CheckCircle2 className="w-4 h-4 animate-pulse" /> : <Download className="w-4 h-4" />}
              {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
            </Button>
            <Button onClick={handleCopy} className="gap-2 bg-black hover:bg-gray-800">
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-8 flex flex-col lg:flex-row gap-8 lg:items-start">
        
        {/* Controls Sidebar */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6 print:hidden sticky top-32">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900 text-sm tracking-wide">Writing Style</h3>
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
                  </div>
                  {selectedStyle === style && <CheckCircle2 className="w-4 h-4 text-[#1A66FF]" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900 text-sm tracking-wide">Color Theme</h3>
            </div>
            <div className="p-4 grid grid-cols-4 gap-3">
              {(Object.keys(THEME_COLORS) as ColorTheme[]).map((theme) => (
                <button
                  key={theme}
                  onClick={() => setColorTheme(theme)}
                  className={`aspect-square rounded-full border-2 transition-all ${colorTheme === theme ? 'ring-2 ring-offset-2 ring-[#1A66FF] border-white' : 'border-transparent hover:scale-105'}`}
                  style={{
                    backgroundColor: theme === 'classic' ? '#ffffff' : (theme === 'navy' ? '#0A192F' : (theme === 'emerald' ? '#064e3b' : '#4c0519')),
                    boxShadow: theme === 'classic' ? 'inset 0 0 0 1px #e5e7eb' : 'none'
                  }}
                  title={theme}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900 text-sm tracking-wide">Headshot Image</h3>
            </div>
            <div className="p-4 flex flex-col items-center gap-3">
              {headshotUrl ? (
                <div className="relative group">
                  <img src={headshotUrl} alt="Headshot" className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm" />
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
                  className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:text-[#1A66FF] hover:border-[#1A66FF] hover:bg-blue-50 transition-colors"
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
          <div ref={pdfRef} className="bg-white rounded-xl overflow-hidden transition-colors duration-300 print:shadow-none print:border-none print:m-0 print:p-0 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-200">
            
            {/* Header portion with colored background option */}
            <div className={`p-8 sm:p-14 border-b ${themeClasses.border} flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between ${themeClasses.bg} ${themeClasses.text}`}>
              <div className="flex-1 w-full">
                <textarea 
                  value={content.applicantDetails}
                  onChange={(e) => handleTextareaChange('applicantDetails', e)}
                  spellCheck={false}
                  className={`w-full bg-transparent resize-none outline-none font-sans leading-relaxed focus:ring-1 focus:ring-blue-500/50 rounded overflow-hidden ${colorTheme !== 'classic' ? 'text-white placeholder-white/50' : 'text-gray-900'}`}
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
            <div className="p-8 sm:p-14 pt-8 font-serif leading-relaxed text-[15px] flex flex-col gap-6 text-gray-800 bg-white">
              
              <textarea 
                value={content.recipientDetails}
                onChange={(e) => handleTextareaChange('recipientDetails', e)}
                spellCheck={false}
                className="w-full bg-transparent resize-none outline-none focus:ring-1 focus:ring-blue-500/50 rounded overflow-hidden"
                rows={content.recipientDetails.split('\n').length}
              />

              <input 
                value={content.greeting}
                onChange={(e) => updateContent('greeting', e.target.value)}
                spellCheck={false}
                className="w-full bg-transparent outline-none focus:ring-1 focus:ring-blue-500/50 rounded font-bold"
              />

              <textarea 
                ref={bodyRef}
                value={content.body}
                onChange={(e) => handleTextareaChange('body', e)}
                spellCheck={false}
                className="w-full bg-transparent resize-none outline-none focus:ring-1 focus:ring-blue-500/50 rounded overflow-hidden leading-relaxed"
                rows={Math.max(10, content.body.split('\n').length)}
              />

              <textarea 
                value={content.signOff}
                onChange={(e) => handleTextareaChange('signOff', e)}
                spellCheck={false}
                className="w-full bg-transparent resize-none outline-none focus:ring-1 focus:ring-blue-500/50 rounded overflow-hidden mt-4"
                rows={content.signOff.split('\n').length}
              />

            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}

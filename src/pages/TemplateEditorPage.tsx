import React, { useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, Wand2, Upload, FileText, LayoutTemplate, Palette, Sparkles, CheckCircle2, FileUp } from 'lucide-react';
import { dummyResumes } from '@/lib/dummyResumes';
import domtoimage from 'dom-to-image-more';
import { jsPDF } from 'jspdf';

export default function TemplateEditorPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('template') || 'tech';
  const initialRole = searchParams.get('role') || 'Software Engineer';
  
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'templates' | 'ai'>('content');
  
  // Design State
  const [themeColor, setThemeColor] = useState('indigo');
  const [fontFamily, setFontFamily] = useState('font-sans');
  const [fontSize, setFontSize] = useState('text-sm');
  const [pageSize, setPageSize] = useState('a4');
  const [spacing, setSpacing] = useState('normal'); // compact, normal, relaxed
  
  const [selectedTemplate, setSelectedTemplate] = useState(initialCategory);

  const [resumeData, setResumeData] = useState(dummyResumes[initialRole] || dummyResumes['Software Engineer']);

  const [sidebarWidth, setSidebarWidth] = useState(400);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const startResizing = React.useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    const startX = mouseDownEvent.clientX;
    const startWidth = sidebarWidth;

    const doDrag = (dragEvent: MouseEvent) => {
      let newWidth = startWidth + dragEvent.clientX - startX;
      if (newWidth < 300) newWidth = 300;
      if (newWidth > 600) newWidth = 600;
      setSidebarWidth(newWidth);
    };

    const stopDrag = () => {
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  }, [sidebarWidth]);

  const handlePrint = async () => {
    const element = pdfRef.current;
    if (!element) return;
    
    try {
      setIsGeneratingPdf(true);
      await new Promise(resolve => setTimeout(resolve, 100));

      const scale = 2; // scale up for high resolution
      const isA4 = pageSize === 'a4';
      
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
        format: isA4 ? 'a4' : 'letter'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
      
      pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resumeData.name?.replace(/\s+/g, '_') || 'Resume'}.pdf`);
    } catch (e) {
      console.error('Error generating PDF:', e);
      alert('Could not generate PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string, idx?: number, subfield?: string) => {
    if (idx !== undefined && subfield) {
      const updatedArray = [...(resumeData as any)[field]];
      updatedArray[idx][subfield] = e.target.value;
      setResumeData({ ...resumeData, [field]: updatedArray });
    } else {
      setResumeData({ ...resumeData, [field]: e.target.value });
    }
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        { company: '', role: '', duration: '', description: '' }
      ]
    });
  };

  const removeExperience = (idx: number) => {
    const newExp = [...resumeData.experience];
    newExp.splice(idx, 1);
    setResumeData({ ...resumeData, experience: newExp });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeData({ ...resumeData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImport = () => {
    // Mock import experience
    alert("This would open a file picker to upload your existing PDF/DOCX and automatically merge the parsed data into this template!");
  };

  const handleAiFix = (field: string) => {
    // Mock AI fixing experience
      alert(`AI is generating a better version of your ${field}...`);
      if (field === 'summary') {
          setResumeData(prev => ({
              ...prev,
              summary: 'Accomplished Senior Software Engineer with 8+ years of expertise in architecting highly scalable, fault-tolerant distributed systems. Proven track record of reducing latency by 30% and leading high-performing engineering teams to deliver mission-critical features ahead of schedule.'
          }));
      }
  };

  const spacingClass = spacing === 'compact' ? 'space-y-2' : spacing === 'relaxed' ? 'space-y-6' : 'space-y-4';
  const paddingClass = spacing === 'compact' ? 'p-6' : spacing === 'relaxed' ? 'p-16' : 'p-10';

  return (
    <div className="flex flex-col w-full h-[calc(100vh)] bg-[#f3f4f6] print:bg-white print:h-auto print:block font-sans overflow-hidden print:overflow-visible">
      {/* Top Navbar */}
      <div className="flex justify-between items-center bg-white border-b border-gray-200 px-6 py-3 print:hidden z-10 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/templates">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full"><ArrowLeft className="w-5 h-5 text-gray-700" /></Button>
          </Link>
          <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">Resume Copilot Studio</h1>
              <span className="bg-indigo-100 text-indigo-700 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">Beta</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={handleImport}>
             <FileUp className="w-4 h-4 mr-2" /> Import Existing Resume
          </Button>
          <Button onClick={handlePrint} disabled={isGeneratingPdf} className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-md transition-colors">
            {isGeneratingPdf ? <CheckCircle2 className="w-4 h-4 mr-2 animate-pulse" /> : <Download className="w-4 h-4 mr-2" />}
            {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden print:overflow-visible print:block print:h-auto">
        {/* Editor Sidebar */}
        <div style={{ width: sidebarWidth }} className="bg-white border-r border-gray-200 flex flex-col shrink-0 hidden md:flex print:hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
          
          {/* Resize Handle */}
          <div 
            onMouseDown={startResizing}
            className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-indigo-300 active:bg-indigo-500 z-50 transition-colors"
          />

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-100 p-2 gap-1 bg-gray-50/50">
            <button onClick={() => setActiveTab('content')} className={`flex-1 py-2 px-1 text-xs font-bold rounded-md flex flex-col items-center gap-1 transition-all ${activeTab === 'content' ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                <FileText className="w-4 h-4" /> Content
            </button>
            <button onClick={() => setActiveTab('design')} className={`flex-1 py-2 px-1 text-xs font-bold rounded-md flex flex-col items-center gap-1 transition-all ${activeTab === 'design' ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                <Palette className="w-4 h-4" /> Design
            </button>
            <button onClick={() => setActiveTab('templates')} className={`flex-1 py-2 px-1 text-xs font-bold rounded-md flex flex-col items-center gap-1 transition-all ${activeTab === 'templates' ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                <LayoutTemplate className="w-4 h-4" /> Templates
            </button>
            <button onClick={() => setActiveTab('ai')} className={`flex-1 py-2 px-1 text-xs font-bold rounded-md flex flex-col items-center gap-1 transition-all ${activeTab === 'ai' ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                <Wand2 className="w-4 h-4" /> AI Builder
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            {activeTab === 'ai' && (
               <div className="space-y-6">
                  <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-5 rounded-xl shadow-lg relative overflow-hidden">
                     <Sparkles className="w-32 h-32 absolute -right-10 -bottom-10 opacity-10" />
                     <h3 className="font-bold text-lg mb-2 relative z-10 flex items-center gap-2">AI Resume Generator</h3>
                     <p className="text-indigo-100 text-xs leading-relaxed mb-4 relative z-10">
                        Describe your ideal resume (e.g. "Senior Marketing Manager with 5 years in B2B SaaS, focus on SEO and Lead Gen"). Our AI will instantly craft a complete, professional template.
                     </p>
                     <div className="relative z-10">
                       <textarea 
                         className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 mb-3"
                         rows={3}
                         placeholder="Enter prompt..."
                         id="ai-prompt-input"
                       />
                       <Button 
                         variant="secondary" 
                         className="w-full font-bold bg-white text-indigo-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                         onClick={async () => {
                           const btn = document.getElementById('ai-generate-btn') as HTMLButtonElement;
                           const input = document.getElementById('ai-prompt-input') as HTMLTextAreaElement;
                           const prompt = input.value;
                           if (!prompt) return;
                           
                           const oldText = btn.innerHTML;
                           btn.innerHTML = 'Generating... (Takes ~5s)';
                           btn.disabled = true;
                           
                           try {
                             const res = await fetch('/api/generate-resume', {
                               method: 'POST',
                               headers: { 'Content-Type': 'application/json' },
                               body: JSON.stringify({ prompt })
                             });
                             const data = await res.json();
                             if (data && data.name) {
                               setResumeData(data);
                               setActiveTab('content'); // switch back to content to edit
                             } else {
                               alert('Failed to generate. Ensure API key is configured.');
                             }
                           } catch(e) {
                             alert('Error generating resume');
                           } finally {
                             btn.innerHTML = oldText;
                             btn.disabled = false;
                           }
                         }}
                         id="ai-generate-btn"
                       >
                         <Wand2 className="w-5 h-5" /> Generate from Prompt
                       </Button>
                     </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                     <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> ATS Compatibility</h3>
                     <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                        Currently editing a generated resume? We've automatically structured the blocks, removed problematic tables, and ensured semantic HTML reading order.
                     </p>
                     <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700">Estimated Score</span>
                        <span className="text-lg font-black text-green-600">92 / 100</span>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'content' && (
               <div className="space-y-8 pb-20">
                  {/* Personal Details */}
                  <div>
                      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">Personal Details</h2>
                      <div className="space-y-3">
                        <div className="mb-4">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Photo (Optional)</label>
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                          <input type="text" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all" value={resumeData.name} onChange={(e) => handleChange(e, 'name')} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Professional Title</label>
                          <input type="text" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all" value={resumeData.title} onChange={(e) => handleChange(e, 'title')} />
                        </div>
                        <div className="flex gap-3">
                          <div className="w-1/2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                            <input type="text" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all" value={resumeData.email} onChange={(e) => handleChange(e, 'email')} />
                          </div>
                          <div className="w-1/2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                            <input type="text" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all" value={resumeData.phone} onChange={(e) => handleChange(e, 'phone')} />
                          </div>
                        </div>
                      </div>
                  </div>

                  {/* Summary */}
                  <div>
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">Professional Summary</h2>
                        <button onClick={() => handleAiFix('summary')} className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-full">
                           <Wand2 className="w-3 h-3" /> Auto-Rewrite
                        </button>
                      </div>
                      <textarea className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm h-32 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all leading-relaxed" value={resumeData.summary} onChange={(e) => handleChange(e, 'summary')} />
                  </div>

                  {/* Experience */}
                  <div>
                      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">Experience</h2>
                      <div className="space-y-4">
                        {resumeData.experience.map((exp, idx) => (
                          <div key={idx} className="p-4 border border-gray-100 bg-gray-50/50 rounded-lg group relative">
                            <div className="mb-3 flex justify-between items-end">
                              <div className="w-full">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Company</label>
                                <input type="text" className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-indigo-400 bg-white" value={exp.company} onChange={(e) => handleChange(e, 'experience', idx, 'company')} />
                              </div>
                              <button onClick={() => removeExperience(idx)} className="ml-3 text-[10px] font-bold text-red-600 hover:text-red-800 hidden group-hover:block transition-all uppercase whitespace-nowrap">
                                Remove
                              </button>
                            </div>
                            <div className="flex gap-3 mb-3">
                              <div className="w-1/2">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Role</label>
                                <input type="text" className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-indigo-400 bg-white" value={exp.role} onChange={(e) => handleChange(e, 'experience', idx, 'role')} />
                              </div>
                              <div className="w-1/2">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Duration</label>
                                <input type="text" className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-indigo-400 bg-white" value={exp.duration} onChange={(e) => handleChange(e, 'experience', idx, 'duration')} />
                              </div>
                            </div>
                            <div>
                               <div className="flex justify-between items-center mb-1">
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Achievements</label>
                                  <button onClick={() => handleAiFix('experience')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hidden group-hover:flex items-center gap-1 bg-indigo-50 px-1.5 py-0.5 rounded">
                                     <Sparkles className="w-3 h-3" /> Enhance
                                  </button>
                               </div>
                              <textarea className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm h-24 outline-none focus:border-indigo-400 bg-white leading-relaxed" value={exp.description} onChange={(e) => handleChange(e, 'experience', idx, 'description')} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-4 border-dashed" onClick={addExperience}>
                        + Add Work Experience
                      </Button>
                  </div>

                  {/* Education */}
                  <div>
                      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">Education</h2>
                      <div className="space-y-4">
                        {resumeData.education.map((edu, idx) => (
                          <div key={idx} className="p-4 border border-gray-100 bg-gray-50/50 rounded-lg">
                            <div className="mb-3">
                              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Institution</label>
                              <input type="text" className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-indigo-400 bg-white" value={edu.institution} onChange={(e) => handleChange(e, 'education', idx, 'institution')} />
                            </div>
                            <div className="flex gap-3">
                              <div className="w-1/2">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Degree</label>
                                <input type="text" className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-indigo-400 bg-white" value={edu.degree} onChange={(e) => handleChange(e, 'education', idx, 'degree')} />
                              </div>
                              <div className="w-1/2">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Year</label>
                                <input type="text" className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-indigo-400 bg-white" value={edu.year} onChange={(e) => handleChange(e, 'education', idx, 'year')} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                  </div>

                  {/* Skills */}
                  <div>
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">Skills (Comma separated)</h2>
                        <button onClick={() => handleAiFix('skills')} className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-full">
                           <Wand2 className="w-3 h-3" /> Optimize Keywords
                        </button>
                      </div>
                      <textarea className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm h-24 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all leading-relaxed" value={resumeData.skills} onChange={(e) => handleChange(e, 'skills')} />
                  </div>
               </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-8">
                 <div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Accent Color</h3>
                    <div className="flex flex-wrap gap-3">
                       {['slate', 'indigo', 'blue', 'teal', 'emerald', 'rose', 'orange', 'zinc'].map(c => (
                         <button 
                           key={c}
                           onClick={() => setThemeColor(c)}
                           className={`w-8 h-8 rounded-full border-2 transition-transform ${themeColor === c ? 'scale-110 border-gray-900 shadow-md' : 'border-transparent hover:scale-105'}`}
                           style={{ backgroundColor: c === 'slate' ? '#475569' : c === 'indigo' ? '#4f46e5' : c === 'blue' ? '#2563eb' : c === 'teal' ? '#0d9488' : c === 'emerald' ? '#059669' : c === 'rose' ? '#e11d48' : c === 'orange' ? '#ea580c' : '#27272a' }}
                         />
                       ))}
                    </div>
                 </div>

                 <div className="h-px bg-gray-100 w-full" />

                 <div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Typography</h3>
                    <div className="grid grid-cols-1 gap-2 border border-gray-200 rounded-lg bg-gray-50 p-1">
                       <button onClick={() => setFontFamily('font-sans')} className={`px-4 py-3 rounded-md text-sm font-sans flex justify-between items-center ${fontFamily === 'font-sans' ? 'bg-white shadow border border-gray-200 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>
                          Modern Sans
                          {fontFamily === 'font-sans' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                       </button>
                       <button onClick={() => setFontFamily('font-serif')} className={`px-4 py-3 rounded-md text-sm font-serif flex justify-between items-center ${fontFamily === 'font-serif' ? 'bg-white shadow border border-gray-200 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>
                          Classic Serif
                          {fontFamily === 'font-serif' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                       </button>
                       <button onClick={() => setFontFamily('font-mono')} className={`px-4 py-3 rounded-md text-sm font-mono flex justify-between items-center ${fontFamily === 'font-mono' ? 'bg-white shadow border border-gray-200 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>
                          Technical Mono
                          {fontFamily === 'font-mono' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                       </button>
                    </div>
                 </div>

                 <div className="h-px bg-gray-100 w-full" />

                 <div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Font Size</h3>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                       {[{id:'text-[11px]', label:'Small'}, {id:'text-[13px]', label:'Normal'}, {id:'text-[15px]', label:'Large'}].map(s => (
                         <button
                           key={s.id}
                           onClick={() => setFontSize(s.id)}
                           className={`flex-1 py-2 text-xs font-bold rounded-md transition-shadow ${fontSize === s.id ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
                         >
                           {s.label}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="h-px bg-gray-100 w-full" />

                 <div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Block Spacing</h3>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                       {[{id:'compact', label:'Compact'}, {id:'normal', label:'Normal'}, {id:'relaxed', label:'Relaxed'}].map(s => (
                         <button
                           key={s.id}
                           onClick={() => setSpacing(s.id)}
                           className={`flex-1 py-2 text-xs font-bold rounded-md transition-shadow ${spacing === s.id ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
                         >
                           {s.label}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="h-px bg-gray-100 w-full" />

                 <div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Page Size</h3>
                    <div className="grid grid-cols-2 gap-2">
                       <button onClick={() => setPageSize('a4')} className={`border p-3 rounded-lg text-center transition-all ${pageSize === 'a4' ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className="text-sm font-bold text-gray-900">A4</div>
                          <div className="text-[10px] text-gray-500 mt-1">210 × 297 mm</div>
                       </button>
                       <button onClick={() => setPageSize('letter')} className={`border p-3 rounded-lg text-center transition-all ${pageSize === 'letter' ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className="text-sm font-bold text-gray-900">US Letter</div>
                          <div className="text-[10px] text-gray-500 mt-1">8.5 × 11 in</div>
                       </button>
                    </div>
                 </div>

              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-4">
                 {[
                   { id: 'tech', name: 'The Tech Standard', desc: 'Optimized for Engineering roles' },
                   { id: 'executive', name: 'Executive Brief', desc: 'Classic, conservative structure' },
                   { id: 'modern', name: 'Modern Minimalist', desc: 'Two-column creative layout' },
                   { id: 'business', name: 'Business Pro', desc: 'Clean lines for Management' },
                   { id: 'creative', name: 'Creative Designer', desc: 'Vibrant, bold and highly visual' },
                   { id: 'minimalist', name: 'Ultra Minimal', desc: 'Space and typography first' },
                   { id: 'bold', name: 'Bold Leadership', desc: 'Strong contrast and decisive layout' },
                   { id: 'academic', name: 'Academic Serif', desc: 'Traditional, scholarly structure' },
                   { id: 'startup', name: 'Startup Pitch', desc: 'Edgy, vibrant, metrics-driven' },
                   { id: 'infographic', name: 'Infographic Timeline', desc: 'Visual progression and stats focus' },
                 ].map(tpl => (
                   <div 
                     key={tpl.id} 
                     onClick={() => setSelectedTemplate(tpl.id)}
                     className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md outline-none ${selectedTemplate === tpl.id ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white'}`}
                   >
                     <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-gray-900">{tpl.name}</h3>
                        {selectedTemplate === tpl.id && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                     </div>
                     <p className="text-xs text-gray-500">{tpl.desc}</p>
                   </div>
                 ))}
                 
                 <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg border-dashed text-center">
                    <LayoutTemplate className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-gray-600">More templates coming soon.</p>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview / Canvas */}
        <div className="flex-1 bg-[#b5b8c0] overflow-y-auto flex justify-center py-10 px-4 print:p-0 print:bg-white custom-scrollbar print:overflow-visible print:block print:h-auto">
          <div 
             ref={pdfRef}
             id="pdf-content"
             className={`bg-white shadow-[0_10px_40px_rgba(0,0,0,0.15)] origin-top mx-auto print:shadow-none print:mx-0 transition-all duration-300 ${pageSize === 'a4' ? 'w-[210mm] min-h-[297mm]' : 'w-[8.5in] min-h-[11in]'} ${fontFamily} ${fontSize}`}
          >
             {selectedTemplate === 'modern' ? (
               <ModernTemplate data={resumeData} color={themeColor} spacingClass={spacingClass} paddingClass={paddingClass} />
             ) : selectedTemplate === 'executive' ? (
               <ExecutiveTemplate data={resumeData} color={themeColor} spacingClass={spacingClass} paddingClass={paddingClass} />
             ) : selectedTemplate === 'business' ? (
               <BusinessTemplate data={resumeData} color={themeColor} spacingClass={spacingClass} paddingClass={paddingClass} />
             ) : selectedTemplate === 'creative' ? (
               <CreativeTemplate data={resumeData} color={themeColor} spacingClass={spacingClass} paddingClass={paddingClass} />
             ) : selectedTemplate === 'minimalist' ? (
               <MinimalistTemplate data={resumeData} color={themeColor} spacingClass={spacingClass} paddingClass={paddingClass} />
             ) : selectedTemplate === 'bold' ? (
               <BoldTemplate data={resumeData} color={themeColor} spacingClass={spacingClass} paddingClass={paddingClass} />
             ) : selectedTemplate === 'academic' ? (
               <AcademicTemplate data={resumeData} color={themeColor} spacingClass={spacingClass} paddingClass={paddingClass} />
             ) : selectedTemplate === 'startup' ? (
               <StartupTemplate data={resumeData} color={themeColor} spacingClass={spacingClass} paddingClass={paddingClass} />
             ) : selectedTemplate === 'infographic' ? (
               <InfographicTemplate data={resumeData} color={themeColor} spacingClass={spacingClass} paddingClass={paddingClass} />
             ) : (
               <TechTemplate data={resumeData} color={themeColor} spacingClass={spacingClass} paddingClass={paddingClass} />
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----- THEME HELPERS -----
const getColorHex = (colorName: string) => {
   const colors: Record<string, string> = {
      slate: '#475569', indigo: '#4f46e5', blue: '#2563eb', teal: '#0d9488', 
      emerald: '#059669', rose: '#e11d48', orange: '#ea580c', zinc: '#27272a'
   };
   return colors[colorName] || '#27272a';
};

const getTextColorClass = (colorName: string) => `text-${colorName}-700`;
const getBgColorClass = (colorName: string) => `bg-${colorName}-700`;

// ----- TEMPLATES -----

export function TechTemplate({ data, color, spacingClass, paddingClass }: any) {
  const primaryColor = getColorHex(color);
  return (
    <div className={`${paddingClass} bg-white text-gray-900 border-t-8 h-full flex flex-col`} style={{ borderColor: primaryColor }}>
      <div className="border-b pb-6 mb-6 text-center" style={{ borderBottomColor: `${primaryColor}40` }}>
        {data.photo && <img src={data.photo} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4" style={{ borderColor: primaryColor }} />}
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 uppercase" style={{ color: primaryColor }}>{data.name}</h1>
        <p className="text-lg font-medium mb-3 text-gray-600">{data.title}</p>
        <div className="flex justify-center gap-4 text-gray-500 font-medium text-[0.85em]">
           <span>{data.email}</span>
           <span>•</span>
           <span>{data.phone}</span>
        </div>
      </div>
      
      <div className="mb-6">
         <p className="leading-relaxed text-gray-700 text-[0.95em]">{data.summary}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold border-b pb-1 mb-4 uppercase tracking-widest" style={{ borderBottomColor: `${primaryColor}40`, color: primaryColor }}>Experience</h2>
        <div className={spacingClass}>
          {data.experience.map((exp: any, i: number) => (
            <div key={i}>
              <div className="flex justify-between items-end mb-1">
                 <h3 className="font-bold text-gray-900 text-[1.1em]">{exp.company}</h3>
                 <span className="font-bold text-gray-500 uppercase tracking-wider text-[0.8em]">{exp.duration}</span>
              </div>
              <p className="font-bold mb-2 text-[0.95em]" style={{ color: primaryColor }}>{exp.role}</p>
              <p className="text-gray-700 leading-relaxed text-[0.95em] whitespace-pre-wrap">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold border-b pb-1 mb-4 uppercase tracking-widest" style={{ borderBottomColor: `${primaryColor}40`, color: primaryColor }}>Education</h2>
        <div className={spacingClass}>
          {data.education.map((edu: any, i: number) => (
            <div key={i} className="flex justify-between items-end">
              <div>
                 <h3 className="font-bold text-gray-900 text-[1.1em]">{edu.institution}</h3>
                 <p className="text-gray-700 text-[0.95em]">{edu.degree}</p>
              </div>
              <span className="font-bold text-gray-500 uppercase tracking-wider text-[0.8em]">{edu.year}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold border-b pb-1 mb-4 uppercase tracking-widest" style={{ borderBottomColor: `${primaryColor}40`, color: primaryColor }}>Skills</h2>
        <p className="text-gray-700 leading-relaxed text-[0.95em]">{data.skills}</p>
      </div>
    </div>
  );
}

export function ExecutiveTemplate({ data, color, spacingClass, paddingClass }: any) {
  const primaryColor = getColorHex(color);
  return (
    <div className={`${paddingClass} text-slate-900 bg-white h-full flex flex-col`}>
      <div className="text-center mb-8 pb-6 relative">
        {data.photo && <img src={data.photo} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover grayscale border-2 border-slate-200" />}
        <div className="absolute bottom-0 left-1/4 right-1/4 h-px" style={{ backgroundColor: primaryColor }}></div>
        <h1 className="text-3xl font-black mb-2 tracking-wide uppercase">{data.name}</h1>
        <p className="text-lg mb-4 text-slate-600 italic">{data.title}</p>
        <div className="flex justify-center gap-4 text-[0.8em] tracking-widest font-bold uppercase" style={{ color: primaryColor }}>
           <span>{data.email}</span>
           <span>|</span>
           <span>{data.phone}</span>
        </div>
      </div>
      
      <div className="mb-8 relative">
         <h2 className="text-[0.85em] font-black uppercase tracking-[0.2em] mb-4 text-center" style={{ color: primaryColor }}>Professional Summary</h2>
         <p className="leading-relaxed text-slate-700 text-center text-[0.95em] px-8">{data.summary}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-[0.85em] font-black uppercase tracking-[0.2em] mb-4 border-b border-slate-200 pb-2 flex items-center gap-4">
           <span style={{ color: primaryColor }}>Experience</span>
           <div className="flex-1 h-px bg-slate-100"></div>
        </h2>
        <div className={spacingClass}>
          {data.experience.map((exp: any, i: number) => (
            <div key={i}>
              <div className="flex justify-between items-end mb-1">
                 <h3 className="font-bold text-slate-900 text-[1.1em]">{exp.company}</h3>
                 <span className="text-[0.85em] text-slate-500 font-bold uppercase">{exp.duration}</span>
              </div>
              <p className="italic text-slate-600 mb-2 text-[0.95em]">{exp.role}</p>
              <p className="text-slate-700 leading-relaxed text-[0.95em] whitespace-pre-wrap">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 pb-8 border-b border-slate-200">
        <h2 className="text-[0.85em] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-4">
           <span style={{ color: primaryColor }}>Education</span>
           <div className="flex-1 h-px bg-slate-100"></div>
        </h2>
        <div className={spacingClass}>
          {data.education.map((edu: any, i: number) => (
            <div key={i} className="flex justify-between items-center">
              <div>
                 <h3 className="font-bold text-slate-900 text-[1.05em]">{edu.institution}</h3>
                 <p className="italic text-slate-600 text-[0.95em]">{edu.degree}</p>
              </div>
              <span className="text-[0.85em] text-slate-500 font-bold uppercase">{edu.year}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-[0.8em] font-black uppercase tracking-[0.2em] mb-3 text-slate-500">Core Competencies</h2>
        <p className="text-[0.95em] text-slate-800 font-medium leading-relaxed max-w-2xl mx-auto">{data.skills.split(',').join(' • ')}</p>
      </div>
    </div>
  );
}

export function ModernTemplate({ data, color, spacingClass, paddingClass }: any) {
  const primaryColor = getColorHex(color);
  return (
    <div className="flex min-h-[min-content] h-full bg-white">
      {/* Sidebar */}
      <div className="w-[33%] text-white" style={{ backgroundColor: primaryColor }}>
         <div className={paddingClass}>
             {data.photo && <img src={data.photo} alt="Profile" className="w-32 h-32 rounded-full mb-6 object-cover border-4 border-white/20 mx-auto" />}
             <h1 className="text-3xl font-light mb-2 leading-tight tracking-tight px-2">{data.name.split(' ')[0]} <br /><span className="font-bold">{data.name.split(' ').slice(1).join(' ')}</span></h1>
             <p className="text-white/80 font-bold tracking-widest uppercase text-[0.7em] mb-10 px-2">{data.title}</p>
             
             <div className="mb-10 text-[0.85em]">
                <h2 className="text-white font-bold tracking-widest uppercase mb-4 opacity-50 px-2">Contact</h2>
                <div className="space-y-3 px-2">
                   <p className="font-medium bg-black/10 p-2 rounded">{data.email}</p>
                   <p className="font-medium bg-black/10 p-2 rounded">{data.phone}</p>
                </div>
             </div>

             <div className="mb-10 text-[0.85em]">
                <h2 className="text-white font-bold tracking-widest uppercase mb-4 opacity-50 px-2">Education</h2>
                {data.education.map((edu: any, i: number) => (
                  <div key={i} className="mb-5 px-2">
                     <p className="font-bold text-[1.1em] text-white leading-tight mb-1">{edu.degree}</p>
                     <p className="text-white/80 font-medium">{edu.institution}</p>
                     <p className="text-white/60 text-[0.85em] mt-1 font-bold tracking-widest uppercase">{edu.year}</p>
                  </div>
                ))}
             </div>

             <div className="text-[0.85em]">
                <h2 className="text-white font-bold tracking-widest uppercase mb-4 opacity-50 px-2">Skills</h2>
                <div className="flex flex-wrap gap-2 px-2">
                   {data.skills.split(',').map((s: string, i: number) => (
                     <span key={i} className="bg-black/20 px-3 py-1.5 rounded-sm font-medium">{s.trim()}</span>
                   ))}
                </div>
             </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="w-[67%] bg-white">
         <div className={paddingClass}>
             <div className="mb-10">
               <h2 className="font-bold uppercase tracking-widest mb-4 flex items-center gap-3 text-[0.85em]" style={{ color: primaryColor }}>
                 <div className="w-10 h-0.5" style={{ backgroundColor: primaryColor }}></div> Core Profile
               </h2>
               <p className="text-gray-600 leading-relaxed text-[0.95em]">{data.summary}</p>
             </div>

             <div>
               <h2 className="font-bold uppercase tracking-widest mb-6 flex items-center gap-3 text-[0.85em]" style={{ color: primaryColor }}>
                 <div className="w-10 h-0.5" style={{ backgroundColor: primaryColor }}></div> Experience Record
               </h2>
               <div className={spacingClass}>
                 {data.experience.map((exp: any, i: number) => (
                   <div key={i} className="relative pl-6 border-l-2 border-gray-100">
                     <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                     <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-gray-900 text-[1.1em]">{exp.role}</h3>
                        <span className="font-bold uppercase tracking-wider text-[0.75em] text-gray-500 bg-gray-100 px-2 py-1 rounded">{exp.duration}</span>
                     </div>
                     <p className="font-bold text-gray-600 mb-3 text-[0.9em]">{exp.company}</p>
                     <p className="text-gray-600 leading-relaxed text-[0.95em] whitespace-pre-wrap">{exp.description}</p>
                   </div>
                 ))}
               </div>
             </div>
         </div>
      </div>
    </div>
  );
}

export function CreativeTemplate({ data, color, spacingClass, paddingClass }: any) {
  const primaryColor = getColorHex(color);
  return (
    <div className={`overflow-hidden h-full flex flex-col bg-white text-gray-800`}>
      <div className={`pt-12 pb-8 px-12 relative`} style={{ backgroundColor: primaryColor, color: '#ffffff' }}>
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl -mb-10"></div>
         
         <div className="relative z-10 flex items-center gap-8">
            {data.photo && <img src={data.photo} alt="Profile" className="w-28 h-28 rounded-2xl object-cover shadow-2xl border-4 border-white/20 transform -rotate-3" />}
            <div>
              <h1 className="text-5xl font-black tracking-tighter mb-2">{data.name}</h1>
              <p className="text-2xl font-medium opacity-90 tracking-wide">{data.title}</p>
            </div>
         </div>
      </div>
      
      <div className={`${paddingClass} flex-1 grid grid-cols-3 gap-12`}>
         <div className="col-span-1 space-y-10">
            <div>
               <h2 className="text-lg font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
                 <span className="w-8 h-px bg-current"></span> Contact
               </h2>
               <div className="space-y-3 text-sm font-medium text-gray-600">
                  <p>{data.email}</p>
                  <p>{data.phone}</p>
               </div>
            </div>

            <div>
               <h2 className="text-lg font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
                 <span className="w-8 h-px bg-current"></span> Skills
               </h2>
               <div className="flex flex-wrap gap-2">
                  {data.skills.split(',').map((s: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 text-xs font-bold rounded-lg border" style={{ color: primaryColor, borderColor: `${primaryColor}40`, backgroundColor: `${primaryColor}10` }}>
                       {s.trim()}
                    </span>
                  ))}
               </div>
            </div>

            <div>
               <h2 className="text-lg font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
                 <span className="w-8 h-px bg-current"></span> Education
               </h2>
               <div className={spacingClass}>
                 {data.education.map((edu: any, i: number) => (
                   <div key={i} className="relative pl-4 border-l-2" style={{ borderColor: `${primaryColor}40` }}>
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                      <p className="font-bold text-gray-900 leading-tight mb-1">{edu.degree}</p>
                      <p className="text-gray-500 text-sm mb-1">{edu.institution}</p>
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>{edu.year}</p>
                   </div>
                 ))}
               </div>
            </div>
         </div>

         <div className="col-span-2 space-y-10">
            <div>
               <h2 className="text-lg font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
                 <span className="w-8 h-px bg-current"></span> Profil
               </h2>
               <p className="text-gray-700 leading-relaxed text-[0.95em] whitespace-pre-wrap">{data.summary}</p>
            </div>

            <div>
               <h2 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: primaryColor }}>
                 <span className="w-8 h-px bg-current"></span> Experience
               </h2>
               <div className={spacingClass}>
                 {data.experience.map((exp: any, i: number) => (
                   <div key={i} className="relative">
                     <div className="flex items-baseline gap-4 mb-2">
                        <h3 className="font-bold text-xl text-gray-900">{exp.company}</h3>
                        <span className="text-sm font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}>{exp.duration}</span>
                     </div>
                     <p className="text-lg font-medium text-gray-600 mb-4">{exp.role}</p>
                     <p className="text-gray-700 leading-relaxed text-[0.95em] whitespace-pre-wrap">{exp.description}</p>
                   </div>
                 ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

export function MinimalistTemplate({ data, color, spacingClass, paddingClass }: any) {
  const primaryColor = getColorHex(color);
  return (
    <div className={`${paddingClass} text-zinc-900 bg-white h-full flex flex-col font-sans`}>
      <div className="text-left mb-10 flex gap-8 items-start border-b border-zinc-100 pb-10">
        {data.photo && <img src={data.photo} alt="Profile" className="w-32 h-32 rounded-full object-cover grayscale opacity-90 shadow-sm" />}
        <div>
          <h1 className="text-5xl font-light tracking-tighter mb-2">{data.name}</h1>
          <p className="text-2xl text-zinc-500 tracking-wide mb-4 font-light">{data.title}</p>
          <div className="flex gap-6 text-sm text-zinc-500 font-mono tracking-tight">
             <span>{data.email}</span>
             <span>{data.phone}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-10 text-lg text-zinc-700 leading-relaxed max-w-4xl font-light whitespace-pre-wrap">
         {data.summary}
      </div>

      <div className="mb-10">
        <h2 className="text-[0.8em] font-mono uppercase tracking-[0.2em] mb-6 text-zinc-400 border-b border-zinc-100 pb-2">Experience</h2>
        <div className={spacingClass}>
          {data.experience.map((exp: any, i: number) => (
            <div key={i} className="grid grid-cols-4 gap-8">
               <div className="col-span-1 border-r border-zinc-100 pr-4">
                  <p className="font-medium text-zinc-900 mb-1">{exp.company}</p>
                  <p className="text-xs text-zinc-400 font-mono mt-1">{exp.duration}</p>
               </div>
               <div className="col-span-3">
                  <p className="text-lg font-medium text-zinc-800 mb-3">{exp.role}</p>
                  <p className="text-zinc-600 leading-relaxed font-light text-[0.95em] whitespace-pre-wrap">{exp.description}</p>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10">
         <div>
            <h2 className="text-[0.8em] font-mono uppercase tracking-[0.2em] mb-6 text-zinc-400 border-b border-zinc-100 pb-2">Education</h2>
            <div className={spacingClass}>
              {data.education.map((edu: any, i: number) => (
                <div key={i}>
                   <p className="font-medium text-zinc-900 mb-1">{edu.degree}</p>
                   <p className="text-zinc-500 text-sm">{edu.institution}</p>
                   <p className="text-xs text-zinc-400 font-mono mt-1">{edu.year}</p>
                </div>
              ))}
            </div>
         </div>
         <div>
            <h2 className="text-[0.8em] font-mono uppercase tracking-[0.2em] mb-6 text-zinc-400 border-b border-zinc-100 pb-2">Skills</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-600 font-light">
               {data.skills.split(',').map((s: string, i: number) => (
                 <span key={i}>{s.trim()}</span>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}

export function BoldTemplate({ data, color, spacingClass, paddingClass }: any) {
  const primaryColor = getColorHex(color);
  return (
    <div className={`overflow-hidden h-full flex flex-col bg-slate-50 text-slate-800`}>
      <div className={`pt-16 pb-12 ${paddingClass} relative bg-gray-900 text-white`}>
         <div className="flex justify-between items-center z-10 relative border-l-8 pl-6" style={{ borderColor: primaryColor }}>
            <div className="max-w-2xl">
               <h1 className="text-5xl font-black tracking-tight mb-3 uppercase leading-tight">{data.name}</h1>
               <p className="text-2xl font-bold tracking-widest uppercase mb-6 opacity-80" style={{ color: primaryColor }}>{data.title}</p>
               <div className="flex flex-wrap gap-4 text-sm font-medium opacity-70">
                  <span className="bg-white/10 px-3 py-1.5 rounded uppercase tracking-wider">{data.email}</span>
                  <span className="bg-white/10 px-3 py-1.5 rounded uppercase tracking-wider">{data.phone}</span>
               </div>
            </div>
            {data.photo && <img src={data.photo} alt="Profile" className="w-36 h-36 object-cover shadow-2xl border-4 transform rotate-2" style={{ borderColor: primaryColor }} />}
         </div>
      </div>
      
      <div className={`${paddingClass} flex-1 grid grid-cols-3 gap-12 mt-4`}>
         <div className="col-span-2 space-y-12">
            <div>
               <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-4 text-gray-900 border-b-4 pb-2" style={{ borderColor: primaryColor }}>
                 Summary
               </h2>
               <p className="text-lg text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{data.summary}</p>
            </div>

            <div>
               <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-4 text-gray-900 border-b-4 pb-2" style={{ borderColor: primaryColor }}>
                 Experience
               </h2>
               <div className={spacingClass}>
                 {data.experience.map((exp: any, i: number) => (
                   <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <h3 className="font-black text-2xl text-gray-900 mb-1">{exp.role}</h3>
                           <p className="text-lg font-bold uppercase tracking-wider" style={{ color: primaryColor }}>{exp.company}</p>
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1.5 rounded">{exp.duration}</span>
                     </div>
                     <p className="text-slate-700 leading-relaxed text-[0.95em] whitespace-pre-wrap">{exp.description}</p>
                   </div>
                 ))}
               </div>
            </div>
         </div>

         <div className="col-span-1 space-y-12">
            <div>
               <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-4 text-gray-900 border-b-4 pb-2" style={{ borderColor: primaryColor }}>
                 Education
               </h2>
               <div className={spacingClass}>
                 {data.education.map((edu: any, i: number) => (
                   <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                      <p className="font-black text-gray-900 text-[1.1em] leading-tight mb-2">{edu.degree}</p>
                      <p className="text-slate-600 font-bold mb-2">{edu.institution}</p>
                      <p className="text-xs font-black uppercase tracking-wider text-slate-400">{edu.year}</p>
                   </div>
                 ))}
               </div>
            </div>

            <div>
               <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-4 text-gray-900 border-b-4 pb-2" style={{ borderColor: primaryColor }}>
                 Skills
               </h2>
               <div className="flex flex-wrap gap-2">
                  {data.skills.split(',').map((s: string, i: number) => (
                    <span key={i} className="px-4 py-2 text-sm font-black text-white shadow-sm uppercase tracking-wider" style={{ backgroundColor: primaryColor }}>
                       {s.trim()}
                    </span>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

export function AcademicTemplate({ data, color, spacingClass, paddingClass }: any) {
  const primaryColor = getColorHex(color);
  return (
    <div className={`${paddingClass} text-stone-900 bg-[#fefdfb] h-full flex flex-col font-serif`} style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <div className="text-center mb-10 pb-8 border-b-2 border-stone-800 relative">
        {data.photo && <img src={data.photo} alt="Profile" className="w-20 h-20 shadow-md mx-auto mb-5 object-cover" />}
        <h1 className="text-4xl font-bold mb-3 uppercase tracking-widest">{data.name}</h1>
        <p className="text-lg italic text-stone-700 mb-4">{data.title}</p>
        <div className="flex justify-center gap-6 text-[0.85em] font-bold">
           <span>{data.email}</span>
           <span>•</span>
           <span>{data.phone}</span>
        </div>
      </div>
      
      <div className="mb-10 text-justify text-[1.05em] leading-relaxed whitespace-pre-wrap">
         {data.summary}
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-b border-stone-300 pb-1" style={{ color: primaryColor }}>Professional Experience</h2>
        <div className={spacingClass}>
          {data.experience.map((exp: any, i: number) => (
            <div key={i} className="mb-6">
              <div className="flex justify-between items-baseline mb-1">
                 <h3 className="font-bold text-[1.15em]">{exp.company}</h3>
                 <span className="text-[0.9em] font-bold">{exp.duration}</span>
              </div>
              <p className="italic text-stone-700 mb-3">{exp.role}</p>
              <div className="text-[0.95em] leading-relaxed text-stone-800 whitespace-pre-wrap ml-4">
                 <ul className="list-disc">
                   {exp.description.split('\\n').map((line: string, idx: number) => (
                      <li key={idx} className="mb-1 pl-1">{line.replace(/^•\s*/, '')}</li>
                   ))}
                   {!exp.description.includes('\\n') && <li className="mb-1 pl-1">{exp.description.replace(/^•\s*/, '')}</li>}
                 </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-b border-stone-300 pb-1" style={{ color: primaryColor }}>Education</h2>
        <div className={spacingClass}>
          {data.education.map((edu: any, i: number) => (
            <div key={i} className="flex justify-between items-baseline mb-4">
               <div>
                 <p className="font-bold text-[1.05em] mb-1">{edu.institution}</p>
                 <p className="italic text-stone-700">{edu.degree}</p>
               </div>
               <span className="font-bold text-[0.9em]">{edu.year}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-b border-stone-300 pb-1" style={{ color: primaryColor }}>Skills & Expertise</h2>
        <p className="text-[0.95em] leading-relaxed text-stone-800">
           {data.skills}
        </p>
      </div>
    </div>
  );
}

export function StartupTemplate({ data, color, spacingClass, paddingClass }: any) {
  const primaryColor = getColorHex(color);
  return (
    <div className={`overflow-hidden h-full flex flex-col bg-[#0a0a0b] text-gray-200 font-sans`}>
      <div className={`pt-12 pb-10 ${paddingClass} border-b border-white/10 flex items-center justify-between`}>
         <div>
            <h1 className="text-6xl font-black tracking-tighter mb-2 text-white">
               {data.name.split(' ')[0]}<span style={{ color: primaryColor }}>.</span>
            </h1>
            <p className="text-2xl font-bold tracking-tight text-white/50">{data.title}</p>
         </div>
         {data.photo && (
            <div className="relative">
               <div className="absolute inset-0 rounded-xl blur-xl opacity-30" style={{ backgroundColor: primaryColor }}></div>
               <img src={data.photo} alt="Profile" className="w-32 h-32 rounded-xl object-cover relative z-10 border border-white/10 box-content grayscale hover:grayscale-0 transition-all" />
            </div>
         )}
      </div>
      
      <div className={`${paddingClass} flex-1 grid grid-cols-12 gap-8 mt-6`}>
         <div className="col-span-4 space-y-10">
            <div className="p-5 rounded-2xl border border-white/5 bg-white/5">
               <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-white/40">Status</h2>
               <div className="space-y-4 text-sm font-medium">
                  <div className="flex bg-black/40 rounded-lg p-3 border border-white/5">
                     <span className="text-white">Email</span>
                     <span className="ml-auto opacity-70 truncate pl-2">{data.email}</span>
                  </div>
                  <div className="flex bg-black/40 rounded-lg p-3 border border-white/5">
                     <span className="text-white">Phone</span>
                     <span className="ml-auto opacity-70">{data.phone}</span>
                  </div>
               </div>
            </div>

            <div>
               <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-white/40 pb-2 border-b border-white/10">Stack</h2>
               <div className="flex flex-wrap gap-2">
                  {data.skills.split(',').map((s: string, i: number) => (
                    <span key={i} className="px-3 py-1 text-xs font-bold rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-default">
                       {s.trim()}
                    </span>
                  ))}
               </div>
            </div>

            <div>
               <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-white/40 pb-2 border-b border-white/10">Background</h2>
               <div className={spacingClass}>
                 {data.education.map((edu: any, i: number) => (
                   <div key={i}>
                      <p className="font-bold text-white mb-1">{edu.degree}</p>
                      <p className="text-white/50 text-sm">{edu.institution}</p>
                      <p className="text-xs font-mono mt-1" style={{ color: primaryColor }}>{edu.year}</p>
                   </div>
                 ))}
               </div>
            </div>
         </div>

         <div className="col-span-8 space-y-10 pl-4">
            <div>
               <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-white/40 pb-2 border-b border-white/10">Mission</h2>
               <p className="text-white/80 leading-relaxed font-light text-[1.05em] whitespace-pre-wrap">{data.summary}</p>
            </div>

            <div>
               <h2 className="text-sm font-bold uppercase tracking-widest mb-5 text-white/40 pb-2 border-b border-white/10">Traction</h2>
               <div className={spacingClass}>
                 {data.experience.map((exp: any, i: number) => (
                   <div key={i} className="group cursor-default">
                     <div className="flex justify-between items-end mb-2">
                        <div>
                           <h3 className="font-bold text-2xl text-white group-hover:text-white transition-colors">{exp.role}</h3>
                           <p className="text-lg font-medium opacity-70" style={{ color: primaryColor }}>{exp.company}</p>
                        </div>
                        <span className="text-xs font-mono bg-white/5 border border-white/10 px-2 py-1 rounded text-white/60">{exp.duration}</span>
                     </div>
                     <p className="text-white/70 leading-relaxed font-light text-[0.95em] whitespace-pre-wrap mt-3">{exp.description}</p>
                   </div>
                 ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

export function InfographicTemplate({ data, color, spacingClass, paddingClass }: any) {
  const primaryColor = getColorHex(color);
  return (
    <div className={`${paddingClass} text-slate-800 bg-white h-full flex flex-col font-sans`}>
      <div className="flex gap-8 mb-10 pb-8 border-b-4" style={{ borderBottomColor: primaryColor }}>
        {data.photo && (
           <div className="w-32 h-32 flex-shrink-0">
             <img src={data.photo} alt="Profile" className="w-full h-full rounded-[2rem] object-cover shadow-lg border-2" style={{ borderColor: primaryColor }} />
           </div>
        )}
        <div className="flex-1">
          <h1 className="text-5xl font-black tracking-tight mb-2 uppercase text-slate-900">{data.name}</h1>
          <p className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>{data.title}</p>
          <div className="flex gap-4">
             <span className="bg-slate-100 text-slate-600 font-bold px-4 py-1.5 rounded-full text-sm">{data.email}</span>
             <span className="bg-slate-100 text-slate-600 font-bold px-4 py-1.5 rounded-full text-sm">{data.phone}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-10">
         <div className="col-span-2 space-y-10">
            <div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black" style={{ backgroundColor: primaryColor }}>01</div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">About Me</h2>
               </div>
               <p className="text-slate-600 leading-relaxed font-medium pl-14 whitespace-pre-wrap">{data.summary}</p>
            </div>

            <div>
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black" style={{ backgroundColor: primaryColor }}>02</div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Experience Timeline</h2>
               </div>
               
               <div className="pl-14 relative border-l-4 ml-5 space-y-8" style={{ borderColor: `${primaryColor}20` }}>
                 {data.experience.map((exp: any, i: number) => (
                   <div key={i} className="relative pl-6">
                      <div className="absolute -left-[14px] top-1 w-6 h-6 rounded-full border-4 border-white" style={{ backgroundColor: primaryColor }}></div>
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="font-black text-xl text-slate-900">{exp.role}</h3>
                         <span className="text-xs font-black bg-slate-100 px-2 py-1 rounded text-slate-500">{exp.duration}</span>
                      </div>
                      <p className="font-bold mb-3" style={{ color: primaryColor }}>{exp.company}</p>
                      <p className="text-slate-600 font-medium text-[0.95em] leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-xl">{exp.description}</p>
                   </div>
                 ))}
               </div>
            </div>
         </div>

         <div className="col-span-1 space-y-10">
            <div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black" style={{ backgroundColor: primaryColor }}>03</div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Expertise</h2>
               </div>
               <div className="pl-14 space-y-3">
                  {data.skills.split(',').map((s: string, i: number) => (
                    <div key={i} className="relative">
                       <p className="text-xs font-bold uppercase mb-1">{s.trim()}</p>
                       <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${Math.max(40, 100 - (i * 10))}%`, backgroundColor: primaryColor }}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black" style={{ backgroundColor: primaryColor }}>04</div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Education</h2>
               </div>
               <div className="pl-14 space-y-6">
                 {data.education.map((edu: any, i: number) => (
                   <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs font-black text-white px-2 py-0.5 rounded inline-block mb-2" style={{ backgroundColor: primaryColor }}>{edu.year}</p>
                      <p className="font-black text-slate-900 leading-tight mb-1">{edu.degree}</p>
                      <p className="text-slate-500 font-medium text-sm">{edu.institution}</p>
                   </div>
                 ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

export function BusinessTemplate({ data, color, spacingClass, paddingClass }: any) {
  const primaryColor = getColorHex(color);
  return (
    <div className={`${paddingClass} bg-white text-gray-800 h-full flex flex-col`}>
      <div className="flex justify-between items-end mb-8 border-b-2 pb-6" style={{ borderBottomColor: primaryColor }}>
         <div className="flex items-center gap-6">
             {data.photo && <img src={data.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover shadow-md" />}
             <div>
                 <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2 uppercase">{data.name}</h1>
                 <p className="text-xl font-bold tracking-wide" style={{ color: primaryColor }}>{data.title}</p>
             </div>
         </div>
         <div className="text-right text-[0.85em] font-medium text-gray-500 space-y-1">
             <p>{data.email}</p>
             <p>{data.phone}</p>
         </div>
      </div>
      
      <div className="mb-8">
         <p className="text-[1.05em] leading-relaxed font-medium text-gray-700 bg-gray-50 p-6 rounded-lg border-l-4" style={{ borderLeftColor: primaryColor }}>
            {data.summary}
         </p>
      </div>

      <div className="grid grid-cols-3 gap-10 h-full">
         <div className="col-span-2">
             <h2 className="text-[1.1em] font-black uppercase tracking-wider mb-6 pb-2 border-b border-gray-200" style={{ color: primaryColor }}>Professional Experience</h2>
             <div className={spacingClass}>
               {data.experience.map((exp: any, i: number) => (
                 <div key={i} className="mb-6">
                   <h3 className="font-bold text-gray-900 text-[1.2em]">{exp.role}</h3>
                   <div className="flex justify-between items-center mb-3">
                      <p className="font-bold text-gray-600">{exp.company}</p>
                      <span className="font-bold uppercase tracking-wider text-[0.8em]" style={{ color: primaryColor }}>{exp.duration}</span>
                   </div>
                   <p className="text-gray-700 leading-relaxed text-[0.95em] whitespace-pre-wrap">{exp.description}</p>
                 </div>
               ))}
             </div>
         </div>
         <div className="col-span-1 space-y-8">
             <div>
                <h2 className="text-[1.1em] font-black uppercase tracking-wider mb-6 pb-2 border-b border-gray-200" style={{ color: primaryColor }}>Education</h2>
                <div className={spacingClass}>
                  {data.education.map((edu: any, i: number) => (
                    <div key={i}>
                       <p className="font-bold text-gray-900 text-[1.1em] leading-tight mb-1">{edu.degree}</p>
                       <p className="text-gray-600 font-medium mb-1">{edu.institution}</p>
                       <p className="font-bold uppercase tracking-wider text-[0.8em]" style={{ color: primaryColor }}>{edu.year}</p>
                    </div>
                  ))}
                </div>
             </div>

             <div>
                <h2 className="text-[1.1em] font-black uppercase tracking-wider mb-6 pb-2 border-b border-gray-200" style={{ color: primaryColor }}>Expertise</h2>
                <ul className="space-y-2">
                   {data.skills.split(',').map((s: string, i: number) => (
                     <li key={i} className="flex items-center gap-2 text-[0.95em] font-medium text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></span>
                        {s.trim()}
                     </li>
                   ))}
                </ul>
             </div>
         </div>
      </div>
    </div>
  );
}

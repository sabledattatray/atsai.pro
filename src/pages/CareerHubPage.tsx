import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Clock, Tag, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from '../utils/useSEO';

interface ArticleContent {
  type: 'paragraph' | 'heading' | 'list' | 'quote' | 'code';
  text?: string;
  items?: string[];
  code?: string;
  language?: string;
}

interface Article {
  title: string;
  category: string;
  image: string;
  readTime: string;
  desc: string;
  content: ArticleContent[];
}

const FEATURED_ARTICLE: Article = {
  title: "Mastering the Tech Interview: From Initial Screen to Final Offer",
  category: "Featured Guide",
  image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600&auto=format&fit=crop&q=80",
  readTime: "15 min read",
  desc: "A comprehensive definitive guide detailing exact negotiation tactics, system design framing, and behavioral structuring.",
  content: [
    { type: 'paragraph', text: "Landing a tech role at a top-tier company is more than just solving leetcode questions; it is a multi-stage process where each phase requires a different strategy. This guide breaks down the four critical phases: the recruiter screen, technical deep dive, behavioral loop, and salary negotiation." },
    { type: 'heading', text: "1. The Recruiter Screen (Telling Your Story)" },
    { type: 'paragraph', text: "The first filter is human. Recruiters look for alignment, passion, and high-level technical capability. When they ask you to 'walk through your resume,' do not read it line-by-line. Instead, tell a cohesive narrative focusing on three pillars:" },
    { type: 'list', items: [
      "The Catalyst: Why you entered this field and what drives your engineering curiosity.",
      "The Impact: One or two major accomplishments where you drove high-value business outcomes.",
      "The Pivot: Why you are looking to take the next step in your career with this specific team."
    ]},
    { type: 'heading', text: "2. The Technical Deep Dive (System Design & Coding)" },
    { type: 'paragraph', text: "Technical interviews measure problem-solving and architectural scalability. During coding rounds, think out loud. Talk through trade-offs in time and space complexity before writing a single line of code. For system design, follow this structured approach:" },
    { type: 'list', items: [
      "Understand the scope: Clarify requirements, estimate queries per second (QPS), storage size, and bandwidth constraints.",
      "High-level design: Draw key components like Load Balancers, API Gateways, CDN, database caches, and microservices.",
      "Scale the design: Handle single points of failure, partition data, and choose correct replication models."
    ]},
    { type: 'heading', text: "3. The Behavioral Loop (The STAR Method)" },
    { type: 'paragraph', text: "Recruiters use behavioral questions to gauge your cultural fit, collaboration, and leadership. Format every story using the STAR method: Situation, Task, Action, and Result. Make sure 70% of your time is spent describing the Actions YOU took, and always end with a quantifiable Result." },
    { type: 'quote', text: "Good engineers write code. Great engineers understand the business value of their code." }
  ]
};

const ARTICLES: Article[] = [
  {
    title: "How to Beat the ATS: The Ultimate 2026 Guide",
    category: "Resume Strategy",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=60",
    readTime: "8 min read",
    desc: "Discover the exact parsing logic used by Workday and Greenhouse, and how to format your experience to ensure maximum visibility.",
    content: [
      { type: 'paragraph', text: "Applicant Tracking Systems (ATS) like Workday, Taleo, and Greenhouse process millions of resumes daily. They act as the gatekeeper, using advanced semantic parsers to match your profile to job descriptions before a recruiter ever sees it. Here is how you optimize your resume to beat the algorithms." },
      { type: 'heading', text: "Use ATS-Friendly File Formats" },
      { type: 'paragraph', text: "While PDF is generally preferred to preserve your exact layout, some legacy ATS struggle to parse complex multi-column PDFs. Ensure your PDF has selectable text (not saved as an image). If in doubt, a cleanly styled single-column Microsoft Word (.docx) file is parsed perfectly by every major system." },
      { type: 'heading', text: "Avoid Design Pitfalls" },
      { type: 'list', items: [
        "No Columns or Sidebars: Parsers read left-to-right, meaning multi-column content gets scrambled.",
        "No Text in Headers or Footers: Important contact info placed here is often ignored entirely.",
        "No Graphics or Icon Bars: Progress bars for skills (e.g., 'React: 80%') are unreadable to algorithms."
      ]},
      { type: 'heading', text: "Semantic Keyword Matching" },
      { type: 'paragraph', text: "Align your skills section with the specific vocabulary used in the job post. If the listing asks for 'ReactJS', don't write 'React' — match the exact spelling. Integrate these keywords naturally inside your work experience bullet points rather than just listing them in a wall of text." }
    ]
  },
  {
    title: "The Art of the Quantifiable Bullet Point",
    category: "Writing Tips",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
    readTime: "5 min read",
    desc: "Learn why saying 'managed a team' is failing you, and how to use the XYZ formula developed at Google to transform your impact.",
    content: [
      { type: 'paragraph', text: "Many resumes fail because they describe responsibilities instead of achievements. Recruiters don't want a copy of your job description; they want to know what you accomplished and how you measured success. The best way to format your accomplishments is by using the Google XYZ formula." },
      { type: 'heading', text: "The Google XYZ Formula" },
      { type: 'quote', text: "\"Accomplished [X] as measured by [Y], by doing [Z]\"" },
      { type: 'paragraph', text: "Let's look at an example. Instead of writing:" },
      { type: 'code', code: "Managed a team of developers and worked on the main website.", language: "text" },
      { type: 'paragraph', text: "Rewrite it using the XYZ formula:" },
      { type: 'code', code: "Led a cross-functional team of 6 engineers [Z] to redesign the core e-commerce portal, improving page load speeds by 42% [X] as measured by Google Lighthouse metrics [Y].", language: "text" },
      { type: 'heading', text: "Why This Works" },
      { type: 'paragraph', text: "It immediately establishes scope, provides credibility through measurement metrics, and highlights your technical approach. Every single bullet point on your resume should try to incorporate this structure to maximize impact." }
    ]
  },
  {
    title: "Why Soft Skills are Failing Your Keyword Scans",
    category: "Technical Parsing",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60",
    readTime: "6 min read",
    desc: "Stop using words like 'Hardworking' and 'Motivated'. Here is the exact vocabulary tech recruiters are actually querying for.",
    content: [
      { type: 'paragraph', text: "Filling your resume with self-proclaimed buzzwords like 'natural leader', 'problem solver', 'team player', or 'highly motivated' does more harm than good. These terms are subjective, generic, and are completely ignored by ATS search queries." },
      { type: 'heading', text: "Show, Don't Tell" },
      { type: 'paragraph', text: "Instead of telling recruiters that you have soft skills, prove it by showing how you applied them to real situations. Here is how you can translate common buzzwords into high-value achievements:" },
      { type: 'list', items: [
        "Instead of 'Team Player': Write about cross-functional collaboration, mentoring junior engineers, or aligning multiple stakeholders.",
        "Instead of 'Problem Solver': Highlight a specific challenge (e.g., debugged a legacy memory leak) and walk through your solution.",
        "Instead of 'Detail-Oriented': Showcase your quality assurance practices, test coverage metrics, or audit compliance results."
      ]},
      { type: 'heading', text: "Focus on Action Verbs" },
      { type: 'paragraph', text: "Use active, strong verbs to start every bullet point. Replace passive phrasing like 'assisted in' or 'responsible for' with powerful action verbs like 'spearheaded', 'automated', 'orchestrated', 'championed', or 'streamlined'." }
    ]
  },
  {
    title: "Navigating Career Gaps on a Modern Resume",
    category: "Career Advice",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=60",
    readTime: "4 min read",
    desc: "How to cleanly format sabbaticals, parental leave, or layoffs without triggering automatic rejection filters in enterprise ATS systems.",
    content: [
      { type: 'paragraph', text: "Employment gaps are incredibly common, yet many job seekers feel anxious about how they appear on a resume. With the tech layoffs of recent years, recruiters are highly understanding of career gaps, provided you address them clearly and confidently." },
      { type: 'heading', text: "Be Transparent and Concise" },
      { type: 'paragraph', text: "Do not try to cover up gaps by listing only years instead of months (e.g., '2024 - 2025' when you worked from Dec 2024 to Jan 2025). This can trigger background check flags. Instead, list the gap directly in your experience timeline as its own entry." },
      { type: 'heading', text: "Frame Gaps Positively" },
      { type: 'list', items: [
        "Career Break: Focus on upskilling, personal projects, freelancing, or structured learning certifications completed during this time.",
        "Family Care / Parental Leave: A simple, one-sentence timeline entry like 'Career break to focus on full-time family care' is highly professional.",
        "Layoffs: If you were impacted by a corporate restructuring or site closure, state it briefly: 'Role eliminated due to company-wide workforce reduction.'"
      ]},
      { type: 'paragraph', text: "The key is showing that your skills did not stagnate, and that you are focused and ready for your next career challenge." }
    ]
  },
  {
    title: "The Death of the Objective Statement",
    category: "Resume Strategy",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60",
    readTime: "3 min read",
    desc: "What to write instead in your critical top 20% of the page to hook a recruiter's attention in exactly 6.4 seconds.",
    content: [
      { type: 'paragraph', text: "Starting your resume with 'Objective: Seeking a challenging role to utilize my skills and grow with a forward-thinking company' is a waste of prime real estate. Recruiters already know your objective — it's to get the job. Instead, use a Professional Summary." },
      { type: 'heading', text: "The Professional Summary" },
      { type: 'paragraph', text: "A Professional Summary is a 3-4 sentence elevator pitch positioned at the very top of your resume. It should outline who you are, your core expertise, and a major metric-based highlight." },
      { type: 'heading', text: "The Summary Blueprint" },
      { type: 'list', items: [
        "Sentence 1: Job Title, years of experience, and your core technical stack/domain.",
        "Sentence 2: Your greatest strength or primary area of focus (e.g., cloud native migration).",
        "Sentence 3: A major career achievement with quantified business impact.",
        "Sentence 4: What specific value you plan to bring to the target organization."
      ]},
      { type: 'paragraph', text: "By packaging your value upfront, you capture the reader's attention within the first 6 seconds, compelling them to read the rest of your profile." }
    ]
  },
  {
    title: "Optimizing for the Human After the Robot",
    category: "Design",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
    readTime: "10 min read",
    desc: "Passing the ATS is step one. How to use typography, whitespace, and visual hierarchy to ensure the hiring manager actually reads it.",
    content: [
      { type: 'paragraph', text: "Getting past the ATS algorithm gets you in front of a human recruiter or hiring manager. But if your resume is a wall of dense text, or uses hard-to-read fonts and bad spacing, they will quickly move on. Good design makes your experience easily scannable." },
      { type: 'heading', text: "Establish Visual Hierarchy" },
      { type: 'paragraph', text: "The reader's eye should naturally flow through your resume. Use size, weight, and color to distinguish sections. Keep section headers bold and slightly larger than the body text (e.g., 13pt vs 10pt)." },
      { type: 'heading', text: "Typography Guidelines" },
      { type: 'list', items: [
        "Use modern, clean sans-serif fonts such as Inter, Roboto, Arial, or Calibri. Avoid stylized script or serif fonts unless applying for creative roles.",
        "Maintain a font size between 10pt and 11.5pt for body text. Anything smaller causes eye strain.",
        "Ensure line height is set between 1.15 and 1.3 to create breathable spacing between sentences."
      ]},
      { type: 'heading', text: "Whitespace is Your Friend" },
      { type: 'paragraph', text: "Don't try to cram every detail of your career onto one page. Keep margins to at least 0.5 inches on all sides. Negative space helps critical points stand out, ensuring recruiters focus on your key career highlights." }
    ]
  }
];

export default function CareerHubPage() {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  useSEO({
    title: 'Career Hub & AI Resume Optimization Blog | Resume Copilot AI',
    description: 'Discover data-backed career strategies, insider ATS knowledge, and tactical advice on resume writing, technical parsing, and interview prep.',
    keywords: 'career hub, resume writing advice, ats guide 2026, google xyz formula, soft skills keyword search',
    ogImage: 'https://cvwithcopilot.vercel.app/landing_page.png'
  });

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-[#030712] text-slate-100 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Hero Section */}
      <section className="relative py-24 px-6 bg-[#030712] border-b border-white/5 overflow-hidden">
        {/* Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2.5 px-4.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-6 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.1)] backdrop-blur-md">
             <BookOpen className="w-3.5 h-3.5" /> Learning Center
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            Career <span className="text-gradient">Hub</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium">
            Data-backed strategies, insider ATS knowledge, and tactical advice to engineer your transition into top-tier tech roles.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16 px-6 relative z-10 hidden md:block">
        <div className="container mx-auto max-w-6xl">
           <div 
              onClick={() => setActiveArticle(FEATURED_ARTICLE)}
              className="relative rounded-2xl overflow-hidden group cursor-pointer border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
           >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent group-hover:via-slate-950/30 transition-colors z-10" />
              <img src={FEATURED_ARTICLE.image} alt="Featured" className="w-full h-[450px] object-cover group-hover:scale-[1.01] transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-full p-10 z-20 flex flex-col items-start gap-3">
                 <span className="bg-indigo-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded tracking-widest font-mono">Featured Guide</span>
                 <h2 className="text-3xl sm:text-4xl font-extrabold text-white max-w-3xl leading-tight">{FEATURED_ARTICLE.title}</h2>
                 <p className="text-slate-300 max-w-2xl text-sm md:text-base mb-4 font-medium">{FEATURED_ARTICLE.desc}</p>
                 <Button className="bg-white text-black hover:bg-slate-200 font-bold uppercase tracking-widest text-xs h-12 px-8 shadow-lg">Read Full Guide</Button>
              </div>
           </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
           <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-4">
              <h3 className="text-2xl font-extrabold text-white tracking-tight">Latest Articles</h3>
           </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ARTICLES.map((article, idx) => (
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    key={idx} 
                    onClick={() => setActiveArticle(article)}
                    className="group cursor-pointer flex flex-col p-5 bg-[#0b0f19]/35 border border-white/5 rounded-2xl shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1.5 hover:border-white/10 transition-all duration-300 backdrop-blur-md"
                 >
                    <div className="relative h-52 bg-slate-950/60 rounded-xl overflow-hidden mb-5 border border-white/5">
                       <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                       <div className="absolute top-3 left-3 z-20">
                          <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded backdrop-blur">
                             {article.category}
                          </span>
                       </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                       <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-2.5 font-mono font-semibold uppercase tracking-wider">
                          <Clock className="w-3 h-3 text-indigo-400" /> {article.readTime}
                       </div>
                       <h4 className="text-lg font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors leading-tight">{article.title}</h4>
                       <p className="text-slate-400 text-xs leading-relaxed mb-6 flex-1 font-medium">{article.desc}</p>
                       <div className="flex items-center text-xs font-bold text-indigo-400 group-hover:text-indigo-300 cursor-pointer uppercase tracking-widest transition-colors mt-auto">
                          Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                       </div>
                    </div>
                 </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="py-28 bg-[#030712] relative overflow-hidden border-t border-white/5 text-center mt-12">
         {/* Inner Grid Light Overlay */}
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#030712] to-[#030712] opacity-80 pointer-events-none"></div>
         
         <div className="container mx-auto max-w-3xl relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tight text-white leading-none">Stop guessing. Start optimizing.</h2>
            <p className="text-slate-400 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed font-medium">Upload your resume to our AI analyzer and see exactly what recruiters see. Get actionable fixes in under 30 seconds.</p>
            <Link to="/app">
               <Button className="h-14 px-8 bg-white text-black hover:bg-slate-100 hover:text-black font-bold uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-transform duration-300">
                  Analyze My Resume Now
               </Button>
            </Link>
         </div>
      </section>

      {/* Modal Overlay */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveArticle(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-3xl max-h-[85vh] bg-[#0b0f19] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
            >
              {/* Header Image */}
              <div className="relative h-48 md:h-64 shrink-0 overflow-hidden">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/40 to-transparent" />
                <button
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white p-2 rounded-full border border-white/10 backdrop-blur transition-colors z-20 cursor-pointer flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="bg-indigo-600 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded tracking-widest font-mono">
                    {activeArticle.category}
                  </span>
                  <h2 className="text-xl md:text-3xl font-extrabold text-white mt-2 leading-tight drop-shadow-md">
                    {activeArticle.title}
                  </h2>
                </div>
              </div>

              {/* Article Content Area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono font-semibold uppercase tracking-wider border-b border-white/5 pb-4">
                  <Clock className="w-4 h-4 text-indigo-400" /> {activeArticle.readTime}
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 text-sm md:text-base leading-relaxed space-y-4 font-medium">
                  {activeArticle.content.map((sec, sIdx) => {
                    switch (sec.type) {
                      case 'heading':
                        return (
                          <h3 key={sIdx} className="text-lg md:text-xl font-bold text-white mt-6 mb-2 tracking-tight">
                            {sec.text}
                          </h3>
                        );
                      case 'list':
                        return (
                          <ul key={sIdx} className="list-disc pl-5 space-y-2 my-4 text-slate-400">
                            {sec.items?.map((item, iIdx) => (
                              <li key={iIdx}>{item}</li>
                            ))}
                          </ul>
                        );
                      case 'quote':
                        return (
                          <blockquote key={sIdx} className="border-l-4 border-indigo-500 pl-4 py-1 my-6 italic bg-indigo-500/5 text-slate-200 rounded-r-lg font-medium">
                            {sec.text}
                          </blockquote>
                        );
                      case 'code':
                        return (
                          <pre key={sIdx} className="bg-slate-950 p-4 rounded-xl border border-white/5 text-xs md:text-sm overflow-x-auto font-mono text-slate-300 my-4">
                            <code>{sec.code}</code>
                          </pre>
                        );
                      case 'paragraph':
                      default:
                        return (
                          <p key={sIdx} className="text-slate-300">
                            {sec.text}
                          </p>
                        );
                    }
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="shrink-0 bg-slate-900/50 border-t border-white/5 p-4 flex justify-end items-center gap-4">
                <Button
                  onClick={() => setActiveArticle(null)}
                  className="h-9 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg"
                >
                  Done Reading
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

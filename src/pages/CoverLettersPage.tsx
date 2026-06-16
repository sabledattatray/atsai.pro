import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import { coverLetterTemplates, slugify } from '../data/coverLetters';
import { useSEO } from '../utils/useSEO';

// ── Category detection ──────────────────────────────────────────────────────
const CATEGORIES: { label: string; keywords: string[] }[] = [
  { label: 'Tech & IT',         keywords: ['developer','engineer','software','it ','data','web','python','java','sql','devops','cyber','network','cloud','frontend','backend','full stack','php','ux','ui','3d artist','animator','game','qa','tester','database','computer','tech','programming','machine'] },
  { label: 'Healthcare',        keywords: ['nurse','doctor','medical','health','physician','therapist','dental','pharmacy','pharmacist','radiolog','clinical','icu','er ','nicu','pediatric','surgical','lab','optometry','respiratory','occupational','speech','caregiver','emt','icu','hospital'] },
  { label: 'Finance',           keywords: ['accountant','accounting','finance','financial','banking','bank','auditor','tax','payroll','actuary','cfo','cpa','budget','investment','analyst','bookkeeper','accounts payable','accounts receivable','loan','equity'] },
  { label: 'Teaching',          keywords: ['teacher','professor','lecturer','instructor','tutor','educator','coach','academic','school','preschool','kindergarten','substitute','adjunct','lead teacher'] },
  { label: 'Marketing',         keywords: ['marketing','seo','social media','content','copywriter','brand','advertising','ppc','digital marketing','pr ','public relations','communications','campaign'] },
  { label: 'Sales',             keywords: ['sales','account executive','account manager','business development','lead generation','retail','car salesman','real estate','insurance'] },
  { label: 'Legal',             keywords: ['lawyer','attorney','legal','paralegal','counsel','litigat','patent','compliance','judge','law'] },
  { label: 'Management',        keywords: ['manager','director','supervisor','chief','ceo','cto','cio','vp ','vice president','managing','head of','executive','general manager','operations','superintendent','program manager'] },
  { label: 'Hospitality',       keywords: ['chef','cook','baker','restaurant','hotel','bartender','waiter','waitress','server','hostess','barista','catering','food','beverage','pastry','sommelier','dishwasher','housekeeper','housekeeping'] },
  { label: 'Entry Level',       keywords: ['entry level','intern','internship','graduate','student','freshman','no experience','no degree','beginner','junior','trainee','apprentice'] },
];

function getCategory(title: string): string {
  const lower = title.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords.some(kw => lower.includes(kw))) return cat.label;
  }
  return 'Other';
}

// Accent color per category
const CAT_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'Tech & IT':    { bg: 'bg-indigo-500/10',  text: 'text-indigo-300',  dot: 'bg-indigo-400' },
  'Healthcare':   { bg: 'bg-emerald-500/10', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  'Finance':      { bg: 'bg-yellow-500/10',  text: 'text-yellow-300',  dot: 'bg-yellow-400' },
  'Teaching':     { bg: 'bg-sky-500/10',     text: 'text-sky-300',     dot: 'bg-sky-400' },
  'Marketing':    { bg: 'bg-pink-500/10',    text: 'text-pink-300',    dot: 'bg-pink-400' },
  'Sales':        { bg: 'bg-orange-500/10',  text: 'text-orange-300',  dot: 'bg-orange-400' },
  'Legal':        { bg: 'bg-purple-500/10',  text: 'text-purple-300',  dot: 'bg-purple-400' },
  'Management':   { bg: 'bg-rose-500/10',    text: 'text-rose-300',    dot: 'bg-rose-400' },
  'Hospitality':  { bg: 'bg-amber-500/10',   text: 'text-amber-300',   dot: 'bg-amber-400' },
  'Entry Level':  { bg: 'bg-teal-500/10',    text: 'text-teal-300',    dot: 'bg-teal-400' },
  'Other':        { bg: 'bg-slate-500/10',   text: 'text-slate-400',   dot: 'bg-slate-400' },
};

const ALL_CATEGORIES = ['All', ...CATEGORIES.map(c => c.label), 'Other'];

export default function CoverLettersPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(60);

  useSEO({
    title: 'Cover Letter Templates Library | ATS AI Pro',
    description: 'Browse 900+ AI-generated cover letter templates for every role and industry. Find your job title, customize, and download a professional PDF in seconds.',
    keywords: 'cover letter templates, ai cover letter, professional cover letter, job application letter, free cover letter examples',
    ogImage: 'https://www.atsai.pro/landing_page.png',
  });

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return coverLetterTemplates.filter(t => {
      const matchesQuery = !q || t.toLowerCase().includes(q);
      const matchesCat = activeCategory === 'All' || getCategory(t) === activeCategory;
      return matchesQuery && matchesCat;
    });
  }, [query, activeCategory]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-16 pb-10 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-6 rounded-full backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          900+ Templates · AI-Powered
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-5 leading-tight">
          Cover Letter <span className="text-gradient">Library</span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-medium mb-10">
          Find your role, open the editor, and generate a tailored cover letter with AI in seconds. Every template is fully editable and PDF-exportable.
        </p>

        {/* Search */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setVisibleCount(60); }}
            placeholder="Search by job title, e.g. Software Engineer…"
            className="w-full h-14 pl-12 pr-5 rounded-2xl bg-[#0b0f19] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 text-sm font-medium transition-all shadow-xl"
          />
        </div>
      </section>

      {/* ── Category chips ────────────────────────────────────────────────── */}
      <div className="relative z-10 px-6 pb-6 max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2 justify-center">
          {ALL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setVisibleCount(60); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results count ─────────────────────────────────────────────────── */}
      <div className="relative z-10 px-6 pb-4 max-w-7xl mx-auto">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          {filtered.length} template{filtered.length !== 1 ? 's' : ''} found
          {activeCategory !== 'All' && ` in ${activeCategory}`}
          {query && ` for "${query}"`}
        </p>
      </div>

      {/* ── Grid ──────────────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-20 max-w-7xl mx-auto">
        {visible.length === 0 ? (
          <div className="text-center py-24">
            <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No templates found for <span className="text-white">"{query}"</span></p>
            <button onClick={() => { setQuery(''); setActiveCategory('All'); }} className="mt-4 text-indigo-400 text-sm font-bold hover:underline cursor-pointer">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {visible.map(template => {
              const cat = getCategory(template);
              const colors = CAT_COLORS[cat] || CAT_COLORS['Other'];
              const slug = slugify(template);
              const displayName = template.replace(/ Cover Letter$/i, '');

              return (
                <Link
                  key={slug}
                  to={`/cover-letters/${slug}`}
                  className="group flex flex-col justify-between p-5 rounded-xl bg-[#0b0f19]/60 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-950/20 transition-all duration-200 backdrop-blur-sm"
                >
                  <div>
                    {/* Category badge */}
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 ${colors.bg} ${colors.text}`}>
                      <span className={`w-1 h-1 rounded-full ${colors.dot}`} />
                      {cat}
                    </div>
                    {/* Title */}
                    <p className="text-sm font-semibold text-white leading-snug group-hover:text-indigo-300 transition-colors duration-200">
                      {displayName}
                    </p>
                  </div>
                  {/* CTA */}
                  <div className="mt-4 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-indigo-400 transition-colors duration-200">
                    Open Editor <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Load more */}
        {visibleCount < filtered.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount(v => v + 60)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-200 cursor-pointer"
            >
              Load more <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-slate-600 text-xs mt-3 font-medium">
              Showing {visible.length} of {filtered.length}
            </p>
          </div>
        )}
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-white/5 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Don't see your role?</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-6 font-medium">
          Our AI can generate a custom cover letter for any job title and description — upload your resume and get started.
        </p>
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all duration-200 shadow-lg shadow-indigo-600/20"
        >
          Generate Custom Cover Letter <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}

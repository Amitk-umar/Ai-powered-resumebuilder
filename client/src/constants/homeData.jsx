import {
  Search, Sparkles, FileText, CheckCircle, TrendingUp,
  Award,
} from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';

/** Brand logos for the scrolling marquee. */
export const brands = [
  { name: 'Airbnb', image: '/brand-images/Airbnb_Logo.webp' },
  { name: 'Amazon', image: '/brand-images/Amazon_logo.jpg' },
  { name: 'Google', image: '/brand-images/Google_Logo.webp' },
  { name: 'Meta', image: '/brand-images/Meta-Logo.jpg' },
  { name: 'Netflix', image: '/brand-images/Netflix_Logo.webp' },
  { name: 'Stripe', image: '/brand-images/Stripe_Logo.webp' },
  { name: 'Apple', image: '/brand-images/apple-Logo.jpg' },
  { name: 'Microsoft', image: '/brand-images/microsoft-logo.jpg' },
  { name: 'Accenture', image: '/brand-images/Accenture.webp' },
  { name: 'HDFC', image: '/brand-images/HDFC_Bank.png' },
  { name: 'Airtel', image: '/brand-images/airtel-logo.png' },
  { name: 'TCS', image: '/brand-images/Tata_Consultancy_Services.png' }
];

/** Floating badge cards around the hero image. */
export const floatingCards = [
  { text: 'Become Job Ready', delay: 0.1, x: -140, y: -190, bg: 'linear-gradient(135deg, #ED4264 0%, #FFEDBC 51%, #ED4264 100%)', shadow: 'rgba(237, 66, 100, 0.35)' },
  { text: 'AI Resume Score: 92%', delay: 0.3, x: 180, y: -160, bg: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 51%, #00c6ff 100%)', shadow: 'rgba(0, 114, 255, 0.35)' },
  { text: 'ATS Optimized', delay: 0.5, x: -190, y: -60, bg: 'linear-gradient(135deg, #1D976C 0%, #93F9B9 51%, #1D976C 100%)', shadow: 'rgba(29, 151, 108, 0.35)' },
  { text: 'Interview Ready', delay: 0.2, x: 190, y: -40, bg: 'linear-gradient(135deg, #DD5E89 0%, #F7BB97 51%, #DD5E89 100%)', shadow: 'rgba(221, 94, 137, 0.35)' },
  { text: 'LinkedIn Optimized', delay: 0.4, x: -180, y: 80, bg: 'linear-gradient(135deg, #4568DC 0%, #B06AB8 51%, #4568DC 100%)', shadow: 'rgba(69, 104, 220, 0.35)' },
  { text: 'AI Bullet Rewrite', delay: 0.6, x: 160, y: 100, bg: 'linear-gradient(135deg, #654ea3 0%, #eaafc8 51%, #654ea3 100%)', shadow: 'rgba(101, 78, 163, 0.35)' },
  { text: 'Job Tracker Active', delay: 0.7, x: -120, y: 180, bg: 'linear-gradient(135deg, #8A2387 0%, #E94057 51%, #F27121 100%)', shadow: 'rgba(233, 64, 87, 0.35)' },
  { text: 'Hire Faster', delay: 0.8, x: 120, y: 200, bg: 'linear-gradient(135deg, #f12711 0%, #f5af19 51%, #f12711 100%)', shadow: 'rgba(241, 39, 17, 0.35)' },
];

/** Bento grid feature cards with mini illustrations. */
export const bentoFeatures = [
  {
    title: 'ATS Resume Analysis',
    description: 'Get deep analytical scoring against major ATS software like Greenhouse and Lever, with precise keyword gap matching.',
    icon: <Search className="w-8 h-8 text-cyan-400" />,
    size: 'bento-large',
    gradient: 'from-cyan-500/10 to-blue-500/10',
    illustration: (
      <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>ATS Compatibility</span>
          <span className="text-cyan-400 font-bold">Excellent</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" style={{ width: '88%' }}></div>
        </div>
        <div className="flex gap-2 mt-1">
          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Keyword Match</span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Format Pass</span>
        </div>
      </div>
    ),
  },
  {
    title: 'AI Resume Rewriter',
    description: 'Context-aware bullet optimizer that rewrites weak sentences into quantitative, high-impact achievements.',
    icon: <Sparkles className="w-8 h-8 text-purple-400" />,
    size: 'bento-small',
    gradient: 'from-purple-500/10 to-pink-500/10',
    illustration: (
      <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1 text-[11px]">
        <div className="text-red-400 line-through opacity-60">"Responsible for managing software updates and code fixes"</div>
        <div className="text-emerald-400 font-medium flex items-center gap-1">
          <CheckCircle className="w-3 h-3 flex-shrink-0" />
          "Architected automated CI/CD pipeline, reducing deployment times by 42%"
        </div>
      </div>
    ),
  },
  {
    title: 'Cover Letter Generator',
    description: 'Tailor-made cover letters that speak directly to the job description requirements using natural AI pacing.',
    icon: <FileText className="w-8 h-8 text-indigo-400" />,
    size: 'bento-small',
    gradient: 'from-indigo-500/10 to-violet-500/10',
    illustration: (
      <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] text-slate-300 flex flex-col gap-1.5">
        <div className="font-semibold text-indigo-400">Dear Hiring Manager,</div>
        <div>Having tracked NextHireAI's market success, I am thrilled to apply for the Senior Frontend Architect position...</div>
      </div>
    ),
  },
  {
    title: 'LinkedIn Profile Optimizer',
    description: 'Maximize your digital footprint and recruitability by indexing the most looked-for keywords in recruiters search feeds.',
    icon: <FaLinkedin className="w-8 h-8 text-blue-400" />,
    size: 'bento-large',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    illustration: (
      <div className="mt-4 flex gap-3 items-center p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0 bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-white text-xs">AI</div>
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <div className="h-3 w-24 bg-slate-800 rounded"></div>
          <div className="h-2 w-full bg-slate-800 rounded"></div>
          <div className="h-2 w-3/4 bg-slate-800 rounded"></div>
        </div>
        <div className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] font-semibold border border-blue-500/20">+15% Views</div>
      </div>
    ),
  },
  {
    title: 'Interview Prep AI',
    description: 'Practice interactive interview questions tailored explicitly to the resume you submit, with professional response guides.',
    icon: <Award className="w-8 h-8 text-amber-400" />,
    size: 'bento-large',
    gradient: 'from-amber-500/10 to-orange-500/10',
    illustration: (
      <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
        <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> AI Coach Interview Question:
        </div>
        <p className="text-[10px] text-slate-300 leading-normal">"Walk me through a time you resolved a major production bottleneck under high pressure. How did you align the team?"</p>
      </div>
    ),
  },
  {
    title: 'Job Tracker Dashboard',
    description: 'An elegant visual kanban board to monitor application stages, schedule followups, and calculate success stats.',
    icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
    size: 'bento-small',
    gradient: 'from-emerald-500/10 to-green-500/10',
    illustration: (
      <div className="mt-4 flex gap-1.5 justify-between">
        <div className="flex-1 p-2 rounded bg-slate-900/60 border border-slate-800 text-[9px] flex flex-col gap-1">
          <span className="font-semibold text-yellow-400">Applied (12)</span>
          <div className="h-1 bg-yellow-400/20 rounded"></div>
        </div>
        <div className="flex-1 p-2 rounded bg-slate-900/60 border border-slate-800 text-[9px] flex flex-col gap-1">
          <span className="font-semibold text-cyan-400">Interviewing (4)</span>
          <div className="h-1 bg-cyan-400/20 rounded"></div>
        </div>
      </div>
    ),
  },
];

/** FAQ accordion items. */
export const faqData = [
  { q: 'How does the ATS Scanner evaluate compatibility?', a: 'Our parsing engine simulates major applicant tracking systems (Greenhouse, Lever, Workday) by evaluating technical skill indexes, phrase combinations, job level hierarchies, and semantic synonyms to score match levels.' },
  { q: 'Is my uploaded resume kept private and secure?', a: 'Absolutely. We operate high-end Firebase data encryption protocols. Your inputs, generated drafts, and uploaded documents are entirely secure, private, and owned solely by you.' },
  { q: 'Can I cancel my Premium Pro plan at any time?', a: 'Yes. You can manage, pause, or cancel subscriptions seamlessly directly inside your user settings panel with zero penalty fees or trailing commitments.' },
  { q: 'How do the AI rewrites avoid sounding robotic?', a: 'Unlike generic LLM blocks, our tailored prompt instructions leverage quantitative models that map real actions to measurable business impacts, creating extremely compelling professional sentences.' },
];

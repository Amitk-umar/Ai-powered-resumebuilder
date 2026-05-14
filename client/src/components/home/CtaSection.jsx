import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CtaSection({ user }) {
  return (
    <section className="py-14 relative z-10 px-6">
      <div className="container mx-auto max-w-5xl premium-glass cta-card-container py-20 px-8 md:py-24 md:px-16 relative overflow-hidden text-center flex flex-col items-center gap-6 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
        <div className="glowing-orb glow-purple w-[250px] h-[250px] top-[-50px] left-[-50px] opacity-40" />
        <div className="glowing-orb glow-cyan w-[250px] h-[250px] bottom-[-50px] right-[-50px] opacity-40" />

        <span className="text-xs font-bold text-purple-400 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 w-fit relative z-10">Instant Deployment</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight relative z-10">Maximize Your Career Opportunities Today</h2>
        <p className="text-slate-300 max-w-2xl leading-relaxed relative z-10">
          Join thousands of professionals globally land interviews at world-leading organizations. Deploy AI-optimized resume drafts in seconds.
        </p>
        <div className="flex gap-4 relative z-10 mt-2">
          <Link to={user ? '/builder' : '/signup'} className="px-8 py-4 rounded-2xl font-bold premium-btn-primary flex items-center gap-2">
            Get Started For Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

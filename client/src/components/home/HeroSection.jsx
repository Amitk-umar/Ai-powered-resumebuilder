import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play } from 'lucide-react';
import { floatingCards } from '../../constants/homeData';

export default function HeroSection({ user, runAtsScan, isMobile, isTablet }) {
  return (
    <section className="relative pt-20 pb-10 md:pt-24 md:pb-14 z-10">
      <div className="hero-grid-overlay" />
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Left — copy + CTA */}
        <div className="lg:col-span-6 flex flex-col gap-6 text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur text-xs text-slate-300 w-fit"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>Next-Gen Career Optimization Engine</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white"
          >
            Land More Interviews with <span className="gradient-text bg-gradient-to-r from-purple-400 via-violet-500 to-cyan-400 bg-clip-text text-transparent">AI-Powered</span> Resume Optimization
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-300 max-w-xl leading-relaxed"
          >
            Instantly bypass ATS screening software, optimize missing keyword gaps, leverage real-time AI bullet enhancements, and build a career profile that commands industry attention.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 mt-2"
          >
            <Link to={user ? '/builder' : '/signup'} className="px-8 py-4 rounded-2xl font-bold premium-btn-primary flex items-center gap-2">
              Start For Free <ArrowRight className="w-5 h-5" />
            </Link>
            <button onClick={runAtsScan} className="px-8 py-4 rounded-2xl font-bold premium-btn-secondary flex items-center gap-2">
              <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" /> Watch Live Scan
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5 mt-4 text-xs font-medium text-slate-400 max-w-md"
          >
            <div>
              <span className="block text-2xl font-extrabold text-white">25K+</span>
              Resumes Evaluated
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-cyan-400">92%</span>
              ATS Pass Rate
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-purple-400">10x</span>
              Interview Rate Boost
            </div>
          </motion.div>
        </div>

        {/* Right — professional image + floating cards */}
        <div className="lg:col-span-6 flex justify-center items-center relative min-h-[400px] sm:min-h-[500px]">
          <div className="absolute w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] md:w-[360px] md:h-[360px] rounded-full bg-purple-500/5 border border-purple-500/10 animate-ping pointer-events-none" style={{ animationDuration: '6s' }} />
          <div className="absolute w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] rounded-full bg-cyan-500/5 border border-cyan-500/10 animate-pulse pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-10 w-[270px] h-[270px] sm:w-[340px] sm:h-[340px] md:w-[420px] md:h-[420px] rounded-full overflow-hidden bg-gradient-to-b from-purple-500/10 via-slate-900/40 to-slate-950/30 border border-white/10 shadow-2xl flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.15),transparent_60%)] rounded-full" />
            <img
              src="/professional.png"
              alt="Job Ready Tech Professional"
              className="w-[88%] h-[88%] object-contain relative z-10 transform hover:scale-105 transition-transform duration-700 pointer-events-auto"
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"; }}
            />
          </motion.div>

          {floatingCards.map((card, i) => {
            const scale = isMobile ? 0.55 : isTablet ? 0.75 : 1.0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  opacity: 1,
                  x: card.x * scale,
                  y: [card.y * scale - 8, card.y * scale + 8, card.y * scale - 8],
                }}
                transition={{
                  opacity: { duration: 0.6, delay: card.delay },
                  x: { duration: 0.6, delay: card.delay },
                  y: { repeat: Infinity, duration: 4 + (i % 3), ease: 'easeInOut' },
                }}
                className="absolute z-20 px-2 py-1 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl border border-white/20 text-[9px] sm:text-xs font-bold text-white flex items-center gap-1.5 cursor-default hover:scale-105 transition-all duration-300"
                style={{ background: card.bg, backgroundSize: '200% auto', boxShadow: `0 4px 15px ${card.shadow}` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {card.text}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function PricingSection({ user }) {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-14 relative z-10 bg-transparent border-t border-b border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">Simple Pricing</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-4 text-white tracking-tight">Flexible Plans, <span className="gradient-text bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">No Surprises</span></h2>

          {/* Monthly / Yearly Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm ${!isYearly ? 'text-white font-bold' : 'text-slate-400'}`}>Monthly</span>
            <button onClick={() => setIsYearly(!isYearly)} className="w-14 h-8 rounded-full bg-white/10 p-1 transition-all duration-300 relative border border-white/10">
              <div className={`w-6 h-6 rounded-full bg-purple-500 transition-all duration-300 transform ${isYearly ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm ${isYearly ? 'text-white font-bold' : 'text-slate-400'} flex items-center gap-1.5`}>
              Yearly <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-400 border border-emerald-500/30">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="pricing-section-container relative max-w-6xl mx-auto mt-12 mb-12">
          <div className="pricing-background-blobs">
            <div className="pricing-blob pricing-blob-1"></div>
            <div className="pricing-blob pricing-blob-2"></div>
          </div>

          <div className="pricing-grid">

            {/* Free Plan */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="pricing-card">
              <div className="flex flex-col gap-5">
                <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">Starter</span>
                <span className="text-3xl font-extrabold text-white">Free Plan</span>
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-5xl font-extrabold text-white">&#x20B9;0</span>
                  <span className="text-sm text-slate-400 mb-1">/ forever</span>
                </div>
                <p className="text-slate-400 text-sm mt-3 border-b border-white/5 pb-6 leading-relaxed">
                  Essential tools to experience AI resume building and preview score analytics.
                </p>
                <ul className="flex flex-col gap-4 text-sm text-slate-300 mt-2">
                  {['Basic Resume Template', '1 Full ATS Compatibility Scan', 'AI Score Breakdown'].map((f) => (
                    <li key={f} className="flex items-start gap-3"><Check className="w-5 h-5 text-purple-400 flex-shrink-0" /><span>{f}</span></li>
                  ))}
                </ul>
              </div>
              <Link to={user ? '/builder' : '/signup'} className="mt-10 px-8 py-4 w-full btn-pill-secondary">Get Started</Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="pricing-card pricing-card-pro">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg">Most Popular</span>
              </div>
              <div className="flex flex-col gap-5">
                <span className="text-xs uppercase font-extrabold tracking-widest text-purple-400">Professional</span>
                <span className="text-3xl font-extrabold text-white">Pro Plan</span>
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">&#x20B9;{isYearly ? '500' : '700'}</span>
                  <span className="text-sm text-slate-400 mb-1">/ month</span>
                </div>
                <p className="text-slate-400 text-sm mt-3 border-b border-white/10 pb-6 leading-relaxed">
                  The ultimate bundle to run tailored applications and leverage infinite AI optimizations.
                </p>
                <ul className="flex flex-col gap-4 text-sm text-slate-300 mt-2">
                  {[
                    <><strong className="text-white">Unlimited</strong> Premium Templates</>,
                    <><strong className="text-white">Unlimited</strong> Live ATS Scans</>,
                    'Complete AI Bullet Rewriter',
                    'Cover Letter Generator',
                    'LinkedIn Optimizer',
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3"><Check className="w-5 h-5 text-cyan-400 flex-shrink-0" /><span>{f}</span></li>
                  ))}
                </ul>
              </div>
              <Link to={user ? '/builder' : '/signup'} className="mt-10 px-8 py-4 w-full btn-pill-primary">Upgrade to Pro</Link>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="pricing-card">
              <div className="flex flex-col gap-5">
                <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">Corporate</span>
                <span className="text-3xl font-extrabold text-white">Premium Plan</span>
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-5xl font-extrabold text-white">&#x20B9;{isYearly ? '1500' : '2000'}</span>
                  <span className="text-sm text-slate-400 mb-1">/ month</span>
                </div>
                <p className="text-slate-400 text-sm mt-3 border-b border-white/5 pb-6 leading-relaxed">
                  Structured for colleges, corporate bootcamps, and executive job consultants.
                </p>
                <ul className="flex flex-col gap-4 text-sm text-slate-300 mt-2">
                  {['Multi-Seat User Management', 'Interactive Mock Interview AI', 'Custom branding and exports', 'Dedicated Account Manager'].map((f) => (
                    <li key={f} className="flex items-start gap-3"><Check className="w-5 h-5 text-purple-400 flex-shrink-0" /><span>{f}</span></li>
                  ))}
                </ul>
              </div>
              <Link to={user ? '/builder' : '/signup'} className="mt-10 px-8 py-4 w-full btn-pill-secondary">Get Enterprise</Link>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}

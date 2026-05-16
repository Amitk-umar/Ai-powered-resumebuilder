import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function PricingSection({ user }) {
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleCheckout = async (planKey) => {
    if (!user) {
      navigate('/signup');
      return;
    }
    try {
      setLoadingPlan(planKey);
      const res = await api.post('/billing/checkout-session', { planKey });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to initiate checkout. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="py-14 relative z-10 bg-transparent border-t border-b border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">Simple Pricing</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-4 text-white tracking-tight">Flexible Plans, <span className="gradient-text bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">No Surprises</span></h2>
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
                <span className="text-3xl font-extrabold text-white">Basic Plan</span>
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-5xl font-extrabold text-white">₹0</span>
                  <span className="text-sm text-slate-400 mb-1">/ forever</span>
                </div>
                <p className="text-slate-400 text-sm mt-3 border-b border-white/5 pb-6 leading-relaxed">
                  Essential tools to experience AI resume building and preview score analytics.
                </p>
                <ul className="flex flex-col gap-4 text-sm text-slate-300 mt-2">
                  {['1 Resume Maximum', '3 ATS Compatibility Scans', 'Basic Templates'].map((f) => (
                    <li key={f} className="flex items-start gap-3"><Check className="w-5 h-5 text-purple-400 flex-shrink-0" /><span>{f}</span></li>
                  ))}
                </ul>
              </div>
              <Link to={user ? '/builder' : '/signup'} className="mt-10 px-8 py-4 w-full btn-pill-secondary block text-center">Get Started</Link>
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
                  <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">₹149</span>
                  <span className="text-sm text-slate-400 mb-1">/ month</span>
                </div>
                <p className="text-slate-400 text-sm mt-3 border-b border-white/10 pb-6 leading-relaxed">
                  The ultimate bundle to run tailored applications and leverage infinite AI optimizations.
                </p>
                <ul className="flex flex-col gap-4 text-sm text-slate-300 mt-2">
                  {[
                    <><strong className="text-white">Up to 5</strong> Resumes</>,
                    <><strong className="text-white">50</strong> Live ATS Scans</>,
                    'Premium Templates',
                    'AI Bullet Rewriter',
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3"><Check className="w-5 h-5 text-cyan-400 flex-shrink-0" /><span>{f}</span></li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={() => handleCheckout('pro')} 
                disabled={loadingPlan !== null}
                className="mt-10 px-8 py-4 w-full btn-pill-primary flex justify-center items-center gap-2"
              >
                {loadingPlan === 'pro' && <Loader2 className="w-5 h-5 animate-spin" />}
                Upgrade to Pro
              </button>
            </motion.div>

            {/* Premium Plan */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="pricing-card">
              <div className="flex flex-col gap-5">
                <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">Unlimited</span>
                <span className="text-3xl font-extrabold text-white">Premium Plan</span>
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-5xl font-extrabold text-white">₹299</span>
                  <span className="text-sm text-slate-400 mb-1">/ month</span>
                </div>
                <p className="text-slate-400 text-sm mt-3 border-b border-white/5 pb-6 leading-relaxed">
                  Structured for dedicated job seekers, career consultants, and power users.
                </p>
                <ul className="flex flex-col gap-4 text-sm text-slate-300 mt-2">
                  {['Unlimited Resumes', 'Unlimited ATS Scans', 'All Premium Templates', 'Priority Support'].map((f) => (
                    <li key={f} className="flex items-start gap-3"><Check className="w-5 h-5 text-purple-400 flex-shrink-0" /><span>{f}</span></li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={() => handleCheckout('premium')} 
                disabled={loadingPlan !== null}
                className="mt-10 px-8 py-4 w-full btn-pill-secondary flex justify-center items-center gap-2"
              >
                {loadingPlan === 'premium' && <Loader2 className="w-5 h-5 animate-spin" />}
                Get Premium
              </button>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { faqData } from '../../constants/homeData';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState({});

  const toggle = (index) => {
    setOpenIndex((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section className="py-14 relative z-10">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">Help Center</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-4 text-white tracking-tight">Frequently Asked <span className="text-purple-400">Questions</span></h2>
          <p className="text-slate-400 mt-4">Everything you need to understand about Applicant Tracking Systems & AI optimization.</p>
        </div>

        <div className="flex flex-col gap-4">
          {faqData.map((faq, index) => (
            <div key={index} className="premium-glass overflow-hidden transition-all duration-300">
              <button
                onClick={() => toggle(index)}
                className="w-full text-left p-6 flex justify-between items-center text-white font-bold hover:text-purple-400 transition-colors"
              >
                <span className="flex items-center gap-2.5 text-base md:text-lg">
                  <HelpCircle className="w-5 h-5 text-purple-400 flex-shrink-0" /> {faq.q}
                </span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openIndex[index] ? 'transform rotate-180 text-purple-400' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex[index] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-white/5 bg-slate-900/20"
                  >
                    <p className="p-6 text-sm text-slate-300 leading-relaxed font-normal">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: 'NextHireAI completely rebuilt my confidence. I went from sending out hundreds of resumes with zero responses, to landing interviews with Stripe and Meta within 10 days.',
    initials: 'SM', name: 'Sarah Miller', title: 'Frontend Lead @ Stripe',
    gradient: 'from-purple-500 to-pink-500', titleColor: 'text-purple-400',
  },
  {
    quote: 'The live ATS simulation matches keywords flawlessly. It listed precisely what gaps I had, and the automated AI bullet rewriter turned weak points into high impact quantitative bullets.',
    initials: 'KP', name: 'Kevin Patel', title: 'Staff DevOps Engineer',
    gradient: 'from-blue-500 to-cyan-500', titleColor: 'text-cyan-400',
  },
  {
    quote: 'Using the LinkedIn Profile optimizer increased my profile recruitment views by almost 300% in a week. Outstanding SaaS tool built on authentic job market dynamics.',
    initials: 'EL', name: 'Elena Lopez', title: 'Product Manager',
    gradient: 'from-indigo-500 to-violet-500', titleColor: 'text-indigo-400',
  },
];

function StarRating() {
  return (
    <div className="flex gap-1 text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-current" />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-14 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">Success Stories</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-4 text-white tracking-tight">Vouched For by <span className="gradient-text bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Top Tech Seekers</span></h2>
          <p className="text-slate-400 mt-4">Read testimonials from professionals who redefined their careers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="premium-glass p-8 flex flex-col gap-4 relative overflow-hidden group"
            >
              <StarRating />
              <p className="text-slate-300 text-sm italic leading-relaxed">"{t.quote}"</p>
              <div className="flex gap-3 items-center border-t border-white/5 pt-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${t.gradient} flex items-center justify-center font-bold text-white text-xs`}>{t.initials}</div>
                <div>
                  <span className="block text-sm font-bold text-white">{t.name}</span>
                  <span className={`text-[10px] ${t.titleColor} font-semibold uppercase tracking-wider`}>{t.title}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { Users, Globe, CheckCircle, Sparkles } from 'lucide-react';

const stats = [
  { value: '25K+', label: 'Resumes Optimized', icon: <Users className="w-6 h-6 text-purple-400" />, bgClass: 'bg-purple-500/10 border-purple-500/20', hoverClass: 'hover:border-purple-500/30' },
  { value: '12K+', label: 'Active Global Users', icon: <Globe className="w-6 h-6 text-cyan-400" />, bgClass: 'bg-cyan-500/10 border-cyan-500/20', hoverClass: 'hover:border-cyan-500/30' },
  { value: '89%', label: 'Interview Success Rate', icon: <CheckCircle className="w-6 h-6 text-indigo-400" />, bgClass: 'bg-indigo-500/10 border-indigo-500/20', hoverClass: 'hover:border-indigo-500/30' },
  { value: '1M+', label: 'AI Enhancements Created', icon: <Sparkles className="w-6 h-6 text-emerald-400" />, bgClass: 'bg-emerald-500/10 border-emerald-500/20', hoverClass: 'hover:border-emerald-500/30' },
];

export default function StatsSection() {
  return (
    <section className="py-14 relative z-10 bg-transparent border-t border-b border-white/5">
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`premium-glass p-8 text-center flex flex-col gap-2 ${stat.hoverClass} transition-all duration-300`}
          >
            <div className={`p-3 ${stat.bgClass} rounded-full w-fit mx-auto border`}>
              {stat.icon}
            </div>
            <span className="text-4xl font-extrabold text-white">{stat.value}</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

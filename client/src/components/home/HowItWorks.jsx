import { motion } from 'framer-motion';

const steps = [
  { num: '01', title: 'Upload Resume', desc: 'Import your current resume in PDF or Word format, or build one fresh with our guided templates.', color: 'purple' },
  { num: '02', title: 'Paste Job Description', desc: 'Input target job advertisements to parse specific technical keywords, credentials, and required skillsets.', color: 'cyan' },
  { num: '03', title: 'Get Optimization AI Suggestions', desc: 'Apply context-aware AI rewrite changes to align seamlessly with recruiters search queries instantly.', color: 'indigo' },
];

export default function HowItWorks() {
  return (
    <section className="py-14 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">The Method</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-4 text-white tracking-tight">How NextHireAI <span className="gradient-text bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Optimizes Careers</span></h2>
          <p className="text-slate-400 mt-4">Three simple steps to build, tailor, and test a powerhouse modern professional portfolio.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 steps-timeline">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="premium-glass p-8 flex flex-col gap-4 relative z-10"
            >
              <div className={`w-12 h-12 rounded-2xl bg-${step.color}-500/10 border border-${step.color}-500/20 flex items-center justify-center font-bold text-${step.color}-400 text-lg`}>{step.num}</div>
              <h3 className="text-xl font-bold text-white">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

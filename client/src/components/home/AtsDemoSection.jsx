import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, RefreshCw } from 'lucide-react';

const STEPS = [
  { label: '1. Upload Resume File', doneText: 'Completed', pendingText: (step) => 'Waiting...' },
  { label: '2. Scan Semantic Keywords', doneText: 'Parsed', pendingText: (step) => step === 1 ? 'Reading...' : 'Waiting...' },
  { label: '3. Evaluate Job Omissions', doneText: 'Evaluated', pendingText: (step) => step === 2 ? 'Analyzing...' : 'Waiting...' },
  { label: '4. Generate Compatibility Score', doneText: 'Scored', pendingText: (step) => step === 3 ? 'Calculating...' : 'Waiting...' },
];

export default function AtsDemoSection({ atsStep, isAtsScanning, runAtsScan }) {
  return (
    <section className="py-14 relative z-10 bg-transparent border-t border-b border-white/5">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Left — description */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 w-fit">Interactive Simulator</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Experience our Real-Time <span className="text-cyan-400">ATS Analyzer</span></h2>
          <p className="text-slate-300 leading-relaxed">
            Witness how recruiters index and scan resumes. Our live interactive sandbox parses incoming resumes, scores matches, lists skill omissions, and delivers instantaneous suggestions.
          </p>
          <button onClick={runAtsScan} disabled={isAtsScanning} className="px-6 py-3.5 rounded-2xl font-bold premium-btn-primary flex items-center gap-2 w-fit disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${isAtsScanning ? 'animate-spin' : ''}`} />
            {isAtsScanning ? 'Scanning in Progress…' : 'Trigger Simulation Scan'}
          </button>
        </div>

        {/* Right — interactive demo panel */}
        <div className="lg:col-span-7">
          <div className="premium-glass p-8 relative overflow-hidden scanning-shimmer">
            {/* Title bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-md">Live ATS Tracker v2.4</span>
            </div>

            {/* Step status rows */}
            <div className="flex flex-col gap-4">
              {STEPS.map((step, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5">
                  <span className="text-sm font-semibold">{step.label}</span>
                  {atsStep >= i + 1 ? (
                    <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> {step.doneText}</span>
                  ) : (
                    <span className="text-xs text-slate-500">{step.pendingText(atsStep)}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Final score reveal */}
            <AnimatePresence>
              {atsStep >= 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-cyan-500/20 text-center flex flex-col items-center gap-2 relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Perfect Fit</div>
                  <span className="text-xs text-slate-400">ATS Match Score</span>
                  <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">92% Match</span>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded text-emerald-400">Strong Skill Fit</span>
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-cyan-400">Optimized Formatting</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}

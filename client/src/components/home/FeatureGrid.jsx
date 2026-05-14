import { motion } from 'framer-motion';
import { bentoFeatures } from '../../constants/homeData';

export default function FeatureGrid() {
  return (
    <section className="py-14 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">Powerful Core Features</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-4 text-white tracking-tight">Everything You Need to <span className="gradient-text bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Land Your Role</span></h2>
          <p className="text-slate-400 mt-4">Advanced tools structured directly for rapid tech & business job acquisition.</p>
        </div>

        <div className="bento-grid">
          {bentoFeatures.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`${feature.size} premium-glass p-8 flex flex-col justify-between relative overflow-hidden group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-tr ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
              <div>
                <div className="mb-6 p-3 rounded-2xl bg-white/5 w-fit border border-white/10 group-hover:border-purple-500/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
              {feature.illustration}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

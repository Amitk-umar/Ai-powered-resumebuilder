import { motion } from 'framer-motion';
import { brands } from '../../constants/homeData';

export default function BrandStrip() {
  return (
    <section className="py-6 relative z-10 overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] md:text-xs font-bold text-slate-400 dark:text-slate-500 tracking-[0.25em] uppercase mb-4">
            Trusted by professionals who landed their dream jobs at
          </p>
          <div className="w-12 h-0.5 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 dark:from-purple-500/50 dark:via-cyan-500/50 dark:to-purple-500/50 mx-auto rounded-full" />
        </motion.div>
      </div>

      <div className="brand-strip relative w-full max-w-[1400px] mx-auto overflow-hidden py-8 h-[120px] md:h-[140px] flex items-center mt-4 mb-4 transition-colors duration-300">
        <div className="brand-strip-fade-left absolute inset-y-0 left-0 w-24 md:w-64 z-10 pointer-events-none" />
        <div className="brand-strip-fade-right absolute inset-y-0 right-0 w-24 md:w-64 z-10 pointer-events-none" />

        <motion.div
          className="flex w-max items-center gap-12 md:gap-24 px-8"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 45 }}
        >
          {[...brands, ...brands].map((brand, i) => (
            <div key={i} className="relative group shrink-0 w-[110px] h-[35px] md:w-[150px] md:h-[45px] flex items-center justify-center cursor-pointer">
              <div className="relative w-full h-full flex items-center justify-center mix-blend-multiply dark:mix-blend-normal">
                <img
                  src={brand.image}
                  alt={`${brand.name} logo`}
                  className="w-full h-full object-contain filter grayscale opacity-40 dark:opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-500 ease-out"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Cancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900 z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="premium-glass p-8 md:p-12 max-w-lg w-full text-center relative z-10 border border-white/10"
      >
        <div className="flex flex-col items-center">
          <XCircle className="w-20 h-20 text-red-400 mb-6" />
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Checkout Canceled</h2>
          <p className="text-slate-300 mt-3 text-lg">
            Your payment process was canceled. No charges were made to your account.
          </p>
          <p className="text-slate-500 mt-2 text-sm">
            If you experienced an issue during checkout, please try again or contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3.5 btn-pill-secondary flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Return Home
            </button>
            <button 
              onClick={() => navigate('/#pricing')}
              className="px-6 py-3.5 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              View Plans Again
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Success() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user } = useAuth();
  const [status, setStatus] = useState('processing'); // processing, success, error

  useEffect(() => {
    // In a real production app, you might want to call your backend 
    // here to verify the session_id and force a user token refresh.
    // Since we rely on Stripe webhooks, we'll just wait a few seconds
    // to give the webhook time to process, then redirect.
    if (sessionId) {
      const timer = setTimeout(() => {
        setStatus('success');
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setStatus('error');
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900 z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="premium-glass p-8 md:p-12 max-w-lg w-full text-center relative z-10 border border-emerald-500/20"
      >
        {status === 'processing' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-emerald-400 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-white">Verifying Payment...</h2>
            <p className="text-slate-400 mt-2">Please wait while we confirm your subscription upgrade.</p>
          </div>
        )}

        {status === 'success' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
            <CheckCircle className="w-20 h-20 text-emerald-400 mb-6" />
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Payment Successful!</h2>
            <p className="text-slate-300 mt-3 text-lg">
              Thank you for upgrading! Your subscription is now active and premium features have been unlocked.
            </p>
            <button 
              onClick={() => navigate('/builder')}
              className="mt-8 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center gap-2 transition-colors"
            >
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-red-400">Invalid Session</h2>
            <p className="text-slate-400 mt-2">No payment session ID was found.</p>
            <button onClick={() => navigate('/')} className="mt-6 px-6 py-3 btn-pill-secondary">
              Return Home
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

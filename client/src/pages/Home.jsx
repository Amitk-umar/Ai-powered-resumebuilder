import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Cpu, FileText, CheckCircle, TrendingUp,
  Award, Search, ArrowRight, Play, Check, Plus, Minus,
  Star, ChevronDown, Briefcase, BarChart, ShieldCheck,
  HelpCircle, Zap, RefreshCw, Send, Users, Globe, Smile
} from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import FloatingOrbs from '../components/FloatingOrbs';
import './Home.css';

export default function Home() {
  const { user } = useAuth();
  const [isYearly, setIsYearly] = useState(false);
  const [faqOpen, setFaqOpen] = useState({});
  const [atsStep, setAtsStep] = useState(0);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState('');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const [isAtsScanning, setIsAtsScanning] = useState(false);


  // Auto-run or manually triggered ATS scanner simulation
  const runAtsScan = () => {
    if (isAtsScanning) return;
    setIsAtsScanning(true);
    setAtsStep(1);

    const timers = [
      setTimeout(() => setAtsStep(2), 1200),
      setTimeout(() => setAtsStep(3), 2400),
      setTimeout(() => setAtsStep(4), 3600),
      setTimeout(() => {
        setIsAtsScanning(false);
      }, 4800)
    ];

    return () => timers.forEach(clearTimeout);
  };

  useEffect(() => {
    // Initial auto-scan on page load
    const initialScan = setTimeout(() => {
      runAtsScan();
    }, 2000);
    return () => clearTimeout(initialScan);
  }, []);

  const toggleFaq = (index) => {
    setFaqOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const updateContact = (field, value) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const submitContact = async (e) => {
    e.preventDefault();
    setContactStatus('Sending...');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (!res.ok) throw new Error('Could not send message');
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setContactStatus('Message sent successfully.');
    } catch (error) {
      setContactStatus('Message could not be sent right now.');
    }
  };

  const brands = [
    { name: 'Airbnb', image: '/brand-images/Airbnb_Logo.webp' },
    { name: 'Amazon', image: '/brand-images/Amazon_logo.webp' },
    { name: 'Google', image: '/brand-images/Google_Logo.webp' },
    { name: 'Meta', image: '/brand-images/Meta-Logo.webp' },
    { name: 'Netflix', image: '/brand-images/Netflix_Logo.webp' },
    { name: 'Stripe', image: '/brand-images/Stripe_Logo.webp' },
    { name: 'Apple', image: '/brand-images/apple-Logo.webp' },
    { name: 'Microsoft', image: '/brand-images/microsoft-logo.webp' }
  ];

  const bentoFeatures = [
    {
      title: 'ATS Resume Analysis',
      description: 'Get deep analytical scoring against major ATS software like Greenhouse and Lever, with precise keyword gap matching.',
      icon: <Search className="w-8 h-8 text-cyan-400" />,
      size: 'bento-large',
      gradient: 'from-cyan-500/10 to-blue-500/10',
      illustration: (
        <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>ATS Compatibility</span>
            <span className="text-cyan-400 font-bold">Excellent</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" style={{ width: '88%' }}></div>
          </div>
          <div className="flex gap-2 mt-1">
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Keyword Match</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Format Pass</span>
          </div>
        </div>
      )
    },
    {
      title: 'AI Resume Rewriter',
      description: 'Context-aware bullet optimizer that rewrites weak sentences into quantitative, high-impact achievements.',
      icon: <Sparkles className="w-8 h-8 text-purple-400" />,
      size: 'bento-small',
      gradient: 'from-purple-500/10 to-pink-500/10',
      illustration: (
        <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1 text-[11px]">
          <div className="text-red-400 line-through opacity-60">"Responsible for managing software updates and code fixes"</div>
          <div className="text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3 flex-shrink-0" />
            "Architected automated CI/CD pipeline, reducing deployment times by 42%"
          </div>
        </div>
      )
    },
    {
      title: 'Cover Letter Generator',
      description: 'Tailor-made cover letters that speak directly to the job description requirements using natural AI pacing.',
      icon: <FileText className="w-8 h-8 text-indigo-400" />,
      size: 'bento-small',
      gradient: 'from-indigo-500/10 to-violet-500/10',
      illustration: (
        <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] text-slate-300 flex flex-col gap-1.5">
          <div className="font-semibold text-indigo-400">Dear Hiring Manager,</div>
          <div>Having tracked NextHireAI's market success, I am thrilled to apply for the Senior Frontend Architect position...</div>
        </div>
      )
    },
    {
      title: 'LinkedIn Profile Optimizer',
      description: 'Maximize your digital footprint and recruitability by indexing the most looked-for keywords in recruiters search feeds.',
      icon: <FaLinkedin className="w-8 h-8 text-blue-400" />,
      size: 'bento-large',
      gradient: 'from-blue-500/10 to-cyan-500/10',
      illustration: (
        <div className="mt-4 flex gap-3 items-center p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0 bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-white text-xs">AI</div>
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <div className="h-3 w-24 bg-slate-800 rounded"></div>
            <div className="h-2 w-full bg-slate-800 rounded"></div>
            <div className="h-2 w-3/4 bg-slate-800 rounded"></div>
          </div>
          <div className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] font-semibold border border-blue-500/20">+15% Views</div>
        </div>
      )
    },
    {
      title: 'Interview Prep AI',
      description: 'Practice interactive interview questions tailored explicitly to the resume you submit, with professional response guides.',
      icon: <Award className="w-8 h-8 text-amber-400" />,
      size: 'bento-large',
      gradient: 'from-amber-500/10 to-orange-500/10',
      illustration: (
        <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
          <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> AI Coach Interview Question:
          </div>
          <p className="text-[10px] text-slate-300 leading-normal">"Walk me through a time you resolved a major production bottleneck under high pressure. How did you align the team?"</p>
        </div>
      )
    },
    {
      title: 'Job Tracker Dashboard',
      description: 'An elegant visual kanban board to monitor application stages, schedule followups, and calculate success stats.',
      icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
      size: 'bento-small',
      gradient: 'from-emerald-500/10 to-green-500/10',
      illustration: (
        <div className="mt-4 flex gap-1.5 justify-between">
          <div className="flex-1 p-2 rounded bg-slate-900/60 border border-slate-800 text-[9px] flex flex-col gap-1">
            <span className="font-semibold text-yellow-400">Applied (12)</span>
            <div className="h-1 bg-yellow-400/20 rounded"></div>
          </div>
          <div className="flex-1 p-2 rounded bg-slate-900/60 border border-slate-800 text-[9px] flex flex-col gap-1">
            <span className="font-semibold text-cyan-400">Interviewing (4)</span>
            <div className="h-1 bg-cyan-400/20 rounded"></div>
          </div>
        </div>
      )
    }
  ];

  const floatingCards = [
    { text: 'Become Job Ready', delay: 0.1, x: -140, y: -190, bg: 'linear-gradient(135deg, #ED4264 0%, #FFEDBC 51%, #ED4264 100%)', shadow: 'rgba(237, 66, 100, 0.35)' },
    { text: 'AI Resume Score: 92%', delay: 0.3, x: 180, y: -160, bg: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 51%, #00c6ff 100%)', shadow: 'rgba(0, 114, 255, 0.35)' },
    { text: 'ATS Optimized', delay: 0.5, x: -190, y: -60, bg: 'linear-gradient(135deg, #1D976C 0%, #93F9B9 51%, #1D976C 100%)', shadow: 'rgba(29, 151, 108, 0.35)' },
    { text: 'Interview Ready', delay: 0.2, x: 190, y: -40, bg: 'linear-gradient(135deg, #DD5E89 0%, #F7BB97 51%, #DD5E89 100%)', shadow: 'rgba(221, 94, 137, 0.35)' },
    { text: 'LinkedIn Optimized', delay: 0.4, x: -180, y: 80, bg: 'linear-gradient(135deg, #4568DC 0%, #B06AB8 51%, #4568DC 100%)', shadow: 'rgba(69, 104, 220, 0.35)' },
    { text: 'AI Bullet Rewrite', delay: 0.6, x: 160, y: 100, bg: 'linear-gradient(135deg, #654ea3 0%, #eaafc8 51%, #654ea3 100%)', shadow: 'rgba(101, 78, 163, 0.35)' },
    { text: 'Job Tracker Active', delay: 0.7, x: -120, y: 180, bg: 'linear-gradient(135deg, #8A2387 0%, #E94057 51%, #F27121 100%)', shadow: 'rgba(233, 64, 87, 0.35)' },
    { text: 'Hire Faster', delay: 0.8, x: 120, y: 200, bg: 'linear-gradient(135deg, #f12711 0%, #f5af19 51%, #f12711 100%)', shadow: 'rgba(241, 39, 17, 0.35)' }
  ];

  return (
    <div className="home-page text-slate-100 min-h-screen relative overflow-x-hidden">
      <FloatingOrbs />

      {/* Hero mesh background glows */}
      <div className="glowing-orb glow-purple w-[500px] h-[500px] top-[-100px] left-[-200px]" />
      <div className="glowing-orb glow-cyan w-[500px] h-[500px] top-[100px] right-[-200px]" />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-20 md:pt-24 md:pb-28 z-10">
        <div className="hero-grid-overlay" />
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Hero Side */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-left relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur text-xs text-slate-300 w-fit"
            >
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>Next-Gen Career Optimization Engine</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white"
            >
              Land More Interviews with <span className="gradient-text bg-gradient-to-r from-purple-400 via-violet-500 to-cyan-400 bg-clip-text text-transparent">AI-Powered</span> Resume Optimization
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-300 max-w-xl leading-relaxed"
            >
              Instantly bypass ATS screening software, optimize missing keyword gaps, leverage real-time AI bullet enhancements, and build a career profile that commands industry attention.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mt-2"
            >
              <Link to={user ? '/builder' : '/signup'} className="px-8 py-4 rounded-2xl font-bold premium-btn-primary flex items-center gap-2">
                Start For Free <ArrowRight className="w-5 h-5" />
              </Link>
              <button onClick={runAtsScan} className="px-8 py-4 rounded-2xl font-bold premium-btn-secondary flex items-center gap-2">
                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" /> Watch Live Scan
              </button>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5 mt-4 text-xs font-medium text-slate-400 max-w-md"
            >
              <div>
                <span className="block text-2xl font-extrabold text-white">25K+</span>
                Resumes Evaluated
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-cyan-400">92%</span>
                ATS Pass Rate
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-purple-400">10x</span>
                Interview Rate Boost
              </div>
            </motion.div>
          </div>

          {/* Right Hero Side */}
          <div className="lg:col-span-6 flex justify-center items-center relative min-h-[400px] sm:min-h-[500px]">
            {/* Soft pulse glow ring */}
            <div className="absolute w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] md:w-[360px] md:h-[360px] rounded-full bg-purple-500/5 border border-purple-500/10 animate-ping pointer-events-none" style={{ animationDuration: '6s' }} />
            <div className="absolute w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] rounded-full bg-cyan-500/5 border border-cyan-500/10 animate-pulse pointer-events-none" />

            {/* Main Transparent Professional Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative z-10 w-[270px] h-[270px] sm:w-[340px] sm:h-[340px] md:w-[420px] md:h-[420px] rounded-full overflow-hidden bg-gradient-to-b from-purple-500/10 via-slate-900/40 to-slate-950/30 border border-white/10 shadow-2xl flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.15),transparent_60%)] rounded-full" />
              <img
                src="/professional.png"
                alt="Job Ready Tech Professional"
                className="w-[88%] h-[88%] object-contain relative z-10 transform hover:scale-105 transition-transform duration-700 pointer-events-auto"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop";
                }}
              />
            </motion.div>

            {/* Surrounding Floating UI Elements */}
            {floatingCards.map((card, i) => {
              const scaleFactor = isMobile ? 0.55 : isTablet ? 0.75 : 1.0;
              const targetX = card.x * scaleFactor;
              const targetY = card.y * scaleFactor;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: 1,
                    x: targetX,
                    y: [targetY - 8, targetY + 8, targetY - 8]
                  }}
                  transition={{
                    opacity: { duration: 0.6, delay: card.delay },
                    x: { duration: 0.6, delay: card.delay },
                    y: {
                      repeat: Infinity,
                      duration: 4 + (i % 3),
                      ease: "easeInOut"
                    }
                  }}
                  className={`absolute z-20 px-2 py-1 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl border border-white/20 text-[9px] sm:text-xs font-bold text-white flex items-center gap-1.5 cursor-default hover:scale-105 transition-all duration-300`}
                  style={{
                    background: card.bg,
                    backgroundSize: '200% auto',
                    boxShadow: `0 4px 15px ${card.shadow}`
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {card.text}
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* --- PREMIUM BRAND LOGO SHOWCASE --- */}
      <section className="py-12 relative z-10 overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[11px] md:text-xs font-bold text-slate-400 dark:text-slate-500 tracking-[0.25em] uppercase mb-4">
              Empowering Careers at Industry Leaders
            </p>
            <div className="w-12 h-0.5 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 dark:from-purple-500/50 dark:via-cyan-500/50 dark:to-purple-500/50 mx-auto rounded-full" />
          </motion.div>
        </div>

        <div className="relative w-full max-w-[1400px] mx-auto overflow-hidden border-t border-b border-[var(--glass-border)] bg-[var(--bg-primary)] py-8 h-[120px] md:h-[140px] flex items-center mt-12 mb-12 transition-colors duration-300">
          {/* Edge Fade Masks for Smooth Infinite Scroll */}
          <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />

          {/* Framer Motion Auto-Scroll Track */}
          <motion.div
            className="flex w-max items-center gap-12 md:gap-24 px-8"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 45,
            }}
          >
            {/* Render array twice for seamless infinite scroll */}
            {[...brands, ...brands].map((brand, i) => (
              <div
                key={i}
                className="relative group shrink-0 w-[110px] h-[35px] md:w-[150px] md:h-[45px] flex items-center justify-center cursor-pointer"
              >
                {/* Logo Image Normalization Wrapper */}
                <div className="relative w-full h-full flex items-center justify-center mix-blend-multiply dark:mix-blend-normal">
                  <img
                    src={brand.image}
                    alt={`${brand.name} logo`}
                    className="w-full h-full object-contain filter grayscale opacity-40 dark:opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 group-hover:drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-500 ease-out"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- BENTO FEATURES SECTION --- */}
      <section className="py-24 relative z-10">
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
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`${feature.size} premium-glass p-8 flex flex-col justify-between relative overflow-hidden group`}
              >
                {/* Glow overlay */}
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

      {/* --- LIVE ATS DEMO SECTION --- */}
      <section className="py-24 relative z-10 bg-transparent border-t border-b border-white/5">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-5 flex flex-col gap-6">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 w-fit">Interactive Simulator</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Experience our Real-Time <span className="text-cyan-400">ATS Analyzer</span></h2>
            <p className="text-slate-300 leading-relaxed">
              Witness how recruiters index and scan resumes. Our live interactive sandbox parses incoming resumes, scores matches, lists skill omissions, and delivers instantaneous suggestions.
            </p>
            <button
              onClick={runAtsScan}
              disabled={isAtsScanning}
              className="px-6 py-3.5 rounded-2xl font-bold premium-btn-primary flex items-center gap-2 w-fit disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isAtsScanning ? 'animate-spin' : ''}`} />
              {isAtsScanning ? 'Scanning in Progress…' : 'Trigger Simulation Scan'}
            </button>
          </div>

          <div className="lg:col-span-7">
            <div className="premium-glass p-8 relative overflow-hidden scanning-shimmer">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-md">Live ATS Tracker v2.4</span>
              </div>

              {/* Status display list */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5">
                  <span className="text-sm font-semibold">1. Upload Resume File</span>
                  {atsStep >= 1 ? (
                    <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Completed</span>
                  ) : (
                    <span className="text-xs text-slate-500">Waiting...</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5">
                  <span className="text-sm font-semibold">2. Scan Semantic Keywords</span>
                  {atsStep >= 2 ? (
                    <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Parsed</span>
                  ) : (
                    <span className="text-xs text-slate-500">{atsStep === 1 ? 'Reading...' : 'Waiting...'}</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5">
                  <span className="text-sm font-semibold">3. Evaluate Job Omissions</span>
                  {atsStep >= 3 ? (
                    <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Evaluated</span>
                  ) : (
                    <span className="text-xs text-slate-500">{atsStep === 2 ? 'Analyzing...' : 'Waiting...'}</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5">
                  <span className="text-sm font-semibold">4. Generate Compatibility Score</span>
                  {atsStep >= 4 ? (
                    <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Scored</span>
                  ) : (
                    <span className="text-xs text-slate-500">{atsStep === 3 ? 'Calculating...' : 'Waiting...'}</span>
                  )}
                </div>
              </div>

              {/* Match Score Display */}
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

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">The Method</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-4 text-white tracking-tight">How NextHireAI <span className="gradient-text bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Optimizes Careers</span></h2>
            <p className="text-slate-400 mt-4">Three simple steps to build, tailor, and test a powerhouse modern professional portfolio.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 steps-timeline">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="premium-glass p-8 flex flex-col gap-4 relative z-10"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-400 text-lg">01</div>
              <h3 className="text-xl font-bold text-white">Upload Resume</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Import your current resume in PDF or Word format, or build one fresh with our guided templates.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="premium-glass p-8 flex flex-col gap-4 relative z-10"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 text-lg">02</div>
              <h3 className="text-xl font-bold text-white">Paste Job Description</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Input target job advertisements to parse specific technical keywords, credentials, and required skillsets.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="premium-glass p-8 flex flex-col gap-4 relative z-10"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 text-lg">03</div>
              <h3 className="text-xl font-bold text-white">Get Optimization AI Suggestions</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Apply context-aware AI rewrite changes to align seamlessly with recruiters search queries instantly.</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-24 relative z-10 bg-transparent border-t border-b border-white/5">
        <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="premium-glass p-8 text-center flex flex-col gap-2 hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="p-3 bg-purple-500/10 rounded-full w-fit mx-auto border border-purple-500/20">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-4xl font-extrabold text-white">25K+</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Resumes Optimized</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="premium-glass p-8 text-center flex flex-col gap-2 hover:border-cyan-500/30 transition-all duration-300"
          >
            <div className="p-3 bg-cyan-500/10 rounded-full w-fit mx-auto border border-cyan-500/20">
              <Globe className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-4xl font-extrabold text-white">12K+</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Global Users</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="premium-glass p-8 text-center flex flex-col gap-2 hover:border-indigo-500/30 transition-all duration-300"
          >
            <div className="p-3 bg-indigo-500/10 rounded-full w-fit mx-auto border border-indigo-500/20">
              <CheckCircle className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-4xl font-extrabold text-white">89%</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Interview Success Rate</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="premium-glass p-8 text-center flex flex-col gap-2 hover:border-emerald-500/30 transition-all duration-300"
          >
            <div className="p-3 bg-emerald-500/10 rounded-full w-fit mx-auto border border-emerald-500/20">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-4xl font-extrabold text-white">1M+</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">AI Enhancements Created</span>
          </motion.div>

        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">Success Stories</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-4 text-white tracking-tight">Vouched For by <span className="gradient-text bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Top Tech Seekers</span></h2>
            <p className="text-slate-400 mt-4">Read testimonials from professionals who redefined their careers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="premium-glass p-8 flex flex-col gap-4 relative overflow-hidden group"
            >
              <div className="flex gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-slate-300 text-sm italic leading-relaxed">
                "NextHireAI completely rebuilt my confidence. I went from sending out hundreds of resumes with zero responses, to landing interviews with Stripe and Meta within 10 days."
              </p>
              <div className="flex gap-3 items-center border-t border-white/5 pt-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-xs">SM</div>
                <div>
                  <span className="block text-sm font-bold text-white">Sarah Miller</span>
                  <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">Frontend Lead @ Stripe</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="premium-glass p-8 flex flex-col gap-4 relative overflow-hidden group"
            >
              <div className="flex gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-slate-300 text-sm italic leading-relaxed">
                "The live ATS simulation matches keywords flawlessly. It listed precisely what gaps I had, and the automated AI bullet rewriter turned weak points into high impact quantitative bullets."
              </p>
              <div className="flex gap-3 items-center border-t border-white/5 pt-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-white text-xs">KP</div>
                <div>
                  <span className="block text-sm font-bold text-white">Kevin Patel</span>
                  <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">Staff DevOps Engineer</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="premium-glass p-8 flex flex-col gap-4 relative overflow-hidden group"
            >
              <div className="flex gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-slate-300 text-sm italic leading-relaxed">
                "Using the LinkedIn Profile optimizer increased my profile recruitment views by almost 300% in a week. Outstanding SaaS tool built on authentic job market dynamics."
              </p>
              <div className="flex gap-3 items-center border-t border-white/5 pt-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white text-xs">EL</div>
                <div>
                  <span className="block text-sm font-bold text-white">Elena Lopez</span>
                  <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">Product Manager</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section className="py-24 relative z-10 bg-transparent border-t border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">Simple Pricing</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-4 text-white tracking-tight">Flexible Plans, <span className="gradient-text bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">No Surprises</span></h2>

            {/* Monthly / Yearly Toggle */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <span className={`text-sm ${!isYearly ? 'text-white font-bold' : 'text-slate-400'}`}>Monthly</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="w-14 h-8 rounded-full bg-white/10 p-1 transition-all duration-300 relative border border-white/10"
              >
                <div className={`w-6 h-6 rounded-full bg-purple-500 transition-all duration-300 transform ${isYearly ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <span className={`text-sm ${isYearly ? 'text-white font-bold' : 'text-slate-400'} flex items-center gap-1.5`}>
                Yearly <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-400 border border-emerald-500/30">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">

            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="premium-glass p-8 flex flex-col justify-between"
            >
              <div className="flex flex-col gap-4">
                <span className="text-xs uppercase font-bold text-slate-400">Starter</span>
                <span className="text-2xl font-extrabold text-white">Free Sandbox</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-extrabold text-white">&#x20B9;0</span>
                  <span className="text-xs text-slate-400">/ forever</span>
                </div>
                <p className="text-slate-400 text-sm mt-2 border-b border-white/5 pb-4">Essential tools to experience AI resume building and preview score analytics.</p>
                <ul className="flex flex-col gap-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Basic Resume Template</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> 1 Full ATS Compatibility Scan</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> AI Score Breakdown</li>
                </ul>
              </div>
              <Link to={user ? '/builder' : '/signup'} className="mt-8 px-6 py-3.5 rounded-2xl text-center font-bold premium-btn-secondary text-sm">
                Get Started
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="premium-glass p-8 flex flex-col justify-between relative overflow-hidden border-purple-500/40 shadow-[0_0_40px_rgba(139,92,246,0.15)] bg-slate-900/40"
            >
              <div className="absolute top-2.5 right-2.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">Most Popular</div>
              <div className="flex flex-col gap-4">
                <span className="text-xs uppercase font-bold text-purple-400">Professional</span>
                <span className="text-2xl font-extrabold text-white">Premium Pro</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-extrabold text-white">&#x20B9;{isYearly ? '500' : '700'}</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-slate-400 text-sm mt-2 border-b border-white/5 pb-4">The ultimate bundle to run tailored applications and leverage infinite AI optimizations.</p>
                <ul className="flex flex-col gap-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> <strong>Unlimited</strong> Premium Templates</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> <strong>Unlimited</strong> Live ATS Scans</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Complete AI Bullet Rewriter</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Cover Letter Generator</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> LinkedIn Optimizer</li>
                </ul>
              </div>
              <Link to={user ? '/builder' : '/signup'} className="mt-8 px-6 py-3.5 rounded-2xl text-center font-bold premium-btn-primary text-sm shadow-md">
                Upgrade to Pro
              </Link>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="premium-glass p-8 flex flex-col justify-between"
            >
              <div className="flex flex-col gap-4">
                <span className="text-xs uppercase font-bold text-slate-400">Corporate</span>
                <span className="text-2xl font-extrabold text-white">Career Coach</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-extrabold text-white">&#x20B9;{isYearly ? '1500' : '2000'}</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-slate-400 text-sm mt-2 border-b border-white/5 pb-4">Structured for colleges, corporate bootcamps, and executive job consultants.</p>
                <ul className="flex flex-col gap-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Multi-Seat User Management</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Interactive Mock Interview AI</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Custom branding and exports</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Dedicated Account Manager</li>
                </ul>
              </div>
              <Link to={user ? '/builder' : '/signup'} className="mt-8 px-6 py-3.5 rounded-2xl text-center font-bold premium-btn-secondary text-sm">
                Get Enterprise
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">Help Center</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-4 text-white tracking-tight">Frequently Asked <span className="text-purple-400">Questions</span></h2>
            <p className="text-slate-400 mt-4">Everything you need to understand about Applicant Tracking Systems & AI optimization.</p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { q: 'How does the ATS Scanner evaluate compatibility?', a: 'Our parsing engine simulates major applicant tracking systems (Greenhouse, Lever, Workday) by evaluating technical skill indexes, phrase combinations, job level hierarchies, and semantic synonyms to score match levels.' },
              { q: 'Is my uploaded resume kept private and secure?', a: 'Absolutely. We operate high-end Firebase data encryption protocols. Your inputs, generated drafts, and uploaded documents are entirely secure, private, and owned solely by you.' },
              { q: 'Can I cancel my Premium Pro plan at any time?', a: 'Yes. You can manage, pause, or cancel subscriptions seamlessly directly inside your user settings panel with zero penalty fees or trailing commitments.' },
              { q: 'How do the AI rewrites avoid sounding robotic?', a: 'Unlike generic LLM blocks, our tailored prompt instructions leverage quantitative models that map real actions to measurable business impacts, creating extremely compelling professional sentences.' }
            ].map((faq, index) => (
              <div key={index} className="premium-glass overflow-hidden transition-all duration-300">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 flex justify-between items-center text-white font-bold hover:text-purple-400 transition-colors"
                >
                  <span className="flex items-center gap-2.5 text-base md:text-lg">
                    <HelpCircle className="w-5 h-5 text-purple-400 flex-shrink-0" /> {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${faqOpen[index] ? 'transform rotate-180 text-purple-400' : ''}`} />
                </button>
                <AnimatePresence>
                  {faqOpen[index] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
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

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-24 relative z-10 px-6">
        <div className="container mx-auto max-w-5xl premium-glass cta-card-container py-20 px-8 md:py-24 md:px-16 relative overflow-hidden text-center flex flex-col items-center gap-6 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
          <div className="glowing-orb glow-purple w-[250px] h-[250px] top-[-50px] left-[-50px] opacity-40" />
          <div className="glowing-orb glow-cyan w-[250px] h-[250px] bottom-[-50px] right-[-50px] opacity-40" />

          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 w-fit relative z-10">Instant Deployment</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight relative z-10">Maximize Your Career Opportunities Today</h2>
          <p className="text-slate-300 max-w-2xl leading-relaxed relative z-10">
            Join thousands of professionals globally land interviews at world-leading organizations. Deploy AI-optimized resume drafts in seconds.
          </p>
          <div className="flex gap-4 relative z-10 mt-2">
            <Link to={user ? '/builder' : '/signup'} className="px-8 py-4 rounded-2xl font-bold premium-btn-primary flex items-center gap-2">
              Get Started For Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section className="py-20 relative z-10 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">Contact Us</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-4 text-white tracking-tight">Need Help With Your Resume?</h2>
            <p className="text-slate-400 mt-4">Send your question to the team. Admin can review every message from the dashboard.</p>
          </div>
          <form className="premium-glass p-6 md:p-8 contact-form" onSubmit={submitContact}>
            <div className="contact-grid">
              <input className="form-input" placeholder="Your name" value={contactForm.name} onChange={e => updateContact('name', e.target.value)} required />
              <input className="form-input" type="email" placeholder="Email address" value={contactForm.email} onChange={e => updateContact('email', e.target.value)} required />
            </div>
            <input className="form-input" placeholder="Subject" value={contactForm.subject} onChange={e => updateContact('subject', e.target.value)} />
            <textarea className="form-input form-textarea" rows="5" placeholder="Write your message..." value={contactForm.message} onChange={e => updateContact('message', e.target.value)} required />
            <div className="contact-submit-row">
              <button className="px-6 py-3 rounded-2xl font-bold premium-btn-primary flex items-center gap-2" type="submit">
                <Send className="w-4 h-4" /> Send Message
              </button>
              {contactStatus && <span>{contactStatus}</span>}
            </div>
          </form>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="premium-footer py-16 relative z-10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

          <div className="flex flex-col gap-4">
            <span className="text-xl font-bold footer-title flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" /> NextHire<span className="gradient-text bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
            </span>
            <p className="text-xs footer-text leading-relaxed">World-class AI-powered career coach and optimization tool mapping job-seekers to elite positions worldwide.</p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider footer-title">Platform</span>
            <Link to="/" className="text-xs footer-link transition-colors">Features</Link>
            <Link to="/builder" className="text-xs footer-link transition-colors">Resume Builder</Link>
            <Link to="/screener" className="text-xs footer-link transition-colors">AI Screener</Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider footer-title">Company</span>
            <Link to="/" className="text-xs footer-link transition-colors">About Us</Link>
            <Link to="/" className="text-xs footer-link transition-colors">Career Blog</Link>
            <Link to="/" className="text-xs footer-link transition-colors">Privacy Policy</Link>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider footer-title">Newsletter</span>
            <p className="text-xs footer-text">Receive expert optimization tips directly inside your inbox weekly.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email..." className="px-3.5 py-2.5 rounded-xl text-xs footer-input focus:border-purple-400 w-full" />
              <button className="p-2.5 bg-purple-500 rounded-xl hover:bg-purple-600 transition-colors flex items-center justify-center text-white"><Send className="w-4 h-4" /></button>
            </div>
          </div>

        </div>
        <div className="container mx-auto px-6 border-t border-white/5 pt-8 text-center text-xs flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="footer-text">© 2026 NextHireAI. All rights reserved. Made with ❤️ for ambitious professionals.</span>
          <div className="flex gap-4">
            <Link to="/" className="footer-link transition-colors">Privacy Policy</Link>
            <Link to="/" className="footer-link transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

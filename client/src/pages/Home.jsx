import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FloatingOrbs from '../components/FloatingOrbs';
import HeroSection from '../components/home/HeroSection';
import BrandStrip from '../components/home/BrandStrip';
import FeatureGrid from '../components/home/FeatureGrid';
import AtsDemoSection from '../components/home/AtsDemoSection';
import HowItWorks from '../components/home/HowItWorks';
import StatsSection from '../components/home/StatsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import PricingSection from '../components/home/PricingSection';
import FaqSection from '../components/home/FaqSection';
import CtaSection from '../components/home/CtaSection';
import ContactSection from '../components/home/ContactSection';
import FooterSection from '../components/home/FooterSection';
import './Home.css';

/**
 * Landing page orchestrator.
 * Each visual section lives in its own component under components/home/.
 */
export default function Home() {
  const { user } = useAuth();

  // ATS demo scanner state (shared between hero CTA and ATS section)
  const [atsStep, setAtsStep] = useState(0);
  const [isAtsScanning, setIsAtsScanning] = useState(false);

  // Responsive breakpoint helpers
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  /** Runs the 4-step ATS scan animation sequence. */
  const runAtsScan = () => {
    if (isAtsScanning) return;
    setIsAtsScanning(true);
    setAtsStep(1);

    const timers = [
      setTimeout(() => setAtsStep(2), 1200),
      setTimeout(() => setAtsStep(3), 2400),
      setTimeout(() => setAtsStep(4), 3600),
      setTimeout(() => setIsAtsScanning(false), 4800),
    ];
    return () => timers.forEach(clearTimeout);
  };

  // Auto-trigger scan on first load
  useEffect(() => {
    const timer = setTimeout(runAtsScan, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-page text-slate-100 min-h-screen relative overflow-x-hidden">
      <FloatingOrbs />

      {/* Hero mesh background glows */}
      <div className="glowing-orb glow-purple w-[500px] h-[500px] top-[-100px] left-[-200px]" />
      <div className="glowing-orb glow-cyan w-[500px] h-[500px] top-[100px] right-[-200px]" />

      <HeroSection user={user} runAtsScan={runAtsScan} isMobile={isMobile} isTablet={isTablet} />
      <BrandStrip />
      <FeatureGrid />
      <AtsDemoSection atsStep={atsStep} isAtsScanning={isAtsScanning} runAtsScan={runAtsScan} />
      <HowItWorks />
      <StatsSection />
      <TestimonialsSection />
      <PricingSection user={user} />
      <FaqSection />
      <CtaSection user={user} />
      <ContactSection />
      <FooterSection />
    </div>
  );
}

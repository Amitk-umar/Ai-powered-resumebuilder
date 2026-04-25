import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FloatingOrbs from '../components/FloatingOrbs';
import {
  HiDocumentText,
  HiLightningBolt,
  HiChartBar,
  HiShieldCheck,
  HiArrowRight,
  HiStar,
  HiTemplate,
  HiDownload
} from 'react-icons/hi';
import './Home.css';

export default function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: <HiLightningBolt />,
      title: 'AI Resume Screening',
      description: 'Get instant ATS compatibility scores. Our AI analyzes your resume against job descriptions to maximize your chances.',
      color: '#6366f1'
    },
    {
      icon: <HiDocumentText />,
      title: 'Smart Resume Builder',
      description: 'Build professional, ATS-friendly resumes with our intuitive builder. Choose from curated templates designed to impress.',
      color: '#8b5cf6'
    },
    {
      icon: <HiChartBar />,
      title: 'Score Analysis',
      description: 'Detailed breakdown of keyword matches, missing skills, and actionable improvement suggestions.',
      color: '#06b6d4'
    },
    {
      icon: <HiShieldCheck />,
      title: 'ATS Optimized',
      description: 'Every template is tested against major Applicant Tracking Systems to ensure your resume gets through.',
      color: '#22c55e'
    },
    {
      icon: <HiTemplate />,
      title: 'Multiple Templates',
      description: 'Choose from Modern, Professional, and Minimal templates — all optimized for readability and ATS parsing.',
      color: '#f59e0b'
    },
    {
      icon: <HiDownload />,
      title: 'PDF Export',
      description: 'Download your resume as a perfectly formatted PDF, ready to submit to any employer or job portal.',
      color: '#ec4899'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Resumes Built' },
    { value: '95%', label: 'ATS Pass Rate' },
    { value: '50+', label: 'Industries Covered' },
    { value: '4.9★', label: 'User Rating' }
  ];

  return (
    <div className="home-page">
      <FloatingOrbs />

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge badge badge-primary fade-in-up">
              <HiStar /> AI-Powered Resume Platform
            </div>
            <h1 className="hero-title fade-in-up delay-1">
              Build & Screen Resumes with{' '}
              <span className="gradient-text">Artificial Intelligence</span>
            </h1>
            <p className="hero-subtitle fade-in-up delay-2">
              Create ATS-friendly resumes that land interviews. Screen candidates instantly
              with AI-powered analysis. Your career success starts here.
            </p>
            <div className="hero-actions fade-in-up delay-3">
              <Link to={user ? '/builder' : '/signup'} className="btn btn-primary btn-lg">
                Start Building <HiArrowRight />
              </Link>
              <Link to={user ? '/screener' : '/login'} className="btn btn-secondary btn-lg">
                Try AI Screener
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="hero-stats fade-in-up delay-4">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item glass-card">
                <span className="stat-value gradient-text">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features section">
        <div className="container">
          <div className="section-header">
            <h2 className="fade-in-up">Everything You Need to <span className="gradient-text">Land the Job</span></h2>
            <p className="fade-in-up delay-1">Powerful tools designed to give you an unfair advantage in the job market</p>
          </div>

          <div className="features-grid">
            {features.map((feature, i) => (
              <div key={i} className="feature-card glass-card fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon" style={{ background: `${feature.color}20`, color: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works section">
        <div className="container">
          <div className="section-header">
            <h2 className="fade-in-up">How It <span className="gradient-text">Works</span></h2>
            <p className="fade-in-up delay-1">Three simple steps to your perfect resume</p>
          </div>

          <div className="steps-grid">
            <div className="step-card glass-card fade-in-up delay-1">
              <div className="step-number">01</div>
              <h3>Choose a Template</h3>
              <p>Select from ATS-optimized templates designed for your industry and experience level.</p>
            </div>
            <div className="step-card glass-card fade-in-up delay-2">
              <div className="step-number">02</div>
              <h3>Fill Your Details</h3>
              <p>Enter your information in our guided form. AI suggestions help you craft compelling content.</p>
            </div>
            <div className="step-card glass-card fade-in-up delay-3">
              <div className="step-number">03</div>
              <h3>Download & Apply</h3>
              <p>Export your polished resume as PDF and start applying with confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta section">
        <div className="container">
          <div className="cta-card glass-card fade-in-up">
            <h2>Ready to Build Your <span className="gradient-text">Winning Resume</span>?</h2>
            <p>Join thousands of professionals who landed their dream jobs with ResumeAI</p>
            <Link to={user ? '/builder' : '/signup'} className="btn btn-primary btn-lg">
              Get Started Free <HiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <p>© 2026 ResumeAI. Built with ❤️ for job seekers everywhere.</p>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import FloatingOrbs from '../components/FloatingOrbs';
import {
  HiDocumentText,
  HiPlusCircle,
  HiTrash,
  HiPencil,
  HiSearch,
  HiClock,
  HiChartBar,
  HiCheckCircle,
  HiExclamationCircle,
  HiCreditCard,
  HiDownload,
  HiSparkles
} from 'react-icons/hi';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [planInfo, setPlanInfo] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      const [resumesRes, screeningsRes, planRes, companiesRes] = await Promise.all([
        api.get('/resumes').catch(() => null),
        api.get('/screenings').catch(() => null),
        api.get('/plans/me').catch(() => null),
        api.get('/plans/companies').catch(() => null),
      ]);

      if (resumesRes?.ok) setResumes(await resumesRes.json());
      if (screeningsRes?.ok) setScreenings(await screeningsRes.json());
      if (planRes?.ok) setPlanInfo(await planRes.json());
      if (companiesRes?.ok) setCompanies(await companiesRes.json());
    } catch (err) {
      console.log('Could not fetch dashboard data:', err.message);
    }
    setLoadingData(false);
  };

  const requestPlan = async (planKey) => {
    try {
      const res = await api.post('/billing/checkout-session', { planKey });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Could not initiate checkout');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to initiate checkout. Please try again.');
    }
  };

  const deleteResume = async (id) => {
    try { await api.delete(`/resumes/${id}`); }
    catch (err) { console.log('Delete error:', err.message); }
    setResumes((prev) => prev.filter((r) => r._id !== id));
  };

  const deleteScreening = async (id) => {
    try { await api.delete(`/screenings/${id}`); }
    catch (err) { console.log('Delete error:', err.message); }
    setScreenings((prev) => prev.filter((s) => s._id !== id));
  };

  // Last activity from either resumes or screenings
  const getLastActivity = () => {
    const dates = [];
    if (resumes.length > 0) dates.push(new Date(resumes[0].updatedAt || resumes[0].createdAt));
    if (screenings.length > 0) dates.push(new Date(screenings[0].createdAt));
    if (dates.length === 0) return 'N/A';
    const latest = new Date(Math.max(...dates));
    return latest.toLocaleDateString();
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#6366f1';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="page dashboard-page">
      <FloatingOrbs />
      <div className="container">
        {/* Welcome */}
        <div className="dashboard-welcome glass-card fade-in-up">
          <div className="welcome-left">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="avatar"
                className="welcome-avatar"
                referrerPolicy="no-referrer"
                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="welcome-avatar-fallback">
                {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1>Welcome back, <span className="gradient-text">{user?.displayName || 'User'}</span></h1>
              <p>{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Plan */}
        <div className="plan-card glass-card fade-in-up delay-1">
          <div className="plan-main">
            <div className="dash-stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>
              <HiCreditCard />
            </div>
            <div>
              <span className="plan-label">Active Plan</span>
              <h2>{planInfo?.plan?.label || 'Basic'}</h2>
              <p>{planInfo?.plan?.resumeLimitText || '3 resumes total'} • PDF download • Screening history</p>
              {planInfo?.userPlan?.expiresAt && (
                <small>Valid till {new Date(planInfo.userPlan.expiresAt).toLocaleDateString()}</small>
              )}
              {planInfo?.pendingRequest && (
                <small className="pending-text">Pending admin approval for {planInfo.pendingRequest.requestedPlan}</small>
              )}
            </div>
          </div>
          <div className="plan-actions">
            {planInfo?.plan?.name !== 'pro' && planInfo?.plan?.name !== 'premium' && (
              <button className="btn btn-secondary btn-sm" onClick={() => requestPlan('pro')}>
                Upgrade to Pro
              </button>
            )}
            {planInfo?.plan?.name !== 'premium' && (
              <button className="btn btn-primary btn-sm" onClick={() => requestPlan('premium')}>
                Upgrade to Premium
              </button>
            )}
            {(planInfo?.plan?.name === 'pro' || planInfo?.plan?.name === 'premium') && (
              <button className="btn btn-secondary btn-sm" onClick={async () => {
                try {
                  const res = await api.post('/billing/portal');
                  const data = await res.json();
                  if (data.url) window.location.href = data.url;
                } catch (e) { alert('Could not open billing portal'); }
              }}>
                Manage Subscription
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="dashboard-stats fade-in-up delay-1">
          <div className="dash-stat glass-card">
            <div className="dash-stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>
              <HiDocumentText />
            </div>
            <div>
              <span className="dash-stat-value">{resumes.length}</span>
              <span className="dash-stat-label">Resumes Created</span>
            </div>
          </div>
          <div className="dash-stat glass-card">
            <div className="dash-stat-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
              <HiChartBar />
            </div>
            <div>
              <span className="dash-stat-value">{screenings.length}</span>
              <span className="dash-stat-label">Screenings Done</span>
            </div>
          </div>
          <div className="dash-stat glass-card">
            <div className="dash-stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
              <HiClock />
            </div>
            <div>
              <span className="dash-stat-value">{getLastActivity()}</span>
              <span className="dash-stat-label">Last Activity</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-actions fade-in-up delay-2">
          {planInfo?.plan?.maxResumes > 0 && resumes.length >= planInfo.plan.maxResumes ? (
            <button 
              className="action-card glass-card text-left w-full cursor-not-allowed opacity-80"
              onClick={() => alert(`Resume limit reached (${resumes.length}/${planInfo.plan.maxResumes}). Please upgrade your plan to create more resumes.`)}
            >
              <div className="action-icon" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                <HiExclamationCircle />
              </div>
              <h3>Resume Limit Reached</h3>
              <p>Upgrade to create more resumes</p>
            </button>
          ) : (
            <Link to="/builder" className="action-card glass-card">
              <div className="action-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>
                <HiPlusCircle />
              </div>
              <h3>Create Resume</h3>
              <p>Build a new ATS-friendly resume</p>
            </Link>
          )}
          <Link to="/screener" className="action-card glass-card">
            <div className="action-icon" style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}>
              <HiSearch />
            </div>
            <h3>Screen Resume</h3>
            <p>Analyze resume with AI scoring</p>
          </Link>
        </div>

        {/* Screening History */}
        {screenings.length > 0 && (
          <div className="dashboard-screenings fade-in-up delay-3">
            <div className="resumes-header">
              <h2>Screening History</h2>
              <Link to="/screener" className="btn btn-primary btn-sm">
                <HiSearch /> New Screening
              </Link>
            </div>
            <div className="screenings-list">
              {screenings.map(s => (
                <div key={s._id} className="screening-item glass-card">
                  <div className="screening-item-left">
                    <div className="screening-score-badge" style={{
                      background: `${getScoreColor(s.score)}20`,
                      color: getScoreColor(s.score),
                      border: `1px solid ${getScoreColor(s.score)}40`
                    }}>
                      {s.score}%
                    </div>
                    <div>
                      <h4>{s.fileName}</h4>
                      <p className="screening-meta">
                        <span className="screening-stat">
                          <HiCheckCircle style={{ color: '#22c55e' }} /> {s.matchedCount} matched
                        </span>
                        <span className="screening-stat">
                          <HiExclamationCircle style={{ color: '#f59e0b' }} /> {s.missingCount} missing
                        </span>
                        <span className="screening-date">
                          {new Date(s.createdAt).toLocaleDateString()} at {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="resume-item-actions">
                    <button className="btn btn-ghost btn-sm" title="Delete" onClick={() => deleteScreening(s._id)}>
                      <HiTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {companies.length > 0 && (
          <div className="dashboard-companies fade-in-up delay-3">
            <div className="resumes-header">
              <h2><HiSparkles /> Companies Hiring For Your Skills</h2>
            </div>
            <div className="company-grid">
              {companies.slice(0, 4).map(company => (
                <div className="company-card glass-card" key={company.name}>
                  <h4>{company.name}</h4>
                  <p>{company.role}</p>
                  <small>Matches: {company.match}</small>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resume List */}
        <div className="dashboard-resumes fade-in-up delay-3">
          <div className="resumes-header">
            <h2>My Resumes</h2>
            {planInfo?.plan?.maxResumes > 0 && resumes.length >= planInfo.plan.maxResumes ? (
              <button className="btn btn-primary btn-sm opacity-50 cursor-not-allowed" onClick={() => alert(`Resume limit reached (${resumes.length}/${planInfo.plan.maxResumes}). Please upgrade your plan.`)}>
                <HiPlusCircle /> Limit Reached
              </button>
            ) : (
              <Link to="/builder" className="btn btn-primary btn-sm">
                <HiPlusCircle /> New Resume
              </Link>
            )}
          </div>

          {resumes.length === 0 ? (
            <div className="empty-state glass-card">
              <HiDocumentText className="empty-icon" />
              <h3>No resumes yet</h3>
              <p>Create your first ATS-friendly resume and start landing interviews</p>
              <Link to="/builder" className="btn btn-primary">
                Create Your First Resume
              </Link>
            </div>
          ) : (
            <div className="resumes-list">
              {resumes.map(resume => (
                <div key={resume._id} className="resume-item glass-card">
                  <div className="resume-item-left">
                    <HiDocumentText className="resume-item-icon" />
                    <div>
                      <h4>{resume.title || 'Untitled Resume'}</h4>
                      <p>{resume.template} • Updated {new Date(resume.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="resume-item-actions">
                    <Link to={`/builder?id=${resume._id}`} className="btn btn-ghost btn-sm" title="Edit">
                      <HiPencil />
                    </Link>
                    <Link to={`/builder?id=${resume._id}&preview=1`} className="btn btn-ghost btn-sm" title="View PDF">
                      <HiDownload />
                    </Link>
                    <button className="btn btn-ghost btn-sm" title="Delete" onClick={() => deleteResume(resume._id)}>
                      <HiTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

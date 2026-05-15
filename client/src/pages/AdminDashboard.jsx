import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import FloatingOrbs from '../components/FloatingOrbs';
import {
  HiUsers, HiMail, HiDocumentText, HiCheckCircle, HiXCircle,
  HiClock, HiLightningBolt, HiRefresh, HiTrendingUp, HiChartPie
} from 'react-icons/hi';
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import './AdminDashboard.css';

/* ─── Design Tokens ────────────────────────── */
const PALETTE = {
  indigo:  '#6366f1',
  emerald: '#10b981',
  sky:     '#0ea5e9',
  pink:    '#ec4899',
  amber:   '#f59e0b',
  violet:  '#8b5cf6',
};

const CHART_TOOLTIP_STYLE = {
  backgroundColor: 'rgba(11,15,25,0.95)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  color: '#f8fafc',
  fontSize: '13px',
  padding: '10px 14px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
};

const CHART_GRID_COLOR = 'rgba(255,255,255,0.05)';
const CHART_AXIS_COLOR = '#475569';

/* ─── Custom Tooltip ───────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={CHART_TOOLTIP_STYLE}>
      <p style={{ color: '#94a3b8', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
          <span style={{ color: '#94a3b8', fontSize: 12 }}>{p.name}:</span>
          <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: 13 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── Custom Pie Tooltip ───────────────────── */
const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={CHART_TOOLTIP_STYLE}>
      <span style={{ textTransform: 'capitalize', color: payload[0].payload.fill }}>{payload[0].name}:</span>
      <span style={{ marginLeft: 6, fontWeight: 700 }}>{payload[0].value}</span>
    </div>
  );
};

/* ─── Stat Card ────────────────────────────── */
function StatCard({ label, value, icon: Icon, color, trend }) {
  return (
    <div className="stat-card" style={{ '--stat-accent': color }}>
      <div className="stat-card-top">
        <div className="stat-icon"><Icon /></div>
        <span className={`stat-trend ${trend > 0 ? 'up' : 'neutral'}`}>
          {trend > 0 ? '↑' : '—'} {trend > 0 ? `+${trend}` : 'N/A'}
        </span>
      </div>
      <div className="stat-value">{value.toLocaleString()}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ─── Main Component ───────────────────────── */
export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAdminData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await api.get('/admin/dashboard');
      if (res.ok) setData(await res.json());
    } catch (err) {
      console.error('Admin dashboard error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAdminData(); }, [fetchAdminData]);

  const updateRequest = async (id, action) => {
    await api.patch(`/admin/plan-requests/${id}`, { action });
    fetchAdminData(true);
  };

  const markRead = async (id) => {
    await api.patch(`/admin/contacts/${id}/read`, {});
    fetchAdminData(true);
  };

  /* ─── Derived Data ─── */
  const stats = data?.stats || {};
  const planData = data?.planCounts
    ? Object.entries(data.planCounts).map(([name, value]) => ({ name, value }))
    : [];
  const skillsData = (data?.topSkills || []).slice(0, 8);
  const timeSeriesData = (data?.timeSeriesData || []).map(d => ({
    ...d,
    date: d.date.slice(5), // "MM-DD"
  }));

  const PLAN_COLORS = [PALETTE.indigo, PALETTE.emerald, PALETTE.violet, PALETTE.amber];

  if (loading) {
    return (
      <div className="admin-page">
        <FloatingOrbs />
        <div className="container">
          <div className="admin-loading">
            <div className="spinner" />
            <p>Loading analytics…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <FloatingOrbs />
      <div className="container">

        {/* ── Page Header ─────────────────────── */}
        <header className="admin-page-header">
          <div className="admin-header-left">
            <h1>Admin <span className="gradient-text">Analytics</span></h1>
            <p>Real-time platform insights and management console</p>
          </div>
          <div className="admin-header-right">
            <span className="admin-status-dot">Live</span>
            <button
              className="admin-refresh-btn"
              onClick={() => fetchAdminData(true)}
              disabled={refreshing}
              id="admin-refresh"
            >
              <HiRefresh style={{ fontSize: '1rem', transition: 'transform 0.4s' }} />
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </header>

        {/* ── Stat Cards ──────────────────────── */}
        <div className="admin-stats">
          <StatCard label="Total Users"      value={stats.users          || 0} icon={HiUsers}         color={PALETTE.indigo}  trend={stats.users > 0 ? stats.activeUsers : 0} />
          <StatCard label="Active Users"     value={stats.activeUsers    || 0} icon={HiTrendingUp}    color={PALETTE.emerald} trend={stats.activeUsers} />
          <StatCard label="Resumes / Month"  value={stats.resumesThisMonth || 0} icon={HiDocumentText} color={PALETTE.sky}    trend={stats.resumesThisMonth} />
          <StatCard label="AI Screenings"    value={stats.screeningsCount || 0} icon={HiLightningBolt} color={PALETTE.pink}  trend={stats.screeningsCount} />
          <StatCard label="Contact Forms"    value={stats.contacts       || 0} icon={HiMail}          color={PALETTE.amber}  trend={0} />
          <StatCard label="Pending Upgrades" value={stats.pendingRequests || 0} icon={HiClock}        color={PALETTE.violet} trend={0} />
        </div>

        {/* ── Row 1: User Growth (full width) ─── */}
        <div className="admin-charts-row full">
          <div className="chart-card">
            <div className="chart-card-header">
              <div>
                <div className="admin-section-title">
                  User Growth
                  <span className="title-badge">30 days</span>
                </div>
                <div className="chart-meta">
                  <span className="chart-legend-item">
                    <span className="chart-legend-dot" style={{ background: PALETTE.emerald }} />
                    New Registrations
                  </span>
                </div>
              </div>
            </div>
            <div className="chart-card-body">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={timeSeriesData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="glowLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%"   stopColor={PALETTE.emerald} stopOpacity={0.6} />
                      <stop offset="50%"  stopColor={PALETTE.sky}     stopOpacity={1} />
                      <stop offset="100%" stopColor={PALETTE.indigo}  stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} vertical={false} />
                  <XAxis dataKey="date" stroke={CHART_AXIS_COLOR} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis stroke={CHART_AXIS_COLOR} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone" dataKey="users" name="New Users"
                    stroke={PALETTE.emerald} strokeWidth={2.5}
                    dot={false} activeDot={{ r: 6, fill: PALETTE.emerald, strokeWidth: 2, stroke: '#0b0f19' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Row 2: Area chart + Doughnut ────── */}
        <div className="admin-charts-row three-col">
          {/* Platform Activity */}
          <div className="chart-card">
            <div className="chart-card-header">
              <div>
                <div className="admin-section-title">
                  Platform Activity
                  <span className="title-badge">30 days</span>
                </div>
                <div className="chart-meta">
                  <span className="chart-legend-item">
                    <span className="chart-legend-dot" style={{ background: PALETTE.violet }} />
                    Resumes
                  </span>
                  <span className="chart-legend-item">
                    <span className="chart-legend-dot" style={{ background: PALETTE.pink }} />
                    AI Screenings
                  </span>
                </div>
              </div>
            </div>
            <div className="chart-card-body">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={timeSeriesData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillResumes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={PALETTE.violet} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={PALETTE.violet} stopOpacity={0.01} />
                    </linearGradient>
                    <linearGradient id="fillScreenings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={PALETTE.pink} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={PALETTE.pink} stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} vertical={false} />
                  <XAxis dataKey="date" stroke={CHART_AXIS_COLOR} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis stroke={CHART_AXIS_COLOR} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="resumes"    name="Resumes"      stroke={PALETTE.violet} strokeWidth={2} fill="url(#fillResumes)" />
                  <Area type="monotone" dataKey="screenings" name="AI Screenings" stroke={PALETTE.pink}   strokeWidth={2} fill="url(#fillScreenings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Plan Distribution Doughnut */}
          <div className="chart-card">
            <div className="chart-card-header">
              <div className="admin-section-title">
                <HiChartPie />
                Plan Distribution
              </div>
            </div>
            <div className="chart-card-body">
              {planData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={planData} cx="50%" cy="50%"
                        innerRadius={55} outerRadius={80}
                        paddingAngle={4} dataKey="value" startAngle={90} endAngle={-270}
                      >
                        {planData.map((_, i) => (
                          <Cell key={i} fill={PLAN_COLORS[i % PLAN_COLORS.length]} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="donut-legend">
                    {planData.map((entry, i) => (
                      <div className="donut-legend-item" key={entry.name}>
                        <div className="donut-legend-left">
                          <span className="donut-legend-swatch" style={{ background: PLAN_COLORS[i % PLAN_COLORS.length] }} />
                          <span className="donut-legend-name">{entry.name}</span>
                        </div>
                        <span className="donut-legend-value">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="admin-empty-state"><span className="empty-icon">🥧</span><p>No plan data yet</p></div>
              )}
            </div>
          </div>
        </div>

        {/* ── Row 3: Skills Bar Chart ──────────── */}
        <div className="admin-charts-row full" style={{ marginBottom: 'var(--space-lg)', animation: 'fadeInUp 0.5s ease-out 0.25s both' }}>
          <div className="chart-card">
            <div className="chart-card-header">
              <div className="admin-section-title">
                Top Searched Skills
                <span className="title-badge">AI Screening Insights</span>
              </div>
            </div>
            <div className="chart-card-body">
              {skillsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={skillsData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                    <defs>
                      {skillsData.map((_, i) => (
                        <linearGradient key={i} id={`barGrad${i}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={PLAN_COLORS[i % PLAN_COLORS.length]} stopOpacity={0.9} />
                          <stop offset="100%" stopColor={PLAN_COLORS[i % PLAN_COLORS.length]} stopOpacity={0.5} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} horizontal={false} />
                    <XAxis type="number" stroke={CHART_AXIS_COLOR} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <YAxis dataKey="skill" type="category" stroke={CHART_AXIS_COLOR} width={90} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="count" name="Searches" radius={[0, 6, 6, 0]}>
                      {skillsData.map((_, i) => (
                        <Cell key={i} fill={`url(#barGrad${i})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="admin-empty-state"><span className="empty-icon">📊</span><p>No skills data yet</p></div>
              )}
            </div>
          </div>
        </div>

        {/* ── Row 4: Users table + Plan Requests ── */}
        <div className="admin-data-section">
          {/* Users Table */}
          <div className="data-panel">
            <div className="data-panel-header">
              <div className="admin-section-title">
                <HiUsers style={{ color: PALETTE.indigo }} />
                Registered Users
              </div>
              <span className="data-panel-count">{stats.users || 0} total</span>
            </div>
            <div className="admin-table">
              <div className="admin-table-head">
                <span>User</span>
                <span>Plan</span>
                <span>Joined</span>
              </div>
              {(data?.users || []).slice(0, 10).map(user => (
                <div className="admin-table-row" key={user._id}>
                  <div className="user-info-cell">
                    <div className="user-avatar">
                      {(user.name || user.email || 'U').charAt(0)}
                    </div>
                    <div>
                      <div className="user-name">{user.name || '—'}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                  <span className={`badge badge-${user.plan?.name === 'premium' ? 'warning' : user.plan?.name === 'pro' ? 'primary' : 'success'}`}>
                    {user.plan?.name || 'basic'}
                  </span>
                  <span className="joined-date">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                  </span>
                </div>
              ))}
              {(!data?.users || data.users.length === 0) && (
                <div className="admin-empty-state"><span className="empty-icon">👥</span><p>No users yet</p></div>
              )}
            </div>
          </div>

          {/* Plan Requests */}
          <div className="data-panel">
            <div className="data-panel-header">
              <div className="admin-section-title">
                <HiClock style={{ color: PALETTE.violet }} />
                Plan Requests
              </div>
              <span className="data-panel-count">{stats.pendingRequests || 0} pending</span>
            </div>
            <div className="admin-list">
              {(data?.requests || []).length === 0 && (
                <div className="admin-empty-state"><span className="empty-icon">🎉</span><p>No pending requests</p></div>
              )}
              {(data?.requests || []).map(req => (
                <div className="admin-list-item" key={req._id}>
                  <div className="list-item-text">
                    <h4>{req.userName || req.userEmail}</h4>
                    <p>Wants to upgrade to <strong>{req.requestedPlan}</strong></p>
                    <small>{new Date(req.createdAt).toLocaleString()}</small>
                  </div>
                  <div className="list-item-actions">
                    {req.status === 'pending' ? (
                      <div className="admin-action-btns">
                        <button className="btn-approve" onClick={() => updateRequest(req._id, 'approved')}>
                          <HiCheckCircle /> Approve
                        </button>
                        <button className="btn-reject" onClick={() => updateRequest(req._id, 'rejected')}>
                          <HiXCircle /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className={`badge badge-${req.status === 'approved' ? 'success' : 'error'}`}>
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 5: Contact Forms ─────────────── */}
        <div className="admin-section-row">
          <div className="data-panel">
            <div className="data-panel-header">
              <div className="admin-section-title">
                <HiMail style={{ color: PALETTE.amber }} />
                Contact Form Submissions
              </div>
              <span className="data-panel-count">{stats.contacts || 0} messages</span>
            </div>
            <div className="admin-list">
              {(data?.contacts || []).length === 0 && (
                <div className="admin-empty-state"><span className="empty-icon">📬</span><p>No messages yet</p></div>
              )}
              {(data?.contacts || []).map(contact => (
                <div className="admin-list-item" key={contact._id}>
                  {contact.status === 'new' && <div className="unread-dot" />}
                  <div className="list-item-text" style={{ flex: 1 }}>
                    <h4>{contact.subject}</h4>
                    <p>{contact.message?.slice(0, 120)}{contact.message?.length > 120 ? '…' : ''}</p>
                    <small>{contact.name} · {contact.email} · {new Date(contact.createdAt).toLocaleString()}</small>
                  </div>
                  <div className="list-item-actions">
                    {contact.status === 'new' ? (
                      <button className="btn-read" onClick={() => markRead(contact._id)}>
                        Mark Read
                      </button>
                    ) : (
                      <span className="badge badge-success">Read</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

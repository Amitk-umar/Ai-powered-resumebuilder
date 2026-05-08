import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FloatingOrbs from '../components/FloatingOrbs';
import {
  HiChartBar, HiUsers, HiMail, HiDocumentText,
  HiCheckCircle, HiXCircle, HiClock
} from 'react-icons/hi';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${apiUrl}/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setData(await res.json());
    } catch (error) {
      console.log('Admin dashboard error:', error.message);
    }
    setLoading(false);
  };

  const updateRequest = async (id, action) => {
    const token = await getToken();
    const res = await fetch(`${apiUrl}/admin/plan-requests/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ action })
    });
    if (res.ok) fetchAdminData();
  };

  const markRead = async (id) => {
    const token = await getToken();
    await fetch(`${apiUrl}/admin/contacts/${id}/read`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchAdminData();
  };

  const statCards = [
    ['Users', data?.stats?.users || 0, <HiUsers />, '#6366f1'],
    ['Active Users', data?.stats?.activeUsers || 0, <HiChartBar />, '#22c55e'],
    ['Resumes This Month', data?.stats?.resumesThisMonth || 0, <HiDocumentText />, '#0ea5e9'],
    ['Contact Forms', data?.stats?.contacts || 0, <HiMail />, '#f59e0b'],
    ['Pending Upgrades', data?.stats?.pendingRequests || 0, <HiClock />, '#8b5cf6']
  ];

  return (
    <div className="page admin-page">
      <FloatingOrbs />
      <div className="container">
        <div className="page-header fade-in-up">
          <h1>Admin <span className="gradient-text">Dashboard</span></h1>
          <p>Manage users, plan approvals, resume activity, and contact messages.</p>
        </div>

        {loading ? (
          <div className="loading-screen small-loader"><div className="spinner"></div></div>
        ) : (
          <>
            <div className="admin-stats fade-in-up delay-1">
              {statCards.map(([label, value, icon, color]) => (
                <div className="dash-stat glass-card" key={label}>
                  <div className="dash-stat-icon" style={{ background: `${color}22`, color }}>
                    {icon}
                  </div>
                  <div>
                    <span className="dash-stat-value">{value}</span>
                    <span className="dash-stat-label">{label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-grid">
              <section className="glass-card admin-panel">
                <div className="admin-panel-header">
                  <h2>Users With Plans</h2>
                </div>
                <div className="admin-table">
                  <div className="admin-row admin-head">
                    <span>User</span><span>Plan</span><span>Joined</span>
                  </div>
                  {data?.users?.map(user => (
                    <div className="admin-row" key={user._id}>
                      <span>
                        <strong>{user.name}</strong>
                        <small>{user.email}</small>
                      </span>
                      <span className="badge badge-primary">{user.plan?.name || 'basic'}</span>
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="glass-card admin-panel">
                <div className="admin-panel-header">
                  <h2>Plan Requests</h2>
                </div>
                <div className="admin-list">
                  {data?.requests?.length === 0 && <p className="admin-empty">No upgrade requests yet.</p>}
                  {data?.requests?.map(request => (
                    <div className="admin-list-item" key={request._id}>
                      <div>
                        <strong>{request.userName || request.userEmail}</strong>
                        <p>{request.userEmail} wants {request.requestedPlan}</p>
                        <small>{new Date(request.createdAt).toLocaleString()}</small>
                      </div>
                      {request.status === 'pending' ? (
                        <div className="admin-actions">
                          <button className="btn btn-primary btn-sm" onClick={() => updateRequest(request._id, 'approved')}>
                            <HiCheckCircle /> Approve
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => updateRequest(request._id, 'rejected')}>
                            <HiXCircle /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className={`badge ${request.status === 'approved' ? 'badge-success' : 'badge-error'}`}>
                          {request.status}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="glass-card admin-panel admin-wide">
                <div className="admin-panel-header">
                  <h2>Contact Us Forms</h2>
                </div>
                <div className="admin-list">
                  {data?.contacts?.length === 0 && <p className="admin-empty">No contact messages yet.</p>}
                  {data?.contacts?.map(contact => (
                    <div className="admin-list-item contact-item" key={contact._id}>
                      <div>
                        <strong>{contact.subject}</strong>
                        <p>{contact.message}</p>
                        <small>{contact.name} - {contact.email} - {new Date(contact.createdAt).toLocaleString()}</small>
                      </div>
                      {contact.status === 'new' ? (
                        <button className="btn btn-secondary btn-sm" onClick={() => markRead(contact._id)}>Mark Read</button>
                      ) : (
                        <span className="badge badge-success">read</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="glass-card admin-panel">
                <div className="admin-panel-header">
                  <h2>Plan Chart</h2>
                </div>
                <div className="plan-bars">
                  {['basic', 'pro', 'premium'].map(plan => {
                    const value = data?.planCounts?.[plan] || 0;
                    const max = Math.max(data?.stats?.users || 1, 1);
                    return (
                      <div className="plan-bar-row" key={plan}>
                        <span>{plan}</span>
                        <div className="plan-bar-track">
                          <div className="plan-bar-fill" style={{ width: `${(value / max) * 100}%` }}></div>
                        </div>
                        <strong>{value}</strong>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

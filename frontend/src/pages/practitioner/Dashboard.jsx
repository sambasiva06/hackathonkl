import React, { useState, useEffect } from 'react';
import {
  Users,
  ClipboardList,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Plus,
  Calendar as CalendarNav,
  CheckCircle,
  MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { practitionerService } from '../../services/api';
import Skeleton, { SkeletonCircle } from '../../components/Skeleton';
import CalendarModule from '../../components/CalendarModule';
import Sparkline from '../../components/Sparkline';

const PractitionerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [completingId, setCompletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Dashboard — AyurSutra';
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const resp = await practitionerService.getDashboard();
      setStats(resp.data);
    } catch (err) {
      console.error('Error fetching dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSession = async (sessionId) => {
    if (!window.confirm('Mark this session as completed? Automated recovery tips will be sent to the patient.')) return;

    setCompletingId(sessionId);
    try {
      await practitionerService.updateSessionStatus(sessionId, 'COMPLETED');
      await fetchDashboardData(); // Refresh stats and list
    } catch (err) {
      alert(err.response?.data?.message || 'Error completing session');
    } finally {
      setCompletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="practitioner-dashboard fade-in">
        <div className="stats-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="stat-card">
              <SkeletonCircle size="52px" />
              <div className="stat-content" style={{ flex: 1 }}>
                <Skeleton width="60%" height="14px" />
                <Skeleton width="40%" height="24px" style={{ marginTop: '0.5rem' }} />
              </div>
            </div>
          ))}
        </div>
        <div className="dashboard-grid">
          <div className="dashboard-section main-sec">
            <Skeleton width="30%" height="24px" style={{ marginBottom: '1.5rem' }} />
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                <Skeleton width="15%" height="40px" />
                <Skeleton width="75%" height="40px" />
              </div>
            ))}
          </div>
          <div className="dashboard-section side-sec">
            <Skeleton width="50%" height="24px" style={{ marginBottom: '1.5rem' }} />
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <SkeletonCircle size="36px" />
                <Skeleton width="60%" height="16px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statsData = [
    { label: 'Total Patients', value: stats?.totalPatients || 0, icon: Users, color: '#0d9488' },
    { label: 'Upcoming Sessions', value: stats?.upcomingSessions || 0, icon: ClipboardList, color: '#8b5cf6' },
    { label: 'Completed Today', value: stats?.completedSessions || 0, icon: CheckCircle2, color: '#10b981' },
    { label: 'Pending Feedback', value: stats?.pendingFeedback || 0, icon: Clock, color: '#f59e0b' },
  ];

  return (
    <div className="practitioner-dashboard fade-in">
      <div className="stats-grid">
        {statsData.map((stat, i) => (
          <div key={i} className="stat-card clean-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}10`, color: stat.color }}>
              <stat.icon size={22} />
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-main clean-card">
          <div className="section-header">
            <h2>Upcoming Sessions</h2>
            <div className="view-toggles">
              <button className={`view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>List</button>
              <button className={`view-btn ${view === 'calendar' ? 'active' : ''}`} onClick={() => setView('calendar')}>Calendar</button>
            </div>
          </div>

          {view === 'calendar' ? (
            <CalendarModule
              events={stats?.upcomingSessionList?.map(s => ({ date: s.scheduledDate, title: `[${s.patientName}] ${s.procedureName}` }))}
              onDateSelect={(date) => console.log('Selected:', date)}
            />
          ) : (
            <div className="upcoming-list">
              {stats?.upcomingSessionList?.length > 0 ? (
                stats.upcomingSessionList.map(session => (
                  <div key={session.id} className="session-card-mini clean-card">
                    <div className="s-time">
                      {new Date(session.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="s-info">
                      <strong>{session.procedureName}</strong>
                      <span>{session.patientName}</span>
                    </div>
                    <div className="s-actions">
                      <button
                        className="btn btn-sm btn-outline btn-success"
                        onClick={() => handleCompleteSession(session.id)}
                        disabled={completingId === session.id}
                      >
                        {completingId === session.id ? '...' : <CheckCircle size={16} />}
                        <span className="btn-text">Complete</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No sessions scheduled for today.</div>
              )}
            </div>
          )}
        </section>

        <section className="dashboard-section side-sec clean-card">
          <div className="section-header">
            <h3>Recent Patients</h3>
            <button className="icon-btn-small" onClick={() => navigate('/patients')}><Plus size={18} /></button>
          </div>
          <div className="patient-mini-list">
            {stats?.recentPatients?.map((patient) => (
              <div
                key={patient.id}
                className="patient-mini-item clickable"
                onClick={() => navigate('/plans', { state: { patientId: patient.userId } })}
              >
                <div className="p-avatar">{patient?.name?.[0] || '?'}</div>
                <div className="p-info">
                  <p className="p-name">{patient?.name || 'Unknown'}</p>
                  <p className="p-meta">{patient?.prakriti || 'Dosha not set'}</p>
                </div>
                <Sparkline color={patient?.prakriti === 'Vata' ? '#60a5fa' : patient?.prakriti === 'Pitta' ? '#f87171' : '#fbbf24'} />
                <ArrowUpRight size={14} className="p-chevron" />
              </div>
            ))}
          </div>

          <div className="cta-card">
            <h4>Panchakarma Protocol</h4>
            <p>Ready to schedule? Check your availability on the interactive calendar.</p>
            <button
              className="btn btn-white btn-sm"
              onClick={() => navigate('/schedule')}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              Go to Scheduling
            </button>
          </div>
        </section>
      </div>

      <style>{`
        .practitioner-dashboard { padding-bottom: 2rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 1.25rem; }
        .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .stat-label { font-size: 0.8125rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; margin-bottom: 0.25rem; }
        .stat-value { font-size: 1.5rem; font-weight: 800; color: var(--text-main); }

        .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
        .dashboard-section, .dashboard-main { padding: 1.5rem; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        
        .view-toggles { display: flex; background: #f1f5f9; padding: 0.2rem; border-radius: 8px; }
        .view-btn { padding: 0.4rem 1rem; font-size: 0.75rem; border-radius: 6px; font-weight: 700; border: none; background: transparent; cursor: pointer; color: var(--text-muted); transition: all 0.2s; }
        .view-btn.active { background: white; color: var(--primary); box-shadow: var(--shadow-sm); }

        .session-card-mini { display: flex; align-items: center; padding: 1rem; margin-bottom: 0.75rem; gap: 1rem; border: 1px solid var(--border); }
        .s-time { font-weight: 800; color: var(--primary); font-size: 0.875rem; min-width: 65px; }
        .s-info { flex: 1; }
        .s-info strong { display: block; font-size: 0.9375rem; color: var(--text-main); }
        .s-info span { font-size: 0.8125rem; color: var(--text-muted); }
        
        .s-actions { display: flex; gap: 0.5rem; }
        .btn-success { color: #059669 !important; border-color: #059669 !important; }
        .btn-success:hover { background: #ecfdf5 !important; }
        .btn-success .btn-text { margin-left: 0.4rem; }

        .patient-mini-item { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; padding: 0.5rem; border-radius: 0.75rem; transition: all 0.2s; }
        .patient-mini-item.clickable { cursor: pointer; }
        .patient-mini-item.clickable:hover { background: #f8fafc; }
        .p-avatar { width: 36px; height: 36px; border-radius: 10px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--primary); border: 1px solid var(--border); }
        .p-name { font-size: 0.875rem; font-weight: 700; color: var(--text-main); }
        .p-meta { font-size: 0.75rem; color: var(--text-muted); }
        
        .cta-card { margin-top: 1.5rem; background: var(--primary); padding: 1.5rem; border-radius: var(--radius); color: white; }
        .cta-card h4 { margin-bottom: 0.5rem; font-size: 1rem; font-weight: 700; }
        .cta-card p { font-size: 0.8125rem; margin-bottom: 1rem; opacity: 0.9; line-height: 1.4; }
        .btn-white { background: white; color: var(--primary); border: none; }
        .btn-white:hover { background: #f0fdfa; }

        .empty-state { padding: 3rem 1rem; text-align: center; color: var(--text-muted); font-size: 0.875rem; background: #f8fafc; border-radius: var(--radius); border: 1px dashed var(--border); }
      `}</style>
    </div>
  );
};

export default PractitionerDashboard;

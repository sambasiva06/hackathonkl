import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { practitionerService } from '../../services/api';
import Skeleton, { SkeletonCircle } from '../../components/Skeleton';

const PractitionerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Dashboard — AyurSutra';
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const resp = await practitionerService.getDashboard();
      setData(resp.data);
    } catch (err) {
      console.error('Error fetching dashboard', err);
      alert('Failed to load dashboard data.');
    } finally {
      setLoading(false);
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

  const stats = [
    { label: 'Total Patients', value: data?.totalPatients || 0, icon: Users, color: '#0d9488' },
    { label: 'Upcoming Sessions', value: data?.upcomingSessions || 0, icon: Calendar, color: '#8b5cf6' },
    { label: 'Completed Today', value: data?.completedSessions || 0, icon: CheckCircle2, color: '#10b981' },
    { label: 'Pending Feedback', value: data?.pendingFeedback || 0, icon: Clock, color: '#f59e0b' },
  ];

  return (
    <div className="practitioner-dashboard">
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-section main-sec">
          <div className="section-header">
            <h3>Upcoming Sessions</h3>
            <button className="text-btn" onClick={() => navigate('/schedule')}>View All</button>
          </div>
          <div className="session-list">
            {data?.upcomingSessionList?.length > 0 ? (
              data.upcomingSessionList.map((session) => (
                <div key={session.id} className="session-item">
                  <div className="session-time">
                    <span className="time">{new Date(session.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="date">{new Date(session.scheduledDate).toLocaleDateString()}</span>
                  </div>
                  <div className="session-details">
                    <h4>{session.procedureName}</h4>
                    <p>Patient: {session.patientName}</p>
                  </div>
                  <div className="session-phase-tag">{session.phase}</div>
                  <ChevronRight className="chevron" size={20} />
                </div>
              ))
            ) : (
              <div className="empty-state">No sessions scheduled for today.</div>
            )}
          </div>
        </section>

        <section className="dashboard-section side-sec">
          <div className="section-header">
            <h3>Recent Patients</h3>
            <button className="icon-btn-small" onClick={() => navigate('/patients')}><Plus size={18} /></button>
          </div>
          <div className="patient-mini-list">
            {data?.recentPatients?.map((patient) => (
              <div
                key={patient.id}
                className="patient-mini-item clickable"
                onClick={() => navigate('/plans', { state: { patientId: patient.userId } })}
              >
                <div className="p-avatar">{patient.name[0]}</div>
                <div className="p-info">
                  <p className="p-name">{patient.name}</p>
                  <p className="p-meta">{patient.prakriti || 'Prakriti not set'}</p>
                </div>
                <ChevronRight size={14} className="p-chevron" />
              </div>
            ))}
          </div>

          <div className="cta-card">
            <h4>Ready to start a new journey?</h4>
            <p>Create a therapy plan for {data?.recentPatients?.[0]?.name || 'your recent patient'}.</p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/plans', { state: { patientId: data?.recentPatients?.[0]?.userId } })}
            >
              Create Plan
            </button>
          </div>
        </section>
      </div>

      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: var(--bg-card);
          padding: 1.5rem;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          gap: 1.25rem;
          box-shadow: var(--shadow);
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .dashboard-section {
          background: var(--bg-card);
          border-radius: var(--radius);
          padding: 1.5rem;
          box-shadow: var(--shadow);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
        }

        .session-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          border-radius: 0.75rem;
          background: var(--bg-main);
          margin-bottom: 0.75rem;
          gap: 1.25rem;
          transition: transform 0.2s;
        }

        .session-item:hover {
          transform: translateX(5px);
        }

        .session-time {
          display: flex;
          flex-direction: column;
          min-width: 80px;
        }

        .session-time .time {
          font-weight: 700;
          color: var(--primary);
        }

        .session-time .date {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .session-details h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .session-details p {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .session-phase-tag {
          margin-left: auto;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.625rem;
          background: rgba(13, 148, 136, 0.1);
          color: var(--primary);
          border-radius: 1rem;
        }

        .chevron { color: var(--text-muted); }

        .patient-mini-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .p-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: var(--text-muted);
        }

        .p-name { font-size: 0.9375rem; font-weight: 500; }
        .p-meta { font-size: 0.75rem; color: var(--text-muted); }
        .p-chevron { margin-left: auto; color: var(--text-muted); opacity: 0; transition: opacity 0.2s; }
        .patient-mini-item.clickable { cursor: pointer; padding: 0.5rem; border-radius: 0.5rem; transition: background 0.2s; }
        .patient-mini-item.clickable:hover { background: var(--bg-main); }
        .patient-mini-item.clickable:hover .p-chevron { opacity: 1; }

        .cta-card {
          margin-top: 2rem;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          padding: 1.25rem;
          border-radius: var(--radius);
          color: white;
        }

        .cta-card h4 { margin-bottom: 0.5rem; }
        .cta-card p { font-size: 0.8125rem; margin-bottom: 1rem; opacity: 0.9; }
        
        .btn-sm { padding: 0.5rem 1rem; font-size: 0.875rem; background: white; color: var(--primary); }
        .btn-sm:hover { background: #f8fafc; color: var(--primary-hover); }

        .text-btn { color: var(--primary); font-size: 0.875rem; font-weight: 600; }
      `}</style>
    </div>
  );
};

export default PractitionerDashboard;

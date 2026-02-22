import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon,
    CheckCircle2,
    Clock,
    Award,
    Heart,
    ChevronRight,
    User
} from 'lucide-react';
import { patientService } from '../../services/api';
import CalendarModule from '../../components/CalendarModule';
import Skeleton from '../../components/Skeleton';
import { useAuth } from '../../context/AuthContext';

const PatientDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        document.title = 'My Wellbeing — AyurSutra';
        fetchData();
        const interval = setInterval(fetchData, 30000); // Poll every 30s for real-time updates
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [statsResp, notifyResp] = await Promise.all([
                patientService.getTherapyProgress(),
                patientService.getNotifications()
            ]);
            setStats(statsResp.data);
            setNotifications(notifyResp.data);
        } catch (err) {
            console.error('Error fetching patient data', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="patient-dashboard fade-in">
                <Skeleton height="60px" width="300px" style={{ marginBottom: '2rem' }} />
                <Skeleton height="150px" borderRadius="12px" style={{ marginBottom: '2rem' }} />
                <div className="dashboard-grid-patient">
                    <Skeleton height="300px" borderRadius="12px" />
                    <Skeleton height="300px" borderRadius="12px" />
                    <Skeleton height="300px" borderRadius="12px" />
                </div>
            </div>
        );
    }

    const wellnessTips = [
        "Stay hydrated! Drinking a glass of warm water in the morning with a squeeze of lemon can help cleanse your system and boost your metabolism.",
        "Practice deep breathing for 5 minutes daily to balance your Vata dosha.",
        "Favor warm, cooked foods over raw salads to maintain digestive fire (Agni).",
        "A regular sleep schedule is the foundation of Ayurvedic health. Try to be in bed by 10 PM."
    ];
    const dailyTip = wellnessTips[new Date().getDate() % wellnessTips.length];

    return (
        <div className="patient-dashboard fade-in">
            <header className="welcome-section">
                <div className="welcome-text">
                    <h1>Welcome, {user?.name || 'Friend'}! 👋</h1>
                    <p>Your Panchakarma journey is on track.</p>
                </div>
            </header>

            <div className="profile-mini-card clean-card">
                <div className="p-avatar-large">
                    <User size={32} />
                </div>
                <div className="p-info">
                    <h3>{user?.name || 'Patient'}</h3>
                    <p>Age: {stats?.age || '--'} | Gender: {stats?.gender || '--'}</p>
                    <p className="prakriti">Dosha: <span>{stats?.prakriti || 'Finding...'}</span></p>
                </div>
                <div className="status-badge">
                    <div className="pulse-dot"></div>
                    Real-time Tracking Active
                </div>
            </div>

            <div className="dashboard-tabs">
                <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
                <button className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                    Notifications {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
                </button>
            </div>

            {activeTab === 'overview' ? (
                <>
                    <div className="dashboard-grid-patient">
                        <div className="grid-col">
                            <div className="section-label">
                                <CalendarIcon size={18} />
                                <span>Session Calendar</span>
                            </div>
                            <div className="calendar-bg clean-card">
                                <CalendarModule
                                    events={stats?.sessions?.map(s => ({ date: s.scheduledDate, title: s.procedureName })) || []}
                                />
                            </div>
                        </div>

                        <div className="grid-col">
                            <div className="section-label">
                                <Clock size={18} />
                                <span>Upcoming Sessions</span>
                            </div>
                            <div className="session-stack">
                                {stats?.sessions?.filter(s => s.status === 'SCHEDULED' || s.status === 'RESCHEDULED').length > 0 ? (
                                    stats.sessions.filter(s => s.status === 'SCHEDULED' || s.status === 'RESCHEDULED').map(session => (
                                        <div key={session.id} className="upcoming-item clean-card">
                                            <div className="u-date">
                                                <span className="month">{session.scheduledDate ? new Date(session.scheduledDate).toLocaleString('default', { month: 'short' }) : '---'}</span>
                                                <span className="day">{session.scheduledDate ? new Date(session.scheduledDate).getDate() : '--'}</span>
                                            </div>
                                            <div className="u-main">
                                                <h4>{session.procedureName || 'Procedure Title'}</h4>
                                                <p>{session.scheduledDate ? new Date(session.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time TBD'}</p>
                                            </div>
                                            <ChevronRight size={16} className="u-chevron" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-card clean-card">No sessions scheduled</div>
                                )}
                            </div>
                        </div>

                        <div className="grid-col">
                            <div className="section-label">
                                <Award size={18} />
                                <span>Therapy Progress & Balance</span>
                            </div>
                            <div className="progress-card-holistic clean-card">
                                <div className="dosha-chart-container">
                                    <svg viewBox="0 0 100 100" className="dosha-pie">
                                        <circle cx="50" cy="50" r="40" className="base" />
                                        <circle cx="50" cy="50" r="40" className="segment vata" strokeDasharray="60 251.2" strokeDashoffset="0" />
                                        <circle cx="50" cy="50" r="40" className="segment pitta" strokeDasharray="100 251.2" strokeDashoffset="-60" />
                                        <circle cx="50" cy="50" r="40" className="segment kapha" strokeDasharray="91.2 251.2" strokeDashoffset="-160" />
                                        <circle cx="50" cy="50" r="30" fill="white" />
                                        <text x="50" y="55" textAnchor="middle" className="chart-center-text">{stats?.prakriti?.substring(0, 1) || '?'}</text>
                                    </svg>
                                    <div className="dosha-legend">
                                        <div className="l-item"><span className="dot vata"></span> Vata</div>
                                        <div className="l-item"><span className="dot pitta"></span> Pitta</div>
                                        <div className="l-item"><span className="dot kapha"></span> Kapha</div>
                                    </div>
                                </div>

                                <div className="progress-header" style={{ marginTop: '1rem' }}>
                                    <span className="percentage">{stats?.progressPercentage || 0}%</span>
                                    <span className="p-label">Complete</span>
                                </div>
                                <div className="progress-bar-linear">
                                    <div className="fill" style={{ width: `${stats?.progressPercentage || 0}%` }}></div>
                                </div>

                                <div className="attended-list">
                                    <h5>Attended Sessions</h5>
                                    {stats?.sessions?.filter(s => s.status === 'COMPLETED').length > 0 ? (
                                        stats.sessions.filter(s => s.status === 'COMPLETED').slice(0, 3).map(s => (
                                            <div key={s.id} className="attended-row">
                                                <CheckCircle2 size={14} color="#10b981" />
                                                <span className="proc">{s.procedureName || 'Completed Therapy'}</span>
                                                <span className="date-lite">{s.scheduledDate ? new Date(s.scheduledDate).toLocaleDateString() : '---'}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No completed sessions yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="wellness-tip-banner">
                        <div className="tip-content">
                            <div className="tip-icon-container">
                                <Heart className="tip-icon" size={24} />
                            </div>
                            <div className="text">
                                <h4>Daily Wellness Tip</h4>
                                <p>{dailyTip}</p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="notifications-view fade-in">
                    <div className="section-label">
                        <Heart size={18} />
                        <span>Recent Health Updates & Instructions</span>
                    </div>
                    <div className="notifications-stack">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                                <div key={n.id} className="notification-card clean-card">
                                    <div className="n-icon">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div className="n-body">
                                        <div className="n-header">
                                            <h4>{n.subject}</h4>
                                            <span className="n-time">{new Date(n.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p>{n.body}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-card clean-card">No notifications yet.</div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .patient-dashboard { padding-bottom: 2rem; }
                .welcome-section { margin-bottom: 2rem; }
                .welcome-section h1 { font-size: 2rem; color: var(--text-main); margin-bottom: 0.5rem; }
                .welcome-section p { color: var(--text-muted); font-size: 1rem; }

                .profile-mini-card { display: flex; align-items: center; gap: 1.5rem; padding: 1.25rem 2rem; margin-bottom: 2rem; border: 1px solid var(--border); position: relative; }
                .p-avatar-large { width: 56px; height: 56px; border-radius: 50%; background: #f0fdfa; color: var(--primary); display: flex; align-items: center; justify-content: center; border: 1px solid #ccfbf1; }
                .p-info h3 { margin: 0; font-size: 1.25rem; font-weight: 700; }
                .p-info p { margin: 0.1rem 0; color: var(--text-muted); font-size: 0.85rem; }
                .p-info .prakriti span { color: var(--primary); font-weight: 700; }

                .status-badge { margin-left: auto; font-size: 0.75rem; font-weight: 600; color: #059669; display: flex; align-items: center; gap: 0.5rem; background: #ecfdf5; padding: 0.5rem 1rem; border-radius: 20px; }
                .pulse-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite; }

                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }

                .dashboard-tabs { display: flex; gap: 2rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border); }
                .tab-btn { background: none; border: none; padding: 1rem 0; font-size: 0.95rem; font-weight: 700; color: var(--text-muted); cursor: pointer; position: relative; outline: none; }
                .tab-btn.active { color: var(--primary); }
                .tab-btn.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: var(--primary); }
                .tab-btn .badge { background: #fee2e2; color: #ef4444; font-size: 0.7rem; padding: 0.1rem 0.5rem; border-radius: 10px; margin-left: 0.5rem; vertical-align: middle; }

                .dashboard-grid-patient { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
                .section-label { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; color: var(--text-main); font-weight: 700; font-size: 0.95rem; }
                .calendar-bg { padding: 1rem; }

                .session-stack { display: flex; flex-direction: column; gap: 0.75rem; }
                .upcoming-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; transition: all 0.2s; cursor: pointer; background: white; white-space: nowrap; overflow: hidden; }
                .upcoming-item:hover { border-color: var(--primary); transform: translateY(-2px); }
                .u-date { display: flex; flex-direction: column; align-items: center; min-width: 50px; padding-right: 1rem; border-right: 1px solid var(--border); }
                .u-date .month { font-size: 0.7rem; font-weight: 700; color: var(--primary); text-transform: uppercase; }
                .u-date .day { font-size: 1.1rem; font-weight: 800; color: var(--text-main); }
                .u-main { flex: 1; min-width: 0; }
                .u-main h4 { margin: 0; font-size: 0.95rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; }
                .u-main p { margin: 0; font-size: 0.8rem; color: var(--text-muted); }
                .u-chevron { color: var(--border); }

                .progress-card-holistic { padding: 1.5rem; }
                .progress-header { display: flex; align-items: baseline; gap: 0.5rem; margin-bottom: 0.5rem; justify-content: center; }
                .progress-header .percentage { font-size: 2rem; font-weight: 800; color: var(--primary); }
                .progress-header .p-label { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; }
                .progress-bar-linear { height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; margin-bottom: 1.5rem; }
                .progress-bar-linear .fill { height: 100%; background: var(--primary); border-radius: 4px; }
                .attended-list h5 { margin-bottom: 1rem; font-size: 0.9rem; color: var(--text-main); border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
                .attended-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0; font-size: 0.85rem; }
                .attended-row .proc { font-weight: 600; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .attended-row .date-lite { color: var(--text-muted); font-size: 0.75rem; }

                .dosha-chart-container { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
                .dosha-pie { width: 100px; height: 100px; transform: rotate(-90deg); }
                .dosha-pie circle { fill: none; stroke-width: 12; }
                .dosha-pie .base { stroke: #f1f5f9; }
                .dosha-pie .segment { transition: stroke-dasharray 0.5s; stroke-linecap: round; }
                .dosha-pie .vata { stroke: #60a5fa; }
                .dosha-pie .pitta { stroke: #f87171; }
                .dosha-pie .kapha { stroke: #fbbf24; }
                .chart-center-text { transform: rotate(90deg); transform-origin: center; font-size: 1.2rem; font-weight: 800; fill: var(--text-main); }
                .dosha-legend { display: flex; flex-direction: column; gap: 0.4rem; }
                .l-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); }
                .l-item .dot { width: 8px; height: 8px; border-radius: 50%; }
                .dot.vata { background: #60a5fa; }
                .dot.pitta { background: #f87171; }
                .dot.kapha { background: #fbbf24; }

                .wellness-tip-banner { background: white; border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem 2rem; color: var(--text-main); box-shadow: var(--shadow); }
                .tip-content { display: flex; align-items: center; gap: 1.5rem; }
                .tip-icon-container { width: 48px; height: 48px; border-radius: 12px; background: #fff7ed; color: #f97316; display: flex; align-items: center; justify-content: center; }
                .tip-content h4 { margin: 0 0 0.25rem 0; font-size: 1.1rem; font-weight: 700; color: #9a3412; }
                .tip-content p { margin: 0; font-size: 0.95rem; color: #431407; opacity: 0.9; line-height: 1.4; }

                .notifications-stack { display: flex; flex-direction: column; gap: 1rem; }
                .notification-card { display: flex; gap: 1.5rem; padding: 1.5rem; border: 1px solid var(--border); }
                .n-icon { width: 40px; height: 40px; border-radius: 10px; background: #f0fdf4; color: #10b981; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .n-body { flex: 1; }
                .n-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem; }
                .n-header h4 { margin: 0; font-size: 1rem; font-weight: 700; color: var(--text-main); }
                .n-time { font-size: 0.75rem; color: var(--text-muted); }
                .n-body p { margin: 0; font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; white-space: pre-wrap; }

                @media (max-width: 1200px) {
                    .dashboard-grid-patient { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default PatientDashboard;

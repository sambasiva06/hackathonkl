import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { practitionerService } from '../../services/api';
import CalendarModule from '../../components/CalendarModule';

const ScheduleSession = () => {
    const [plans, setPlans] = useState([]);
    const [allSessions, setAllSessions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [formData, setFormData] = useState({
        therapyPlanId: '',
        procedureName: '',
        scheduledTime: '09:00',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Schedule Session — AyurSutra';
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [plansResp, dashboardResp] = await Promise.all([
                practitionerService.getTherapyPlans(),
                practitionerService.getDashboard()
            ]);
            setPlans(Array.isArray(plansResp?.data) ? plansResp.data : []);
            setAllSessions(Array.isArray(dashboardResp?.data?.upcomingSessionList) ? dashboardResp.data.upcomingSessionList : []);
        } catch (err) {
            console.error('Error fetching data', err);
            setPlans([]);
            setAllSessions([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const dateStr = selectedDate.toISOString().split('T')[0];
            const fullDateTime = `${dateStr}T${formData.scheduledTime}:00`;

            await practitionerService.scheduleSession({
                therapyPlanId: formData.therapyPlanId,
                procedureName: formData.procedureName,
                scheduledDate: fullDateTime,
                notes: formData.notes
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Error scheduling session');
        } finally {
            setLoading(false);
        }
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const commonProcedures = [
        'Abhyanga (Oil Massage)',
        'Swedana (Steam Therapy)',
        'Shirodhara',
        'Vamana (Emesis)',
        'Virechana (Purgation)',
        'Basti (Enema)',
        'Nasya (Nasal Cleansing)',
        'Raktamokshana (Bloodletting)'
    ];

    const daySessions = allSessions?.filter(s => {
        if (!s.scheduledDate) return false;
        const d = new Date(s.scheduledDate);
        return d.toDateString() === selectedDate.toDateString();
    }) || [];

    return (
        <div className="schedule-session-page fade-in">
            <header className="page-header-simple">
                <button className="btn btn-ghost btn-sm back-link" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} /> Back
                </button>
                <h2>Schedule Treatment</h2>
            </header>

            <div className="scheduling-layout">
                <div className="calendar-column">
                    <div className="clean-card calendar-wrapper">
                        <CalendarModule
                            events={allSessions?.map(s => ({
                                date: s.scheduledDate,
                                title: s.procedureName || 'Unnamed'
                            })) || []}
                            selectedDate={selectedDate}
                            onDateSelect={handleDateSelect}
                        />
                    </div>

                    <div className="day-overview clean-card">
                        <h4>{selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</h4>
                        <div className="timeslot-list">
                            {daySessions.length > 0 ? (
                                daySessions.map(s => (
                                    <div key={s.id} className="timeslot-item busy">
                                        <span className="ts-time">{new Date(s.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span className="ts-info">{s.procedureName} — {s.patientName}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="ts-empty">No sessions scheduled for this day.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-column">
                    <div className="clean-card schedule-form-card">
                        <form onSubmit={handleSubmit} className="standard-form">
                            {error && (
                                <div className="error-banner">
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="input-group">
                                <label>Active Therapy Plan</label>
                                <select
                                    required
                                    value={formData.therapyPlanId}
                                    onChange={(e) => setFormData({ ...formData, therapyPlanId: e.target.value })}
                                >
                                    <option value="">Select a patient plan...</option>
                                    {plans?.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.patientName || 'Unknown Patient'} — {p.phase || 'N/A'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Panchakarma Procedure</label>
                                <input
                                    list="procedures"
                                    required
                                    placeholder="Select procedure..."
                                    value={formData.procedureName}
                                    onChange={(e) => setFormData({ ...formData, procedureName: e.target.value })}
                                />
                                <datalist id="procedures">
                                    {commonProcedures.map(p => <option key={p} value={p} />)}
                                </datalist>
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label>Preferred Time</label>
                                    <div className="time-select-wrapper">
                                        <Clock size={16} className="input-icon" />
                                        <input
                                            type="time"
                                            required
                                            value={formData.scheduledTime}
                                            onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Practitioner Notes</label>
                                <textarea
                                    rows="3"
                                    placeholder="Mention specific oils or patient preparation..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                                    {loading ? 'Confirming...' : (
                                        <>
                                            <Check size={18} /> Book Session Slot
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                .schedule-session-page { padding-bottom: 3rem; }
                .page-header-simple { display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem; }
                .page-header-simple h2 { font-size: 1.5rem; font-weight: 800; color: var(--text-main); }
                
                .scheduling-layout {
                    display: grid;
                    grid-template-columns: 1fr 1.2fr;
                    gap: 2rem;
                    align-items: start;
                }

                .calendar-wrapper { padding: 1.5rem; border: 1px solid var(--border); }
                
                .day-overview { margin-top: 1.5rem; padding: 1.5rem; border: 1px solid var(--border); }
                .day-overview h4 { font-size: 0.9rem; font-weight: 800; color: var(--text-main); margin-bottom: 1rem; }
                
                .timeslot-list { display: flex; flex-direction: column; gap: 0.75rem; }
                .timeslot-item { padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.85rem; display: flex; gap: 1rem; align-items: center; }
                .timeslot-item.busy { background: #fff1f2; border: 1px solid #fecaca; color: #991b1b; }
                .ts-time { font-weight: 800; min-width: 60px; }
                .ts-info { font-weight: 600; }
                .ts-empty { font-size: 0.85rem; color: var(--text-muted); font-style: italic; }

                .schedule-form-card { padding: 2.5rem; border: 1px solid var(--border); }
                
                .error-banner {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: #fef2f2;
                    color: #dc2626;
                    padding: 0.75rem 1rem;
                    border-radius: 8px;
                    border: 1px solid #fee2e2;
                    margin-bottom: 1.5rem;
                    font-size: 0.85rem;
                    font-weight: 600;
                }

                .input-group label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem; letter-spacing: 0.05em; }
                .input-group input, .input-group select, .input-group textarea {
                    width: 100%;
                    padding: 0.8rem 1rem;
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    font-size: 0.95rem;
                    outline: none;
                    background: #fcfcfc;
                    transition: all 0.2s;
                }
                .input-group input:focus, .input-group select:focus, .input-group textarea:focus {
                    border-color: var(--primary);
                    background: white;
                    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
                }

                .time-select-wrapper { position: relative; }
                .time-select-wrapper .input-icon { position: absolute; right: 1rem; top: 1rem; color: var(--text-muted); pointer-events: none; }
                
                .form-actions { margin-top: 1rem; }
            `}</style>
        </div>
    );
};

export default ScheduleSession;

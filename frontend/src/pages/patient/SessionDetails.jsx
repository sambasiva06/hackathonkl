import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, User, FileText } from 'lucide-react';
import { patientService } from '../../services/api';

const SessionDetails = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'Session Details — AyurSutra';
        patientService.getMySessions().then(res => {
            setSessions(res.data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="loading">Retrieving your schedule...</div>;

    return (
        <div className="session-details-page fade-in">
            <div className="session-cards-grid">
                {sessions.length > 0 ? sessions.map((s) => (
                    <div key={s.id} className={`session-card-full ${s.status === 'COMPLETED' ? 'completed-card' : ''}`}>
                        <div className="card-top">
                            <div className="status-label">{s.status}</div>
                            <span className="phase-label">{s.phase}</span>
                        </div>

                        <h3 className="proc-name">{s.procedureName}</h3>

                        <div className="meta-info">
                            <div className="meta-item">
                                <Calendar size={18} />
                                <span>{new Date(s.scheduledDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="meta-item">
                                <User size={18} />
                                <span>Dr. {s.practitionerName}</span>
                            </div>
                        </div>

                        {s.notes && (
                            <div className="instructions">
                                <FileText size={16} />
                                <p>{s.notes}</p>
                            </div>
                        )}

                        {s.status === 'SCHEDULED' && (
                            <button
                                className="btn btn-primary"
                                style={{ marginTop: '1.5rem', width: '100%' }}
                                onClick={() => window.location.href = '/submit-feedback'}
                            >
                                Submit Feedback (Post-Session)
                            </button>
                        )}

                        {s.feedback && (
                            <div className="completed-feedback">
                                <p><strong>Your Feedback:</strong> {s.feedback.message}</p>
                                <p>Rating: {s.feedback.rating}/5 ⭐</p>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="empty-state">No sessions found in your record.</div>
                )}
            </div>

            <style>{`
        .session-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 2rem;
        }

        .session-card-full {
          background: white;
          border-radius: var(--radius);
          padding: 2rem;
          box-shadow: var(--shadow);
          border-top: 5px solid var(--primary);
        }

        .completed-card {
          border-top-color: var(--secondary);
          opacity: 0.9;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .status-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        .phase-label {
          background: var(--bg-main);
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .proc-name {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: var(--text-main);
        }

        .meta-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-muted);
          font-size: 0.9375rem;
        }

        .instructions {
          background: #fffbeb;
          padding: 1rem;
          border-radius: 0.5rem;
          border-left: 4px solid #f59e0b;
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .instructions p { font-size: 0.875rem; color: #92400e; }

        .completed-feedback {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px dashed var(--border);
          font-size: 0.875rem;
        }
      `}</style>
        </div>
    );
};

export default SessionDetails;

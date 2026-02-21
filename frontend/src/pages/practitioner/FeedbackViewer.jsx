import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { practitionerService } from '../../services/api';

const FeedbackViewer = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'Patient Feedback — AyurSutra';
        practitionerService.getFeedback().then(res => {
            setFeedbacks(res.data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="loading">Reflecting...</div>;

    return (
        <div className="feedback-page fade-in">
            <div className="feedback-grid">
                {feedbacks.length > 0 ? feedbacks.map((fb) => (
                    <div key={fb.id} className="feedback-card">
                        <div className="fb-header">
                            <div className="fb-patient">
                                <div className="fb-avatar">{fb.patientName[0]}</div>
                                <div>
                                    <h4>{fb.patientName}</h4>
                                    <p>{fb.procedureName}</p>
                                </div>
                            </div>
                            <div className="fb-rating">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        fill={i < fb.rating ? '#f59e0b' : 'none'}
                                        color={i < fb.rating ? '#f59e0b' : '#d1d5db'}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="fb-body">
                            <MessageSquare size={14} className="quote-icon" />
                            <p>{fb.message}</p>
                        </div>
                        <div className="fb-footer">
                            <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                )) : (
                    <div className="empty-state">No feedback submitted yet.</div>
                )}
            </div>

            <style>{`
        .feedback-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.5rem;
        }

        .feedback-card {
          background: white;
          border-radius: var(--radius);
          padding: 1.5rem;
          box-shadow: var(--shadow);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .fb-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .fb-patient {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .fb-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-main);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .fb-patient h4 { font-size: 1rem; }
        .fb-patient p { font-size: 0.75rem; color: var(--text-muted); }

        .fb-rating { display: flex; gap: 0.2rem; }

        .fb-body {
          position: relative;
          padding-left: 1.5rem;
          flex: 1;
        }

        .quote-icon {
          position: absolute;
          left: 0;
          top: 0.25rem;
          color: var(--primary);
          opacity: 0.3;
        }

        .fb-body p {
          font-style: italic;
          color: var(--text-main);
          font-size: 0.9375rem;
        }

        .fb-footer {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-align: right;
        }
      `}</style>
        </div>
    );
};

export default FeedbackViewer;

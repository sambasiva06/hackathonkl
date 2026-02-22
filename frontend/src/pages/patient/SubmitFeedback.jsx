import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Send } from 'lucide-react';
import { patientService } from '../../services/api';

const SubmitFeedback = () => {
    const [sessions, setSessions] = useState([]);
    const [formData, setFormData] = useState({
        sessionId: '',
        message: '',
        rating: 5,
        symptoms: '',
        sideEffects: '',
        improvementLevel: 5
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Submit Feedback — AyurSutra';
        patientService.getMySessions().then(res => {
            // Only show sessions that don't have feedback yet
            const filteredSessions = Array.isArray(res?.data)
                ? res.data.filter(s => !s.feedback && s.status === 'SCHEDULED')
                : [];
            setSessions(filteredSessions);
        }).catch(err => {
            console.error('Error fetching sessions:', err);
            setSessions([]);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.sessionId) return alert('Please select a session');

        setLoading(true);
        try {
            await patientService.submitFeedback(formData);
            navigate('/timeline');
        } catch (err) {
            alert('Error submitting feedback');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="submit-feedback-page fade-in">
            <div className="glass-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div className="form-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1>How was your session?</h1>
                    <p>Your feedback helps us tailor your Panchakarma experience.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Select Session</label>
                        <select
                            required
                            value={formData.sessionId}
                            onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
                        >
                            <option value="">Which session are you reviewing?</option>
                            {sessions?.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.procedureName || 'Unknown Procedure'}
                                    ({s.scheduledDate ? new Date(s.scheduledDate).toLocaleDateString() : 'N/A'})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div className="input-group">
                            <label>Overall Experience</label>
                            <div className="rating-input" style={{ display: 'flex', gap: '0.5rem', padding: '1rem 0' }}>
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                        type="button"
                                        key={num}
                                        onClick={() => setFormData({ ...formData, rating: num })}
                                        className={`rating-star ${formData.rating >= num ? 'active' : ''}`}
                                    >
                                        <Star size={24} fill={formData.rating >= num ? '#f59e0b' : 'none'} color={formData.rating >= num ? '#f59e0b' : '#d1d5db'} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Recovery Level ({formData.improvementLevel}/10)</label>
                            <div style={{ padding: '1rem 0' }}>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    step="1"
                                    value={formData.improvementLevel}
                                    onChange={(e) => setFormData({ ...formData, improvementLevel: parseInt(e.target.value) })}
                                    className="custom-slider"
                                    style={{ width: '100%' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '--text-muted', marginTop: '0.5rem' }}>
                                    <span>Same</span>
                                    <span>Vibrant</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Clinical Observations</label>
                        <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <textarea
                                rows="3"
                                placeholder="Any symptoms (e.g., headache, stiffness)?"
                                value={formData.symptoms}
                                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                                style={{ fontSize: '0.9rem' }}
                            ></textarea>
                            <textarea
                                rows="3"
                                placeholder="Any side effects (e.g., nausea, fatigue)?"
                                value={formData.sideEffects}
                                onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                                style={{ fontSize: '0.9rem' }}
                            ></textarea>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Notes & Feelings</label>
                        <textarea
                            rows="4"
                            placeholder="How did you feel during and after the procedure?"
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Submitting...' : (
                            <>
                                <Send size={18} /> Submit Experience
                            </>
                        )}
                    </button>
                </form>
            </div>

            <style>{`
        .rating-star {
          transition: transform 0.2s;
        }
        .rating-star:hover {
          transform: scale(1.2);
        }
        .rating-star.active {
          filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.4));
        }

        .custom-slider {
          -webkit-appearance: none;
          height: 6px;
          background: #e2e8f0;
          border-radius: 5px;
          outline: none;
        }

        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: var(--primary);
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 10px rgba(13, 148, 136, 0.3);
        }
      `}</style>
        </div>
    );
};

export default SubmitFeedback;

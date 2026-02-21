import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Send } from 'lucide-react';
import { patientService } from '../../services/api';

const SubmitFeedback = () => {
    const [sessions, setSessions] = useState([]);
    const [formData, setFormData] = useState({
        sessionId: '',
        message: '',
        rating: 5
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Submit Feedback — AyurSutra';
        patientService.getMySessions().then(res => {
            // Only show sessions that don't have feedback yet
            setSessions(res.data.filter(s => !s.feedback && s.status === 'SCHEDULED'));
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
            <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
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
                            {sessions.map(s => (
                                <option key={s.id} value={s.id}>{s.procedureName} ({new Date(s.scheduledDate).toLocaleDateString()})</option>
                            ))}
                        </select>
                    </div>

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
                                    <Star size={32} fill={formData.rating >= num ? '#f59e0b' : 'none'} color={formData.rating >= num ? '#f59e0b' : '#d1d5db'} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Notes & Feelings</label>
                        <textarea
                            rows="5"
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
      `}</style>
        </div>
    );
};

export default SubmitFeedback;

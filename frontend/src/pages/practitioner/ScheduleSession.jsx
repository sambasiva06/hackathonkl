import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { practitionerService } from '../../services/api';

const ScheduleSession = () => {
    const [plans, setPlans] = useState([]);
    const [formData, setFormData] = useState({
        therapyPlanId: '',
        procedureName: '',
        scheduledDate: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Schedule Session — AyurSutra';
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const resp = await practitionerService.getTherapyPlans();
            setPlans(resp.data);
        } catch (err) {
            console.error('Error fetching plans', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Backend expects LocalDateTime string
            await practitionerService.scheduleSession({
                ...formData,
                scheduledDate: formData.scheduledDate.replace(' ', 'T')
            });
            navigate('/dashboard');
        } catch (err) {
            alert('Error scheduling session');
        } finally {
            setLoading(false);
        }
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

    return (
        <div className="schedule-session-page fade-in">
            <div className="glass-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div className="form-header" style={{ marginBottom: '2rem' }}>
                    <h3>Schedule Session</h3>
                    <p>Assign a specific procedure to a therapy plan.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Select Therapy Plan</label>
                        <select
                            required
                            value={formData.therapyPlanId}
                            onChange={(e) => setFormData({ ...formData, therapyPlanId: e.target.value })}
                        >
                            <option value="">Choose a plan...</option>
                            {plans.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.patientName} — {p.phase}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Procedure Name</label>
                        <input
                            list="procedures"
                            required
                            placeholder="e.g. Shirodhara"
                            value={formData.procedureName}
                            onChange={(e) => setFormData({ ...formData, procedureName: e.target.value })}
                        />
                        <datalist id="procedures">
                            {commonProcedures.map(p => <option key={p} value={p} />)}
                        </datalist>
                    </div>

                    <div className="input-group">
                        <label>Date & Time</label>
                        <input
                            type="datetime-local"
                            required
                            value={formData.scheduledDate}
                            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label>Specific Instructions</label>
                        <textarea
                            rows="3"
                            placeholder="Any special preparation for the patient..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Scheduling...' : 'Confirm Session'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ScheduleSession;

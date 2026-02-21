import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ClipboardList, Sparkles } from 'lucide-react';
import { practitionerService } from '../../services/api';

const CreateTherapyPlan = () => {
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({
        patientId: '',
        phase: 'PURVAKARMA',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.title = 'Create Therapy Plan — AyurSutra';
        practitionerService.getPatients().then(res => {
            setPatients(res.data);
            // If patientId passed in navigation state, select it
            if (location.state?.patientId) {
                setFormData(prev => ({ ...prev, patientId: location.state.patientId }));
            }
        });
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await practitionerService.createTherapyPlan(formData);
            navigate('/dashboard');
        } catch (err) {
            alert('Error creating plan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-plan-page fade-in">
            <div className="glass-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div className="form-header">
                    <div className="icon-circle"><ClipboardList size={24} /></div>
                    <h3>Initiate Panchakarma Journey</h3>
                    <p>Define the therapy phase and duration for your patient.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="input-group">
                            <label>Select Patient</label>
                            <select
                                required
                                value={formData.patientId}
                                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                            >
                                <option value="">Choose a patient...</option>
                                {patients.map(p => <option key={p.userId} value={p.userId}>{p.name}</option>)}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Therapy Phase</label>
                            <select
                                value={formData.phase}
                                onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                            >
                                <option value="PURVAKARMA">Purvakarma (Preparation)</option>
                                <option value="PRADHANAKARMA">Pradhanakarma (Main Therapy)</option>
                                <option value="PASCHATKARMA">Paschatkarma (Post-Therapy)</option>
                            </select>
                        </div>

                        <div className="input-group full">
                            <label>Therapy Description & Goals</label>
                            <textarea
                                rows="4"
                                placeholder="Describe the clinical goals for this phase..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="input-group">
                            <label>Start Date</label>
                            <input
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>End Date (Optional)</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-footer" style={{ marginTop: '2rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Creating Plan...' : (
                                <>
                                    <Sparkles size={18} /> Initialize Therapy Plan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
        .form-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        
        .icon-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(13, 148, 136, 0.1);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .input-group.full {
          grid-column: span 2;
        }
      `}</style>
        </div>
    );
};

export default CreateTherapyPlan;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ClipboardList, Sparkles, ArrowLeft } from 'lucide-react';
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
            setPatients(Array.isArray(res?.data) ? res.data : []);
            const targetId = location.state?.patientId;
            if (targetId) {
                setFormData(prev => ({ ...prev, patientId: targetId.toString() }));
            }
        }).catch(err => {
            console.error('Error fetching patients:', err);
            setPatients([]);
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
            <button className="btn btn-ghost btn-sm back-link" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /> Back to Directory
            </button>

            <div className="form-container clean-card" style={{ maxWidth: '800px', margin: '1rem auto' }}>
                <div className="form-header">
                    <div className="icon-circle"><ClipboardList size={22} /></div>
                    <h3>Initialize Therapy Plan</h3>
                    <p>Establish clinical goals and timelines for the patient's Panchakarma journey.</p>
                </div>

                <form onSubmit={handleSubmit} className="standard-form">
                    <div className="form-grid">
                        <div className="input-group">
                            <label>Patient Profile</label>
                            <select
                                required
                                value={formData.patientId}
                                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                            >
                                <option value="">Select a patient...</option>
                                {patients?.map(p => <option key={p.userId || p.id} value={p.userId || p.id}>{p.name || 'Unknown Patient'}</option>)}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Therapeutic Phase</label>
                            <select
                                value={formData.phase}
                                onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                            >
                                <option value="PURVAKARMA">Purvakarma (Preliminary)</option>
                                <option value="PRADHANAKARMA">Pradhanakarma (Core)</option>
                                <option value="PASCHATKARMA">Paschatkarma (Follow-up)</option>
                            </select>
                        </div>

                        <div className="input-group full">
                            <label>Clinical Description & Goals</label>
                            <textarea
                                rows="5"
                                placeholder="Outline the specific procedures, dietary constraints, and clinical objectives for this phase..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="input-group">
                            <label>Commencement Date</label>
                            <input
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>Estimated Conclusion</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Processing...' : (
                                <>
                                    <Sparkles size={18} /> Activate Therapy Phase
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .create-plan-page {
                    padding-bottom: 2rem;
                }
                .back-link {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                    font-weight: 700;
                }
                .form-container {
                    padding: 3rem;
                    border: 1px solid var(--border);
                }
                .form-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }
                .form-header h3 {
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin-bottom: 0.5rem;
                    color: var(--text-main);
                }
                .form-header p {
                    color: var(--text-muted);
                    font-size: 0.95rem;
                }
                .icon-circle {
                    width: 52px;
                    height: 52px;
                    border-radius: 12px;
                    background: #f0fdfa;
                    color: var(--primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.25rem;
                    border: 1px solid #ccfbf1;
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem 2rem;
                }
                .input-group.full {
                    grid-column: span 2;
                }
                .input-group label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    margin-bottom: 0.5rem;
                    letter-spacing: 0.025em;
                }
                .input-group input, .input-group select, .input-group textarea {
                    width: 100%;
                    padding: 0.75rem 1rem;
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
                .form-actions {
                    margin-top: 2.5rem;
                }
            `}</style>
        </div>
    );
};

export default CreateTherapyPlan;

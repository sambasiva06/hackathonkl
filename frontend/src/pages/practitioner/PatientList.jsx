import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, MoreHorizontal, Mail, ChevronRight } from 'lucide-react';
import { practitionerService } from '../../services/api';
import Skeleton, { SkeletonCircle } from '../../components/Skeleton';

const PatientList = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: 'password123',
        prakriti: '',
        notes: '',
        age: '',
        gender: 'MALE',
        bloodGroup: '',
        emergencyContact: '',
        medicalHistory: ''
    });

    useEffect(() => {
        document.title = 'Patient Directory — AyurSutra';
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const resp = await practitionerService.getPatients();
            setPatients(resp.data);
        } catch (err) {
            console.error('Error fetching patients:', err);
            alert('Failed to load patients. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await practitionerService.createPatient(formData);
            await fetchPatients(); // Refresh list
            setShowModal(false);
            setFormData({
                name: '', email: '', password: 'password123', prakriti: '', notes: '',
                age: '', gender: 'MALE', bloodGroup: '', emergencyContact: '', medicalHistory: ''
            });
        } catch (err) {
            const msg = err.response?.data?.message || 'Error creating patient';
            alert(msg);
        }
    };


    return (
        <div className="patient-list-page fade-in">
            <header className="page-header">
                <div>
                    <h1>Patient Directory</h1>
                    <p>Manage and monitor your patient profiles</p>
                </div>
                <button className="btn btn-primary btn-with-icon" onClick={() => setShowModal(true)}>
                    <UserPlus size={18} /> New Patient
                </button>
            </header>

            <div className="search-row">
                <div className="search-box clean-card">
                    <Search size={18} color="var(--text-muted)" />
                    <input type="text" placeholder="Find a patient by name or email..." />
                </div>
                <div className="filter-pills">
                    <span className="pill active">All</span>
                    <span className="pill">Active</span>
                    <span className="pill">Completed</span>
                </div>
            </div>

            <div className="table-container clean-card">
                <table>
                    <thead>
                        <tr>
                            <th style={{ paddingLeft: '2rem' }}>Patient Profile</th>
                            <th>Health Stats</th>
                            <th>Dosha Type</th>
                            <th style={{ textAlign: 'right', paddingRight: '2rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <tr key={i}>
                                    <td style={{ paddingLeft: '2rem' }}>
                                        <div className="p-cell">
                                            <SkeletonCircle size="40px" />
                                            <div style={{ flex: 1 }}>
                                                <Skeleton width="140px" height="14px" />
                                                <Skeleton width="100px" height="10px" style={{ marginTop: '0.5rem' }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td><Skeleton width="120px" height="12px" /></td>
                                    <td><Skeleton width="60px" height="20px" borderRadius="10px" /></td>
                                    <td style={{ textAlign: 'right', paddingRight: '2rem' }}>
                                        <Skeleton width="100px" height="32px" borderRadius="8px" style={{ float: 'right' }} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            patients.map((patient) => (
                                <tr key={patient.id}>
                                    <td style={{ paddingLeft: '2rem' }}>
                                        <div className="p-cell">
                                            <div className="p-avatar-flat">{patient?.name?.[0] || '?'}</div>
                                            <div className="p-main">
                                                <span className="name">{patient?.name || 'Unknown'}</span>
                                                <span className="email">{patient?.email || 'No email'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="stats-row">
                                            <span className="s-tag">{patient.age || '??'}y</span>
                                            <span className="s-tag">{patient.gender?.[0] || '?'}</span>
                                            <span className="s-tag">{patient.bloodGroup || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td><span className={`dosha-badge ${patient.prakriti?.toLowerCase()}`}>{patient.prakriti || 'Finding...'}</span></td>
                                    <td style={{ textAlign: 'right', paddingRight: '2rem' }}>
                                        <div className="action-row">
                                            <button className="btn btn-outline btn-sm" onClick={() => navigate('/plans', { state: { patientId: patient.userId } })}>
                                                Create Plan
                                            </button>
                                            <button className="icon-btn-round"><MoreHorizontal size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        {!loading && patients.length === 0 && (
                            <tr>
                                <td colSpan="4" className="empty-row"> No patients found. Add your first patient to get started.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content clean-card">
                        <div className="modal-header">
                            <div>
                                <h3>Onboard Patient</h3>
                                <p>Register a new patient profile in the system</p>
                            </div>
                            <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Full Name</label>
                                    <input type="text" required placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Email Address</label>
                                    <input type="email" required placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Age</label>
                                    <input type="number" required placeholder="30" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Gender</label>
                                    <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Blood Group</label>
                                    <input type="text" placeholder="O+" value={formData.bloodGroup} onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Dosha (Prakriti)</label>
                                    <select value={formData.prakriti} onChange={(e) => setFormData({ ...formData, prakriti: e.target.value })}>
                                        <option value="">Unknown</option>
                                        <option value="Vata">Vata</option>
                                        <option value="Pitta">Pitta</option>
                                        <option value="Kapha">Kapha</option>
                                        <option value="Tridosha">Tridosha</option>
                                    </select>
                                </div>
                            </div>

                            <div className="input-group full-width">
                                <label>Medical Conditions / History</label>
                                <textarea rows="2" placeholder="Describe any existing conditions, allergies, or previous treatments..." value={formData.medicalHistory} onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}></textarea>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Complete Registration</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .patient-list-page { padding-bottom: 2rem; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .page-header h1 { font-size: 1.75rem; color: var(--text-main); margin-bottom: 0.25rem; font-weight: 800; }
                .page-header p { color: var(--text-muted); font-size: 0.95rem; }

                .search-row { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem; }
                .search-box { flex: 1; display: flex; align-items: center; gap: 0.75rem; padding: 0 1.25rem; border: 1px solid var(--border); max-width: 500px; }
                .search-box input { border: none; padding: 0.8rem 0; width: 100%; outline: none; font-size: 0.9rem; }
                
                .filter-pills { display: flex; gap: 0.5rem; }
                .pill { padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); cursor: pointer; border: 1px solid var(--border); transition: all 0.2s; background: white; }
                .pill:hover { border-color: var(--primary); color: var(--primary); }
                .pill.active { background: var(--primary); color: white; border-color: var(--primary); }

                .table-container { border: 1px solid var(--border); }
                table { width: 100%; border-collapse: collapse; }
                th { background: #f8fafc; padding: 1.25rem 1rem; text-align: left; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 700; border-bottom: 1px solid var(--border); }
                td { padding: 1.25rem 1rem; border-bottom: 1px solid var(--border); font-size: 0.9rem; vertical-align: middle; }
                tr:last-child td { border-bottom: none; }
                tr:hover td { background: #fcfdfe; }

                .p-cell { display: flex; align-items: center; gap: 1rem; }
                .p-avatar-flat { width: 40px; height: 40px; border-radius: 10px; background: #f0fdfa; color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; border: 1px solid #ccfbf1; }
                .p-main { display: flex; flex-direction: column; }
                .p-main .name { font-weight: 700; color: var(--text-main); font-size: 0.95rem; }
                .p-main .email { color: var(--text-muted); font-size: 0.8rem; }

                .stats-row { display: flex; gap: 0.4rem; }
                .s-tag { background: #f1f5f9; padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700; color: #475569; }

                .dosha-badge { display: inline-block; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
                .dosha-badge.vata { background: #eff6ff; color: #1d4ed8; }
                .dosha-badge.pitta { background: #fef2f2; color: #dc2626; }
                .dosha-badge.kapha { background: #f0fdf4; color: #15803d; }
                .dosha-badge { background: #f8fafc; color: #64748b; }

                .action-row { display: flex; align-items: center; gap: 0.5rem; justify-content: flex-end; }
                .icon-btn-round { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); border: 1px solid var(--border); background: white; transition: all 0.2s; }
                .icon-btn-round:hover { color: var(--primary); border-color: var(--primary); background: #f0fdfa; }

                .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 1rem; }
                .modal-content { width: 100%; max-width: 650px; padding: 2.5rem; position: relative; border: none; }
                .modal-header { margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-start; }
                .modal-header h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.25rem; color: var(--text-main); }
                .modal-header p { font-size: 0.9rem; color: var(--text-muted); }
                .close-btn { font-size: 1.5rem; color: var(--text-muted); background: none; border: none; cursor: pointer; opacity: 0.5; transition: opacity 0.2s; }
                .close-btn:hover { opacity: 1; }

                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem 2rem; }
                .input-group.full-width { grid-column: span 2; margin-top: 0.5rem; }
                .input-group label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem; letter-spacing: 0.025em; }
                .input-group input, .input-group select, .input-group textarea { width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--border); border-radius: 8px; font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
                .input-group input:focus, .input-group select:focus, .input-group textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1); }
                
                .modal-footer { margin-top: 2.5rem; display: flex; justify-content: flex-end; gap: 1rem; }
                .btn-ghost { background: transparent; color: var(--text-muted); }
                .btn-ghost:hover { background: #f8fafc; color: var(--text-main); }

                .empty-row { text-align: center; color: var(--text-muted); padding: 4rem !important; font-style: italic; }
            `}</style>
        </div>
    );
};

export default PatientList;

import React, { useState, useEffect } from 'react';
import { Search, UserPlus, MoreHorizontal, Mail } from 'lucide-react';
import { practitionerService } from '../../services/api';
import Skeleton, { SkeletonCircle } from '../../components/Skeleton';

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: 'password123', prakriti: '', notes: '' });

    useEffect(() => {
        document.title = 'Patient List — AyurSutra';
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
            setFormData({ name: '', email: '', password: 'password123', prakriti: '', notes: '' });
        } catch (err) {
            const msg = err.response?.data?.message || 'Error creating patient';
            alert(msg);
        }
    };


    return (
        <div className="patient-list-page">
            <div className="action-bar">
                <div className="search-box">
                    <Search size={20} />
                    <input type="text" placeholder="Search patients..." />
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <UserPlus size={18} /> Add New Patient
                </button>
            </div>

            <div className="table-container fade-in">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Prakriti</th>
                            <th>Notes</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    <td>
                                        <div className="p-cell">
                                            <SkeletonCircle size="32px" />
                                            <Skeleton width="120px" height="16px" />
                                        </div>
                                    </td>
                                    <td><Skeleton width="180px" height="16px" /></td>
                                    <td><Skeleton width="60px" height="20px" borderRadius="1rem" /></td>
                                    <td><Skeleton width="200px" height="16px" /></td>
                                    <td><Skeleton width="30px" height="20px" /></td>
                                </tr>
                            ))
                        ) : (
                            patients.map((patient) => (
                                <tr key={patient.id}>
                                    <td>
                                        <div className="p-cell">
                                            <div className="p-avatar-small">{patient.name[0]}</div>
                                            <span>{patient.name}</span>
                                        </div>
                                    </td>
                                    <td><span className="email-link"><Mail size={14} /> {patient.email}</span></td>
                                    <td><span className="badge">{patient.prakriti || '—'}</span></td>
                                    <td className="notes-cell">{patient.notes || 'No notes'}</td>
                                    <td>
                                        <button className="icon-btn"><MoreHorizontal size={18} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card">
                        <h3>Add New Patient</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Name</label>
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Email</label>
                                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Prakriti</label>
                                <select value={formData.prakriti} onChange={(e) => setFormData({ ...formData, prakriti: e.target.value })}>
                                    <option value="">Select vata/pitta/kapha</option>
                                    <option value="Vata">Vata</option>
                                    <option value="Pitta">Pitta</option>
                                    <option value="Kapha">Kapha</option>
                                    <option value="Vata-Pitta">Vata-Pitta</option>
                                    <option value="Pitta-Kapha">Pitta-Kapha</option>
                                    <option value="Vata-Kapha">Vata-Kapha</option>
                                    <option value="Tridosha">Tridosha</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Initial Notes</label>
                                <textarea rows="3" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Profile</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
        .action-bar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: white;
          padding: 0 1rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          flex: 1;
          max-width: 400px;
        }

        .search-box input {
          border: none;
          padding: 0.75rem 0;
          width: 100%;
          outline: none;
        }

        .table-container {
          background: white;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        th {
          background: var(--bg-main);
          padding: 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        td {
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          font-size: 0.9375rem;
        }

        .p-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
        }

        .p-avatar-small {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8125rem;
          font-weight: 700;
        }

        .email-link {
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .badge {
          background: rgba(13, 148, 136, 0.1);
          color: var(--primary);
          padding: 0.2rem 0.6rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .notes-cell {
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--text-muted);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          width: 100%;
          max-width: 500px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }
      `}</style>
        </div>
    );
};

export default PatientList;

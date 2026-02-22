import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Droplets, Activity, History, ShieldAlert } from 'lucide-react';
import { patientService } from '../../services/api';
import Skeleton from '../../components/Skeleton';

const PatientProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'My Medical Profile — AyurSutra';
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await patientService.getMyProfile();
      setProfile(res.data);
    } catch (err) {
      console.error('Error fetching profile', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page fade-in">
        <div className="profile-header-card">
          <Skeleton width="100px" height="100px" borderRadius="50%" />
          <Skeleton width="200px" height="32px" style={{ marginTop: '1rem' }} />
        </div>
        <div className="profile-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="profile-info-card">
              <Skeleton width="40%" height="20px" style={{ marginBottom: '1rem' }} />
              <Skeleton width="100%" height="40px" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page fade-in">
      <div className="profile-header-card">
        <div className="profile-avatar">
          {profile?.name?.[0]?.toUpperCase() || 'P'}
        </div>
        <div className="profile-main-info">
          <h1>{profile?.name || 'Patient'}</h1>
          <p className="email">{profile?.email || 'No email provided'}</p>
          <div className="badges">
            <span className="badge badge-primary">{profile?.prakriti || 'Dosha Not Set'}</span>
            <span className="badge badge-info">ID: #{profile?.id || '---'}</span>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <section className="profile-info-card">
          <div className="card-header">
            <User size={20} />
            <h3>Personal Details</h3>
          </div>
          <div className="info-item">
            <span className="label">Age & Gender</span>
            <span className="value">{profile?.age || 'N/A'} yrs • {profile?.gender || 'N/A'}</span>
          </div>
          <div className="info-item">
            <span className="label">Blood Group</span>
            <div className="value blood">
              <Droplets size={16} /> {profile?.bloodGroup || 'Unknown'}
            </div>
          </div>
        </section>

        <section className="profile-info-card">
          <div className="card-header">
            <Phone size={20} />
            <h3>Emergency Contact</h3>
          </div>
          <div className="info-item">
            <span className="label">Contact Detail</span>
            <span className="value">{profile?.emergencyContact || 'Not Provided'}</span>
          </div>
          <div className="emergency-note">
            <ShieldAlert size={14} />
            <span>Notified in case of clinical urgency.</span>
          </div>
        </section>

        <section className="profile-info-card full-width">
          <div className="card-header">
            <History size={20} />
            <h3>Medical History</h3>
          </div>
          <div className="history-content">
            {profile?.medicalHistory ? (
              <p>{profile.medicalHistory}</p>
            ) : (
              <div className="empty-history">
                No documented medical history available.
              </div>
            )}
          </div>
        </section>

        <section className="profile-info-card full-width">
          <div className="card-header">
            <Activity size={20} />
            <h3>Assigned Practitioner</h3>
          </div>
          <div className="practitioner-mini-card">
            <div className="p-icon">Dr</div>
            <div className="p-details">
              <p className="p-name">{profile?.practitionerName || 'Waiting for assignment'}</p>
              <p className="p-role">Ayurvedic Specialist</p>
            </div>
          </div>
        </section>
      </div>

      <style>{`
                .profile-page {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .profile-header-card {
                    background: white;
                    padding: 3rem;
                    border-radius: var(--radius);
                    border: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    margin-bottom: 2rem;
                    box-shadow: var(--shadow);
                }
                .profile-avatar {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: var(--primary);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    font-weight: 800;
                }
                .profile-main-info h1 { font-size: 2.25rem; margin-bottom: 0.25rem; }
                .email { color: var(--text-muted); margin-bottom: 1rem; }
                .badges { display: flex; gap: 0.75rem; }

                .profile-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .profile-info-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: var(--radius);
                    border: 1px solid var(--border);
                    box-shadow: var(--shadow-sm);
                }
                .profile-info-card.full-width { grid-column: span 2; }
                
                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                    color: var(--primary);
                }
                .card-header h3 { color: var(--text-main); font-size: 1.125rem; }

                .info-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    margin-bottom: 1rem;
                }
                .info-item .label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; }
                .info-item .value { font-size: 1.125rem; font-weight: 600; }
                .value.blood { display: flex; align-items: center; gap: 0.5rem; color: #ef4444; }

                .emergency-note {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem;
                    background: #fff1f2;
                    color: #e11d48;
                    border-radius: 8px;
                    font-size: 0.8125rem;
                }

                .history-content p { color: var(--text-muted); line-height: 1.7; }
                .empty-history { text-align: center; color: var(--text-muted); padding: 2rem; border: 1px dashed var(--border); border-radius: 8px; }

                .practitioner-mini-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 12px;
                }
                .p-icon { width: 44px; height: 44px; border-radius: 10px; background: white; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--primary); }
                .p-name { font-weight: 700; }
                .p-role { font-size: 0.75rem; color: var(--text-muted); }

                @media (max-width: 768px) {
                    .profile-header-card { flex-direction: column; text-align: center; padding: 2rem; }
                    .profile-grid { grid-template-columns: 1fr; }
                    .profile-info-card.full-width { grid-column: span 1; }
                }
            `}</style>
    </div>
  );
};

export default PatientProfile;

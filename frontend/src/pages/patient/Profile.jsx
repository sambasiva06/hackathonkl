import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Activity, MapPin } from 'lucide-react';
import { patientService } from '../../services/api';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'My Profile — AyurSutra';
        patientService.getMyProfile().then(res => {
            setProfile(res.data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="loading">Gathering your profile...</div>;

    return (
        <div className="profile-page fade-in">
            <div className="profile-header-card glass-card">
                <div className="profile-hero">
                    <div className="profile-avatar-large">
                        {profile?.name[0]}
                    </div>
                    <div className="profile-meta-title">
                        <h1>{profile?.name}</h1>
                        <p><Mail size={16} /> {profile?.email}</p>
                    </div>
                    <div className="role-tag">PATIENT</div>
                </div>
            </div>

            <div className="profile-grid">
                <div className="profile-section-card">
                    <div className="p-sec-header">
                        <Activity size={20} />
                        <h3>Prakriti Analysis</h3>
                    </div>
                    <div className="prakriti-display">
                        <div className="prakriti-value">{profile?.prakriti || 'Not yet analyzed'}</div>
                        <p className="prakriti-desc">Your Prakriti is your unique physical and mental constitution in Ayurveda.</p>
                    </div>
                </div>

                <div className="profile-section-card">
                    <div className="p-sec-header">
                        <Shield size={20} />
                        <h3>Medical Notes</h3>
                    </div>
                    <div className="notes-display">
                        <p>{profile?.notes || 'No medical notes provided by practitioner.'}</p>
                    </div>
                </div>
            </div>

            <style>{`
        .profile-header-card {
          padding: 3rem;
          margin-bottom: 2rem;
        }

        .profile-hero {
          display: flex;
          align-items: center;
          gap: 2rem;
          position: relative;
        }

        .profile-avatar-large {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: 700;
          box-shadow: 0 10px 25px rgba(13, 148, 136, 0.3);
        }

        .profile-meta-title h1 { font-size: 2.25rem; margin-bottom: 0.5rem; }
        .profile-meta-title p { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); }

        .role-tag {
          position: absolute;
          top: 0;
          right: 0;
          padding: 0.5rem 1rem;
          background: var(--bg-sidebar);
          color: white;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .profile-section-card {
          background: white;
          padding: 2rem;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }

        .p-sec-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          color: var(--primary);
        }

        .p-sec-header h3 { color: var(--text-main); font-size: 1.125rem; }

        .prakriti-value {
          font-size: 2rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 1rem;
        }

        .prakriti-desc { font-size: 0.875rem; color: var(--text-muted); line-height: 1.6; }

        .notes-display {
          background: var(--bg-main);
          padding: 1.25rem;
          border-radius: 0.5rem;
          font-size: 0.9375rem;
          line-height: 1.6;
          color: var(--text-main);
        }
      `}</style>
        </div>
    );
};

export default Profile;

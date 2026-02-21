import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
  Info
} from 'lucide-react';
import { patientService } from '../../services/api';
import Skeleton, { SkeletonCircle } from '../../components/Skeleton';

const MyTimeline = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'My Therapy Timeline — AyurSutra';
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await patientService.getTherapyProgress();
      setProgress(res.data);
    } catch (err) {
      console.error('Error fetching progress', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="patient-timeline-page fade-in">
        <div className="overall-progress-card glass-card">
          <div className="progress-header">
            <Skeleton width="40%" height="24px" />
            <Skeleton width="60px" height="32px" />
          </div>
          <Skeleton height="12px" borderRadius="6px" style={{ margin: '1rem 0' }} />
          <Skeleton width="30%" height="16px" />
        </div>
        <div className="timeline-container">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="timeline-phase active">
              <div className="phase-marker">
                <SkeletonCircle size="48px" />
                {i < 2 && <div className="connector"></div>}
              </div>
              <div className="phase-content">
                <Skeleton width="30%" height="20px" style={{ marginBottom: '0.5rem' }} />
                <Skeleton width="20%" height="14px" style={{ marginBottom: '1rem' }} />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Skeleton width="100px" height="28px" borderRadius="1rem" />
                  <Skeleton width="100px" height="28px" borderRadius="1rem" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="patient-timeline-page fade-in">
      <div className="overall-progress-card glass-card">
        <div className="progress-header">
          <h3>Overall Recovery Progress</h3>
          <span className="percentage">{Math.round(progress?.completionPercentage || 0)}%</span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress?.completionPercentage || 0}%` }}
          ></div>
        </div>
        <div className="progress-footer">
          <p>{progress?.completedSessions} of {progress?.totalSessions} tasks completed</p>
        </div>
      </div>

      <div className="timeline-container">
        {progress?.phases.map((phase, idx) => (
          <div key={phase.phase} className={`timeline-phase ${phase.total > 0 ? 'active' : 'inactive'}`}>
            <div className="phase-marker">
              {phase.percentage === 100 ? (
                <div className="icon-wrap completed"><CheckCircle2 size={24} /></div>
              ) : phase.total > 0 ? (
                <div className="icon-wrap current"><Clock size={24} /></div>
              ) : (
                <div className="icon-wrap locked"><Circle size={24} /></div>
              )}
              {idx < progress.phases.length - 1 && <div className="connector"></div>}
            </div>

            <div className="phase-content">
              <div className="phase-info">
                <h4>{phase.phase}</h4>
                <p className="phase-status">
                  {phase.total > 0 ? `${phase.completed}/${phase.total} Sessions` : 'Not started'}
                </p>
              </div>

              {phase.total > 0 && (
                <div className="phase-sessions-mini">
                  {phase.sessions.slice(0, 3).map(s => (
                    <div key={s.id} className="mini-session-tag">
                      {s.status === 'COMPLETED' ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                      <span>{s.procedureName}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="info-tip">
        <Info size={16} />
        <p>Panchakarma is a journey of detoxification. Follow the sequence guided by your practitioner.</p>
      </div>

      <style>{`
        .overall-progress-card {
          max-width: 100%;
          margin-bottom: 3rem;
          padding: 2rem;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .progress-header h3 { font-size: 1.25rem; }
        .percentage { font-size: 2rem; font-weight: 800; color: var(--primary); }

        .progress-bar-container {
          height: 12px;
          background: var(--bg-main);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
          border-radius: 6px;
          transition: width 1s ease-out;
        }

        .progress-footer { font-size: 0.875rem; color: var(--text-muted); }

        .timeline-container {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding-left: 1rem;
        }

        .timeline-phase {
          display: flex;
          gap: 2rem;
          min-height: 120px;
        }

        .phase-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          z-index: 2;
          box-shadow: var(--shadow);
        }

        .icon-wrap.completed { color: var(--secondary); border: 2px solid var(--secondary); }
        .icon-wrap.current { color: var(--primary); border: 2px solid var(--primary); }
        .icon-wrap.locked { color: var(--text-muted); border: 2px solid var(--border); }

        .connector {
          width: 2px;
          flex: 1;
          background: var(--border);
          margin: 0.5rem 0;
        }

        .phase-content {
          padding-top: 0.5rem;
          flex: 1;
        }

        .phase-info h4 { font-size: 1.125rem; font-weight: 700; margin-bottom: 0.25rem; }
        .phase-status { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1rem; }

        .phase-sessions-mini {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .mini-session-tag {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.75rem;
          background: white;
          border-radius: 1rem;
          font-size: 0.75rem;
          border: 1px solid var(--border);
          color: var(--text-main);
        }

        .info-tip {
          margin-top: 3rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(139, 92, 246, 0.05);
          border-radius: var(--radius);
          color: var(--accent);
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};

export default MyTimeline;

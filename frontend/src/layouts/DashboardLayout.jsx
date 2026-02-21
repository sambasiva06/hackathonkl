import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className={`dashboard-layout ${isMenuOpen ? 'menu-open' : ''}`}>
            <div className="mobile-overlay" onClick={() => setIsMenuOpen(false)}></div>
            <Sidebar closeMenu={() => setIsMenuOpen(false)} />
            <main className="main-content">
                <header className="content-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button className="menu-toggle" onClick={() => setIsMenuOpen(true)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </button>
                        <h2>{document.title.split('—')[0]}</h2>
                    </div>
                </header>
                <div className="fade-in">
                    <Outlet />
                </div>
            </main>

            <style>{`
        .menu-toggle { display: none; color: var(--text-main); }
        .mobile-overlay { display: none; }

        @media (max-width: 1024px) {
          .menu-toggle { display: block; }
          .sidebar {
            position: fixed;
            left: -100%;
            transition: left 0.3s ease;
            z-index: 1001;
            box-shadow: 10px 0 30px rgba(0,0,0,0.1);
          }
          .dashboard-layout.menu-open .sidebar { left: 0; }
          .dashboard-layout.menu-open .mobile-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(2px);
            z-index: 1000;
          }
          .main-content { padding: 1.5rem; }
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .content-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-main);
        }
      `}</style>
        </div>
    );
};

export default DashboardLayout;

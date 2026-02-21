import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  MessageSquare,
  UserCircle,
  LogOut,
  Leaf
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ closeMenu }) => {
  const { user, logout, isPractitioner } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (closeMenu) closeMenu();
  };

  const navItems = isPractitioner ? [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Patients', path: '/patients', icon: Users },
    { name: 'Therapy Plans', path: '/plans', icon: ClipboardList },
    { name: 'Schedule', path: '/schedule', icon: Calendar },
    { name: 'Feedback', path: '/feedback', icon: MessageSquare },
  ] : [
    { name: 'My Timeline', path: '/timeline', icon: Calendar },
    { name: 'Session Details', path: '/sessions', icon: ClipboardList },
    { name: 'Submit Feedback', path: '/submit-feedback', icon: MessageSquare },
    { name: 'Profile', path: '/profile', icon: UserCircle },
  ];

  return (
    <aside className="sidebar">
      <button className="mobile-close" onClick={closeMenu}>×</button>
      <div className="sidebar-brand">
        <Leaf className="brand-icon" size={32} />
        <span className="brand-name">AyurSutra</span>
      </div>

      <div className="user-profile-mini">
        <div className="avatar">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="user-info">
          <p className="user-name">{user?.name}</p>
          <p className="user-role">{user?.role}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={20} />
        <span>Logout</span>
      </button>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          background-color: var(--bg-sidebar);
          color: var(--text-on-dark);
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          height: 100vh;
          position: sticky;
          top: 0;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          padding-left: 0.5rem;
        }

        .brand-icon {
          color: var(--secondary);
        }

        .brand-name {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.025em;
        }

        .user-profile-mini {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius);
          margin-bottom: 2rem;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.125rem;
        }

        .user-name {
          font-size: 0.875rem;
          font-weight: 600;
        }

        .user-role {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.2s;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .nav-link.active {
          background: var(--primary);
          color: white;
        }

        .logout-btn {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          color: #fca5a5;
          width: 100%;
          text-align: left;
          transition: background 0.2s;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
        }
        .mobile-close {
          display: none;
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 2rem;
          color: rgba(255, 255, 255, 0.5);
        }

        @media (max-width: 1024px) {
          .mobile-close { display: block; }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;

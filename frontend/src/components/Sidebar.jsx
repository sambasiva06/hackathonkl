import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  MessageSquare,
  User,
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
    { name: 'Dashboard', path: '/patient-dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Feedback', path: '/submit-feedback', icon: MessageSquare },
    { name: 'Reports', path: '/timeline', icon: ClipboardList },
  ];

  return (
    <aside className="sidebar">
      <button className="mobile-close" onClick={closeMenu}>×</button>
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Leaf size={24} color="var(--primary)" />
          <h2>AyurSutra</h2>
        </div>
      </div>

      <div className="user-profile-mini">
        <div className="avatar">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="user-info">
          <p className="user-name">{user?.name}</p>
          <p className="user-role">{user?.role?.toLowerCase()}</p>
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
            background: var(--bg-sidebar);
            color: var(--text-main);
            height: 100vh;
            display: flex;
            flex-direction: column;
            padding: 1.5rem;
            position: sticky;
            top: 0;
            z-index: 1001;
            box-shadow: 1px 0 0 var(--border);
        }

        .sidebar-logo {
            margin-bottom: 2rem;
            padding: 0.5rem;
        }

        .sidebar-logo h2 {
            color: var(--text-main);
            margin: 0;
            font-size: 1.5rem;
            font-weight: 800;
            letter-spacing: -0.5px;
        }

        .user-profile-mini {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: #f8fafc;
            border-radius: var(--radius);
            margin-bottom: 2rem;
            border: 1px solid var(--border);
        }

        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--primary);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.1rem;
        }

        .user-name {
            font-size: 0.9rem;
            font-weight: 700;
            margin: 0;
            color: var(--text-main);
        }

        .user-role {
            font-size: 0.75rem;
            color: var(--text-muted);
            margin: 0;
            text-transform: capitalize;
        }

        .sidebar-nav {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            flex: 1;
        }

        .nav-link {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.75rem 1rem;
            border-radius: 10px;
            color: var(--text-muted);
            text-decoration: none;
            transition: all 0.2s;
            font-weight: 500;
        }

        .nav-link:hover {
            color: var(--primary);
            background: #f1f5f9;
        }

        .nav-link.active {
            background: #f0fdfa;
            color: var(--primary);
            font-weight: 700;
        }

        .logout-btn {
            margin-top: auto;
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            color: #ef4444;
            background: none;
            border: none;
            cursor: pointer;
            width: 100%;
            border-radius: var(--radius);
            transition: all 0.2s;
            font-weight: 600;
        }

        .logout-btn:hover {
            background: #fef2f2;
        }

        .mobile-close {
            display: none;
            background: none;
            border: none;
            color: var(--text-main);
            font-size: 2rem;
            cursor: pointer;
        }

        @media (max-width: 1024px) {
            .mobile-close {
                display: block;
                position: absolute;
                top: 1rem;
                right: 1rem;
            }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;

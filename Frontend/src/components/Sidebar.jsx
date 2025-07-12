import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, loading } = useAuth();

  const navItems = [
    { label: '🏠 Dashboard', path: '/dashboard' },
    { label: '📈 Stock Predictor', path: '/stock' },
    { label: '🛡 Insurance Predictor', path: '/insurance' },
    { label: '💰 Budget Optimizer', path: '/budget' },
    { label: '💬 Chatbot', path: '/chatbot' },
  ];

  const avatarUrl = user ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=3e92cc&color=fff&size=128` : '';

  return (
    <aside style={styles.sidebar}>
      <div style={styles.profile}>
        <div style={styles.avatar}>
          {user && <img src={avatarUrl} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%' }} />}
        </div>
        {loading ? (
          <div style={styles.name}>Loading...</div>
        ) : user ? (
          <>
            <div style={styles.name}>{user.name}</div>
            <div style={styles.email}>{user.email}</div>
          </>
        ) : null}
      </div>

      <nav style={styles.nav}>
        <ul style={styles.navList}>
          {navItems.map((item) => (
            <li
              key={item.label}
              style={{
                ...styles.navItem,
                ...(location.pathname === item.path ? styles.activeNavItem : {}),
              }}
            >
              <Link to={item.path} style={styles.link}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

const styles = {
  sidebar: {
    position: 'fixed',
    top: 60,
    left: 0,
    width: 280,
    height: 'calc(100vh - 60px)',
    background: '#183153',
    color: '#fff',
    padding: '32px 0',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    zIndex: 150,
  },
  profile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  name: {
    fontWeight: 600,
    fontSize: 18,
  },
  email: {
    fontSize: 13,
    color: '#b0bed9',
  },
  nav: {
    flex: 1,
    width: '100%',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    width: '100%',
  },
  navItem: {
    padding: '16px 32px',
    marginBottom: '6px',
    cursor: 'pointer',
    fontSize: 15,
    textAlign: 'left',
    transition: 'background 0.2s, color 0.2s',
  },
  link: {
    color: '#b0bed9',
    textDecoration: 'none',
    display: 'block',
    width: '100%',
  },
  activeNavItem: {
    background: '#1f497d', // darker bg for active link
    fontWeight: 600,
  },
};

export default Sidebar;

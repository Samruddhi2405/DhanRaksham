import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: '🏠 Dashboard', path: '/dashboard' },
    { label: '📈 Stock Predictor', path: '/stock' },
    { label: '🛡 Insurance Predictor', path: '/insurance' },
    { label: '💰 Budget Optimizer', path: '/budget' },
    { label: '💬 Chatbot', path: '/chatbot' },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.profile}>
        <div style={styles.avatar}>
          <span style={styles.avatarText}>JD</span>
        </div>
        <div style={styles.name}>JOHN DON</div>
        <div style={styles.email}>johndon@company.com</div>
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
    width: 220,
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
  },
  avatarText: {
    color: '#183153',
    fontSize: 36,
    fontWeight: 700,
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

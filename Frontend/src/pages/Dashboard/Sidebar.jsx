import React from 'react';

const Sidebar = () => {
  return (
    <aside style={{
      background: '#183153',
      color: '#fff',
      width: 220,
      minHeight: '100vh',
      padding: '32px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '2px 0 12px rgba(24,49,83,0.08)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12
        }}>
          <span style={{ color: '#183153', fontSize: 36, fontWeight: 700 }}>JD</span>
        </div>
        <div style={{ fontWeight: 600, fontSize: 18 }}>JOHN DON</div>
        <div style={{ fontSize: 13, color: '#b0bed9' }}>johndon@company.com</div>
      </div>
      <nav style={{ width: '100%' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
          <li style={navItem}><span style={iconStyle}>🏠</span> Home</li>
          <li style={navItem}><span style={iconStyle}>📁</span> File</li>
          <li style={navItem}><span style={iconStyle}>💬</span> Messages</li>
          <li style={navItem}><span style={iconStyle}>🔔</span> Notification</li>
          <li style={navItem}><span style={iconStyle}>📍</span> Location</li>
          <li style={navItem}><span style={iconStyle}>📊</span> Graph</li>
        </ul>
      </nav>
    </aside>
  );
};

const navItem = {
  padding: '14px 32px',
  cursor: 'pointer',
  fontSize: 15,
  color: '#b0bed9',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  transition: 'background 0.2s, color 0.2s',
};

const iconStyle = {
  fontSize: 18,
};

export default Sidebar; 
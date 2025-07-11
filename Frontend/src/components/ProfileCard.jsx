import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfileCard = () => {
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=3e92cc&color=fff&size=128`;

  return (
    <div style={{
      background: '#f7faff',
      borderRadius: '10px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(62,146,204,0.08)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <img src={avatarUrl} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%', marginBottom: 12 }} />
      <h3 style={{ margin: 0 }}>{user.name || 'User'}</h3>
      <p style={{ margin: 0, color: '#3e92cc', fontSize: 14 }}>{user.email}</p>
    </div>
  );
};

export default ProfileCard; 
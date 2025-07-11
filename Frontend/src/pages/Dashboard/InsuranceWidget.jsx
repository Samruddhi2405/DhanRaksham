import React from 'react';

const InsuranceWidget = () => {
  // Sample insurance data
  const insurance = {
    active: 2,
    suggestions: ['Health Insurance', 'Term Life Insurance'],
  };
  return (
    <div style={{
      background: '#f6fff7',
      borderRadius: '10px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(46,204,64,0.08)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <h4 style={{ margin: 0, color: '#2ecc40' }}>Insurance Overview</h4>
      <div style={{ margin: '12px 0 8px 0', fontSize: 15 }}>
        <span>Active Policies: <b>{insurance.active}</b></span>
      </div>
      <div style={{ fontSize: 14 }}>
        <span>Suggestions:</span>
        <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
          {insurance.suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InsuranceWidget; 
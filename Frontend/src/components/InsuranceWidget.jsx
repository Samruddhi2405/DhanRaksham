import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const getRiskColor = (risk) => {
  if (risk === 'Low') return { bg: '#e0f7e9', color: '#27ae60' };
  if (risk === 'High') return { bg: '#ffeaea', color: '#e74c3c' };
  if (risk === 'Medium') return { bg: '#fffbe6', color: '#f1c40f' };
  return { bg: '#f0f0f0', color: '#888' };
};

const InsuranceWidget = () => {
  const { user } = useAuth();
  const [insurance, setInsurance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInsurance = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/insurance/latest', {
          headers: { Authorization: token }
        });
        setInsurance(res.data);
      } catch (err) {
        setInsurance(null);
        setError('No insurance data found. Make a prediction first!');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchInsurance();
    else setLoading(false);
  }, [user]);

  if (loading) return <div>Loading insurance data...</div>;
  if (error) return <div style={{ color: '#e74c3c' }}>{error}</div>;
  if (!insurance) return <div>No insurance data available.</div>;

  const summary = insurance.prediction_summary || {};
  const recommendations = insurance.recommendations || {};
  const suggestions = (recommendations.suggestions || []).slice(0, 3);
  const risk = summary.claim_risk_level || '-';
  const { bg, color } = getRiskColor(risk);

  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 4px 16px rgba(46,204,64,0.10)',
      padding: '32px',
      marginBottom: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      minWidth: 260,
      maxWidth: 600
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 28, marginRight: 12 }}>🛡️</span>
        <h3 style={{ margin: 0, color: '#2ecc40', fontWeight: 700, fontSize: 22 }}>Insurance Overview</h3>
      </div>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
        ₹{summary.recommended_insurance_budget?.toLocaleString() || '-'}
        <span style={{ fontSize: 14, color: '#888', marginLeft: 8 }}>annual budget</span>
      </div>
      <div style={{ marginBottom: 8 }}>
        <span style={{
          background: bg,
          color: color,
          borderRadius: 8,
          padding: '4px 12px',
          fontWeight: 500
        }}>
          {risk} Risk
        </span>
      </div>
      <ul style={{ margin: '12px 0 0 18px', padding: 0, color: '#222', fontSize: 15 }}>
        {suggestions.map((s, i) => (
          <li key={i} style={{ marginBottom: 4 }}>✅ {s}</li>
        ))}
      </ul>
    </div>
  );
};

export default InsuranceWidget; 
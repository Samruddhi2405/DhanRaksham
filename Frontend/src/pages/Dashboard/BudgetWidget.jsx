import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BudgetWidget = () => {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/budget/latest')
      .then(res => setBudget(res.data))
      .catch(() => setBudget(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading budget...</div>;
  if (!budget) return <div>No budget data available.</div>;

  // Calculate spent as sum of rent, loanRepayment, insurance
  const spent = Number(budget.rent || 0) + Number(budget.loanRepayment || 0) + Number(budget.insurance || 0);
  const total = spent; // If you want to use a different logic for total, update here
  const percent = total ? Math.round((spent / total) * 100) : 0;

  return (
    <div style={{
      background: '#fff8f0',
      borderRadius: '10px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(255,140,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    }}>
      <h4 style={{ margin: 0, color: '#ff8c00' }}>Budget ({budget.month || 'N/A'})</h4>
      <div style={{ margin: '12px 0', width: '100%' }}>
        <div style={{ height: 8, background: '#ffe5c2', borderRadius: 4 }}>
          <div style={{ width: `${percent}%`, height: 8, background: '#ff8c00', borderRadius: 4 }} />
        </div>
      </div>
      <div style={{ fontSize: 15 }}>
        <span>Spent: <b>₹{spent.toLocaleString()}</b></span><br />
        <span>Remaining: <b>₹0</b></span>
      </div>
    </div>
  );
};

export default BudgetWidget; 
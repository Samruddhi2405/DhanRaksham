import React from 'react';

const BudgetWidget = () => {
  // Sample budget data
  const budget = {
    month: 'April',
    total: 50000,
    spent: 32000,
  };
  const remaining = budget.total - budget.spent;
  const percent = Math.round((budget.spent / budget.total) * 100);
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
      <h4 style={{ margin: 0, color: '#ff8c00' }}>Budget ({budget.month})</h4>
      <div style={{ margin: '12px 0', width: '100%' }}>
        <div style={{ height: 8, background: '#ffe5c2', borderRadius: 4 }}>
          <div style={{ width: `${percent}%`, height: 8, background: '#ff8c00', borderRadius: 4 }} />
        </div>
      </div>
      <div style={{ fontSize: 15 }}>
        <span>Spent: <b>₹{budget.spent.toLocaleString()}</b></span><br />
        <span>Remaining: <b>₹{remaining.toLocaleString()}</b></span>
      </div>
    </div>
  );
};

export default BudgetWidget; 
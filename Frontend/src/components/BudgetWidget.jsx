import React, { useEffect, useState } from 'react';
import axios from 'axios';

function getBudgetSummary(income, categories) {
  const total = Number(income) || 0;
  const totalExpenses = categories.reduce((sum, cat) => sum + Number(cat.amount || 0), 0);
  const remaining = total - totalExpenses;
  const percentSaved = total ? (remaining / total) * 100 : 0;
  const invest = Math.max(0, Math.floor(remaining * 0.5));
  const emergency = Math.max(0, Math.floor(remaining * 0.3));
  const leisure = Math.max(0, remaining - invest - emergency);

  let mainSuggestion = '';
  if (percentSaved >= 20) {
    mainSuggestion = `Great job! You saved ${percentSaved.toFixed(0)}% of your income. Invest ₹${invest.toLocaleString()}, save ₹${emergency.toLocaleString()} for emergencies, enjoy ₹${leisure.toLocaleString()}!`;
  } else if (percentSaved > 0) {
    mainSuggestion = `You saved ${percentSaved.toFixed(0)}%. Try to increase your savings to at least 20%.`;
  } else {
    mainSuggestion = "You're spending more than you earn. Review your expenses!";
  }

  return {
    totalExpenses,
    remaining,
    percentSaved,
    invest,
    emergency,
    leisure,
    mainSuggestion
  };
}

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

  const income = Number(budget.income) || 30000;
  const categories = [
    { name: 'Rent', amount: budget.rent },
    { name: 'Loan Repayment', amount: budget.loanRepayment },
    { name: 'Insurance', amount: budget.insurance }
  ];

  const summary = getBudgetSummary(income, categories);

  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 4px 16px rgba(255,140,0,0.10)',
      padding: '32px',
      marginBottom: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      minWidth: 260
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 28, marginRight: 12 }}>💰</span>
        <h3 style={{ margin: 0, color: '#ff8c00', fontWeight: 700, fontSize: 22 }}>Budget Summary</h3>
      </div>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
        ₹{income.toLocaleString()} <span style={{ fontSize: 14, color: '#888', marginLeft: 8 }}>monthly income</span>
      </div>
      <div style={{ marginBottom: 8, fontSize: 16 }}>
        <span style={{ color: '#e67e22', fontWeight: 500 }}>Expenses:</span> ₹{summary.totalExpenses.toLocaleString()}<br />
        <span style={{ color: '#27ae60', fontWeight: 500 }}>Remaining:</span> ₹{summary.remaining.toLocaleString()}<br />
        <span style={{ color: '#2563eb', fontWeight: 500 }}>Saved:</span> {summary.percentSaved.toFixed(0)}%
      </div>
      <ul style={{ margin: '12px 0 0 18px', padding: 0, color: '#222', fontSize: 15 }}>
        <li>📈 <b>Invest:</b> ₹{summary.invest.toLocaleString()}</li>
        <li>🛡️ <b>Emergency Fund:</b> ₹{summary.emergency.toLocaleString()}</li>
        <li>🎉 <b>Leisure/Goals:</b> ₹{summary.leisure.toLocaleString()}</li>
      </ul>
      <div style={{ margin: '12px 0 0 0', color: '#2563eb', fontWeight: 500, fontSize: 15 }}>
        {summary.mainSuggestion}
      </div>
    </div>
  );
};

export default BudgetWidget; 
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

  // For demo: assume income is a field, or set a default for now
  const income = Number(budget.income) || 30000; // fallback if not present
  const categories = [
    { name: 'Rent', amount: budget.rent },
    { name: 'Loan Repayment', amount: budget.loanRepayment },
    { name: 'Insurance', amount: budget.insurance }
    // Add more if your backend saves them
  ];

  const summary = getBudgetSummary(income, categories);

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
      <h4 style={{ margin: 0, color: '#ff8c00' }}>Budget Summary</h4>
      <div style={{ margin: '12px 0', fontWeight: 500 }}>
        💰 Expenses: ₹{summary.totalExpenses.toLocaleString()}<br />
        💡 Remaining: ₹{summary.remaining.toLocaleString()}<br />
        ✅ Saved: {summary.percentSaved.toFixed(0)}%
      </div>
      <div style={{ margin: '8px 0', fontSize: 15 }}>
        <b>Suggestion:</b> <span style={{ color: '#2563eb' }}>{summary.mainSuggestion}</span>
      </div>
    </div>
  );
};

export default BudgetWidget; 
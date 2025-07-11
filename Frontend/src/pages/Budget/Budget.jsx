import React, { useState } from 'react';
import './Budget.css';

const defaultCategories = [
  { name: 'Rent', amount: '' },
  { name: 'Groceries', amount: '' },
  { name: 'Transport', amount: '' },
  { name: 'Utilities', amount: '' },
  { name: 'Insurance', amount: '' },
  { name: 'Entertainment', amount: '' },
];

function getBudgetSummary(income, categories) {
  const total = Number(income) || 0;
  const totalExpenses = categories.reduce((sum, cat) => sum + Number(cat.amount || 0), 0);
  const remaining = total - totalExpenses;
  const percentSaved = total ? (remaining / total) * 100 : 0;
  const invest = Math.max(0, Math.floor(remaining * 0.5));
  const emergency = Math.max(0, Math.floor(remaining * 0.3));
  const leisure = Math.max(0, remaining - invest - emergency);

  // Suggestions
  const suggestions = [];
  if (percentSaved >= 20) {
    suggestions.push("Great job! You're saving a healthy portion of your income. Consider investing and building your emergency fund.");
  } else if (percentSaved > 0) {
    suggestions.push("You're saving some money, but try to increase your savings to at least 20% of your income.");
  } else {
    suggestions.push("Warning: You're spending more than you earn. Review your expenses and try to cut back on non-essential items.");
  }
  if (invest > 0) {
    suggestions.push(`Consider investing ₹${invest.toLocaleString()} for long-term growth (e.g., SIPs, mutual funds).`);
  }
  if (emergency > 0) {
    suggestions.push(`Set aside ₹${emergency.toLocaleString()} for your emergency fund (aim for 3-6 months of expenses).`);
  }
  if (leisure > 0) {
    suggestions.push(`You can use ₹${leisure.toLocaleString()} for leisure or short-term goals, but spend wisely!`);
  }
  suggestions.push("Tip: Track your expenses regularly and review your budget every month.");

  return {
    totalExpenses,
    remaining,
    percentSaved,
    invest,
    emergency,
    leisure,
    suggestions
  };
}

const Budget = () => {
  const [income, setIncome] = useState('');
  const [categories, setCategories] = useState(defaultCategories);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState(null);

  const handleCategoryChange = (index, field, value) => {
    const updated = [...categories];
    updated[index][field] = value;
    setCategories(updated);
  };

  const addCategory = () => {
    setCategories([...categories, { name: '', amount: '' }]);
  };

  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleOptimize = (e) => {
    e.preventDefault();
    const summaryData = getBudgetSummary(income, categories);
    setSummary(summaryData);
    setShowSummary(true);
  };

  return (
    <div className="budget-container">
      <div className="budget-box">
        <h2>Budget Optimizer</h2>
        <form onSubmit={handleOptimize}>
          <div className="section">
            <label>Monthly Income</label>
            <input
              type="number"
              value={income}
              onChange={e => setIncome(e.target.value)}
              required
              placeholder="Enter your monthly income"
            />
          </div>
          <div className="section">
            <h3>Expense Categories</h3>
            {categories.map((cat, idx) => (
              <div className="row" key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <input
                  type="text"
                  value={cat.name}
                  onChange={e => handleCategoryChange(idx, 'name', e.target.value)}
                  placeholder="Category"
                  style={{ flex: 2 }}
                  required
                />
                <input
                  type="number"
                  value={cat.amount}
                  onChange={e => handleCategoryChange(idx, 'amount', e.target.value)}
                  placeholder="Amount"
                  style={{ flex: 1 }}
                  required
                />
                {categories.length > 1 && (
                  <button type="button" onClick={() => removeCategory(idx)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}>Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addCategory} style={{ marginTop: 8, background: '#3e92cc', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}>Add Category</button>
          </div>
          <button type="submit" className="optimize-button" style={{ marginTop: 16 }}>
            Optimize My Budget
          </button>
        </form>
        {showSummary && summary && (
          <div style={{ marginTop: 32, background: '#f7faff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(62,146,204,0.08)' }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
              💰 Total Expenses: ₹{summary.totalExpenses.toLocaleString()}
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
              💡 Remaining Income: ₹{summary.remaining.toLocaleString()}
            </div>
            <div style={{ fontSize: 16, marginBottom: 12 }}>
              ✅ You saved {summary.percentSaved.toFixed(0)}% of your income this month — {summary.percentSaved >= 50 ? "good job!" : "keep improving!"}
            </div>
            <div style={{ fontSize: 16, marginBottom: 12 }}>
              📊 <b>Suggested Allocation:</b>
              <ul style={{ margin: '8px 0 0 18px', padding: 0 }}>
                <li> 📈 Invest: ₹{summary.invest.toLocaleString()} — build long-term wealth with SIPs or mutual funds.</li>
                <li> 🛡️ Emergency Fund: ₹{summary.emergency.toLocaleString()} — aim for 3–6 months of expenses as a safety net.</li>
                <li> 🎉 Leisure/Short-term Goals: ₹{summary.leisure.toLocaleString()} — enjoy, but spend wisely!</li>
              </ul>
            </div>
            <div style={{ marginTop: 18, color: '#2563eb', fontWeight: 500 }}>
              📌 Tip: Track your spending regularly and adjust your budget every month to stay on top of your goals.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;


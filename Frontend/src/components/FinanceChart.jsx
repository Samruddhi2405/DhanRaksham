import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { month: 'Jan', spend: 12000 },
  { month: 'Feb', spend: 15000 },
  { month: 'Mar', spend: 18000 },
  { month: 'Apr', spend: 14000 },
  { month: 'May', spend: 20000 },
];

const FinanceChart = () => (
  <div style={{
    background: '#f7faff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(62,146,204,0.08)',
    minHeight: 220,
  }}>
    <h4 style={{ margin: 0, color: '#3e92cc' }}>Spending Trend</h4>
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="spend" stroke="#3e92cc" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default FinanceChart; 
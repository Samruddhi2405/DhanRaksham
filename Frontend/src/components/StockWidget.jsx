import React from 'react';

const StockWidget = () => {
  // Sample stock data
  const stocks = [
    { symbol: 'TCS', change: '+2.1%', value: 3450 },
    { symbol: 'INFY', change: '-0.8%', value: 1420 },
    { symbol: 'RELIANCE', change: '+1.5%', value: 2550 },
  ];
  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 4px 16px rgba(62,146,204,0.10)',
      padding: '32px',
      marginBottom: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      minWidth: 260,
      maxWidth: 600
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 28, marginRight: 12 }}>📈</span>
        <h3 style={{ margin: 0, color: '#3e92cc', fontWeight: 700, fontSize: 22 }}>Stock Portfolio</h3>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0 0', width: '100%' }}>
        {stocks.map(stock => (
          <li key={stock.symbol} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, fontSize: 16 }}>
            <span style={{ fontWeight: 600 }}>{stock.symbol}</span>
            <span style={{ color: stock.change.startsWith('+') ? '#27ae60' : '#e74c3c', fontWeight: 500 }}>{stock.change}</span>
            <span style={{ color: '#2563eb', fontWeight: 600 }}>₹{stock.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockWidget; 
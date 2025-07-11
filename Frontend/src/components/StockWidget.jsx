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
      background: '#f0faff',
      borderRadius: '10px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(62,146,204,0.08)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <h4 style={{ margin: 0, color: '#3e92cc' }}>Stock Portfolio</h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0 0', width: '100%' }}>
        {stocks.map(stock => (
          <li key={stock.symbol} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span>{stock.symbol}</span>
            <span style={{ color: stock.change.startsWith('+') ? '#2ecc40' : '#e74c3c', fontWeight: 500 }}>{stock.change}</span>
            <span>₹{stock.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockWidget; 
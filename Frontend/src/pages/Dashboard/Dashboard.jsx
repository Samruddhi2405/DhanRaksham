import React from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar';
import ProfileCard from './ProfileCard';
import BudgetWidget from './BudgetWidget';
import StockWidget from './StockWidget';
import InsuranceWidget from './InsuranceWidget';
import FinanceChart from './FinanceChart';

const Dashboard = () => (
  <div className="dashboard-flex">
    <Sidebar />
    <div className="dashboard-main">
      <ProfileCard />
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Overview</h2>
        <div className="dashboard-grid">
          <BudgetWidget />
          <StockWidget />
          <InsuranceWidget />
        </div>
      </div>
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Insights</h2>
        <div className="dashboard-grid">
          <FinanceChart />
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard; 
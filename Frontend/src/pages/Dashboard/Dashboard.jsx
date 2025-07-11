import React from 'react';
import Layout from '../../components/Layout';
import ProfileCard from '../../components/ProfileCard';
import BudgetWidget from '../../components/BudgetWidget';
import StockWidget from '../../components/StockWidget';
import InsuranceWidget from '../../components/InsuranceWidget';
import FinanceChart from '../../components/FinanceChart';

const Dashboard = () => (
  <Layout>
    <ProfileCard />
    <div className="dashboard-section">
      <h2>Overview</h2>
      <div className="dashboard-grid">
        <BudgetWidget />
        <StockWidget />
        <InsuranceWidget />
      </div>
    </div>
    <div className="dashboard-section">
      <h2>Insights</h2>
      <FinanceChart />
    </div>
  </Layout>
);

export default Dashboard;

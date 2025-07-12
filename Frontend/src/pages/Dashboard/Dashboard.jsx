import React from 'react';
import Layout from '../../components/Layout';
import BudgetWidget from '../../components/BudgetWidget';
import StockWidget from '../../components/StockWidget';
import InsuranceWidget from '../../components/InsuranceWidget';

const Dashboard = () => (
  <Layout>
    <div className="dashboard-section">
      <h2>Overview</h2>
      <div className="dashboard-grid">
        <BudgetWidget />
        <StockWidget />
        <InsuranceWidget />
      </div>
    </div>
  </Layout>
);

export default Dashboard;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home/Home';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Budget from './pages/Budget/Budget';
import Stock from './pages/Stock/Stock';
import Chatbot from './components/Chatbot';
import InsuranceAdvisor from './pages/InsuranceAdvisor/InsuranceAdvisor';

import Dashboard from './pages/Dashboard/Dashboard';

function AppContent() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <div className="app">
      {/* ✅ Show global Header ONLY when NOT in dashboard */}
      {!isDashboardRoute && <Header />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/insurance" element={<InsuranceAdvisor />} />
          <Route path="/chatbot" element={<Chatbot />} />

          {/* ✅ Dashboard uses Layout inside, so NO Header here */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

        {/* ✅ Show global Footer ONLY when NOT in dashboard */}
        {!isDashboardRoute && <Footer />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

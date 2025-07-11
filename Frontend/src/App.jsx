import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home/Home';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Budget from './pages/Budget/Budget';
import Stock from './pages/Stock/Stock';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import InsuranceAdvisor from './pages/InsuranceAdvisor/InsuranceAdvisor';
import ScrollToTop from './components/ScrollToTop';
import Dashboard from './pages/Dashboard/Dashboard';


function App() {
  return (
    <AuthProvider>
      <Router>
      <ScrollToTop />
        <div className="app">
          <Header /> 
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/insurance" element={<InsuranceAdvisor />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
            <Footer />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

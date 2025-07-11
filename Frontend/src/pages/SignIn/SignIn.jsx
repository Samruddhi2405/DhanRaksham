import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './SignIn.css';

const SignIn = ({ inModal = false }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signin', {
        email,
        password
      });

      // Use the login function from AuthContext
      login(response.data.user, response.data.token);

      // Navigate to home page
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  if (inModal) {
    return (
      <div className="form-container">
        <h2>Sign In</h2>
        {error && (
          <div className="error-message" style={{
            color: '#dc3545',
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#fff5f5',
            borderRadius: '5px',
            border: '1px solid #dc3545'
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSignIn}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <button 
            className="button" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="links">
          <a href="#forgot-password">Forgot Password?</a>
          <a href="/signup">Don't have an account? Sign up</a>
        </div>
      </div>
    );
  }
  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Sign In</h2>
        {error && (
          <div className="error-message" style={{
            color: '#dc3545',
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#fff5f5',
            borderRadius: '5px',
            border: '1px solid #dc3545'
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSignIn}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <button 
            className="button" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="links">
          <a href="#forgot-password">Forgot Password?</a>
          <a href="/signup">Don't have an account? Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

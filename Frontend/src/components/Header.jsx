import React, { useState } from 'react';
import './Header.css';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignInClick = () => navigate('/signin');
  const handleSignUpClick = () => navigate('/signup');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        {/* LOGO + NAME LEFT */}
        <div className="logo-section" onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">DhanRaksham</span>
        </div>

        {/* LINKS + AUTH BUTTONS RIGHT */}
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#market">Markets</a></li>
          <li><a href="#insurance">Insurance</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>

          {user ? (
            <li className="profile-section">
              <div
                className="profile-avatar"
                onClick={() => setShowDropdown(!showDropdown)}
                title={user.email}
              >
                {user.email[0].toUpperCase()}
              </div>
              {showDropdown && (
                <div className="dropdown-menu">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </li>
          ) : (
            <>
              <li className="nav-btn">
                <button className="btn outline-btn" onClick={handleSignInClick}>
                  Sign In
                </button>
              </li>
              <li className="nav-btn">
                <button className="btn primary-btn" onClick={handleSignUpClick}>
                  Sign Up
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;


/*
import React from 'react';
import './Header.css';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignInClick = () => {
    navigate('/signin');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <nav>
        <div className="container nav-container">
          <div className="logo">
            <img src={logo} alt="Logo" className="logo-img" />DhanRaksham
          </div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#market">Markets</a></li>
            <li><a href="#insurance">Insurance</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            {user ? (
              <>
                <li>
                  <span className="user-email" style={{ color: 'white', marginRight: '15px' }}>
                    {user.email}
                  </span>
                </li>
                <li>
                  <button className="btn" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li style={{ marginLeft: '30px', marginRight: '0' }}>
                  <button className="btn" onClick={handleSignInClick}>Sign In</button>
                </li>
                <li style={{ marginLeft: '0' }}>
                  <button className="btn" onClick={handleSignUpClick}>Sign Up</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Header;
*/
import React, { useState } from 'react';
import './Header.css';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import SignIn from '../pages/SignIn/SignIn';
import SignUp from '../pages/SignUp/SignUp';

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [modalType, setModalType] = useState(null); // 'signin' | 'signup' | null

  const handleSignInClick = () => setModalType('signin');
  const handleSignUpClick = () => setModalType('signup');
  const handleCloseModal = () => setModalType(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="logo-section" onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">DhanRaksham</span>
        </div>

        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>

          {user ? (
            <>
              <li>
                <a href="/dashboard">Dashboard</a>
              </li>
              <li className="profile-section">
                <div
                  className="profile-avatar"
                  onClick={() => setShowDropdown(!showDropdown)}
                  title={user.email}
                >
                  {user?.email ? user.email[0].toUpperCase() : ''}
                </div>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </li>
            </>
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

      <Modal isOpen={modalType === 'signin'} onClose={handleCloseModal}>
        <SignIn inModal={true} />
      </Modal>
      <Modal isOpen={modalType === 'signup'} onClose={handleCloseModal}>
        <SignUp inModal={true} />
      </Modal>
    </nav>
  );
};

export default Header;

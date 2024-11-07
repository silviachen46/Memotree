import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { FaUser } from 'react-icons/fa'; // Make sure to install react-icons

function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Main
        </Link>
        <span className="title">Chat & Memo Board</span>
        <Link to="/login" className="nav-link login-link">
          <FaUser className="login-icon" />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

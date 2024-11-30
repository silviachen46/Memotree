import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { FaUser, FaListUl, FaCalendarAlt, FaSearch } from 'react-icons/fa';

function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Main
        </Link>
        <Link to="/todo" className={`nav-link ${location.pathname === '/todo' ? 'active' : ''}`}>
          <FaListUl className="nav-icon" /> Todo
        </Link>
        <Link to="/calendar" className={`nav-link ${location.pathname === '/calendar' ? 'active' : ''}`}>
          <FaCalendarAlt className="nav-icon" /> Calendar
        </Link>
        <Link to="/search" className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}>
          <FaSearch className="nav-icon" /> Search
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

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Groq Assistant</h1>
      </div>
      <div className="navbar-links">
        <Link 
          to="/chat" 
          className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}
        >
          Chat
        </Link>
        <Link 
          to="/memo" 
          className={`nav-link ${location.pathname === '/memo' ? 'active' : ''}`}
        >
          Memo
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

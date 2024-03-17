// Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ activeTab, onTabChange }) => {
  return (
    <header className="header">
      <div className="logo">
        <img src="/images/logo.svg" alt="Logo" className="h-8 w-auto mr-4" />
      </div>
      <nav className="nav">
        <ul className="flex">
          <li>
            <Link to="/" className={`nav-link ${activeTab === 'home' ? 'font-bold active' : ''}`} onClick={() => onTabChange('home')}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/courses" className={`nav-link ${activeTab === 'courses' ? 'font-bold active' : ''}`} onClick={() => onTabChange('courses')}>
              Courses
            </Link>
          </li>
          <li>
            <Link to="/reports" className={`nav-link ${activeTab === 'reports' ? 'font-bold active' : ''}`} onClick={() => onTabChange('reports')}>
              Reports
            </Link>
          </li>
        </ul>
      </nav>
      <div className="profile">
        <img src="https://via.placeholder.com/40?text=SD" alt="Profile" className="h-8 w-8 rounded-full mr-2" />
      </div>
    </header>
  );
};

export default Header;

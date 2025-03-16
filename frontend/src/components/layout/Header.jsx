import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            DataVista
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link to="/dashboard" className="hover:text-primary-light transition-colors">Dashboard</Link>
            <Link to="/map" className="hover:text-primary-light transition-colors">Crime Map</Link>
            <Link to="/analytics" className="hover:text-primary-light transition-colors">Analytics</Link>
            <Link to="/reports" className="hover:text-primary-light transition-colors">Reports</Link>
            <Link to="/alerts" className="hover:text-primary-light transition-colors">Alerts</Link>
            <Link to="/search" className="hover:text-primary-light transition-colors">Search</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center hover:text-primary-light">
                <img 
                  src={user.avatar || 'https://via.placeholder.com/40'} 
                  alt="Profile" 
                  className="h-8 w-8 rounded-full object-cover mr-2" 
                />
                <span className="hidden md:inline">{user.name}</span>
              </Link>
              <button 
                onClick={logout}
                className="hover:text-primary-light transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary text-sm">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
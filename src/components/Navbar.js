import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Import custom CSS if needed

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate()

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    setIsAuthenticated(!!authToken);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/")
    // window.location.href = '/login'; 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">Project Manager</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {isAuthenticated ? (
              <>
                <li className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className={`nav-item ${location.pathname === '/projects' ? 'active' : ''}`}>
                  <Link className="nav-link" to="/projects">Projects</Link>
                </li>
                <li className={`nav-item ${location.pathname === '/tasks' ? 'active' : ''}`}>
                  <Link className="nav-link" to="/tasks">Tasks</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={handleLogout}>Logout</Link>
                </li>
              </>
            ) : (
              <>
                <li className={`nav-item ${location.pathname === '/login' ? 'active' : ''}`}>
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className={`nav-item ${location.pathname === '/register' ? 'active' : ''}`}>
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

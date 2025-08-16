import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavigationBar.css";

const NavigationBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navigation-bar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img
            src="/firstCatchDark.svg"
            alt="FirstCatch Logo"
            style={{ width: "200px", paddingTop: "25px" }}
          />
        </Link>

        <button
          className={`nav-toggle ${isMobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="nav-toggle-line"></span>
          <span className="nav-toggle-line"></span>
          <span className="nav-toggle-line"></span>
        </button>

        <ul className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`}>
          <li className="nav-item">
            <Link
              to="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/new-catch"
              className={`nav-link ${isActive("/new-catch") ? "active" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              New Catch
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/available-catches"
              className={`nav-link ${
                isActive("/available-catches") ? "active" : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Available Catches
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;

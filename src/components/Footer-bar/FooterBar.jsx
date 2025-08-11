import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './FooterBar.css';
import { FaMoon, FaSun } from "react-icons/fa";

const FooterBar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for saved theme preference or default to system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <footer className="footer-bar">
      <div className="footer-container">
        <p className="footer-text">© 2025 FishCatch. All rights reserved.</p>
        <nav className="footer-nav">
          <Link to="/service-test" className="footer-link">Privacy</Link>
          <Link to="/service-test" className="footer-link">Terms</Link>
          <Link to="/service-test" className="footer-link">Contact</Link>
          <button 
            className="theme-toggle-footer"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </nav>
      </div>
    </footer>
  );
};

export default FooterBar;

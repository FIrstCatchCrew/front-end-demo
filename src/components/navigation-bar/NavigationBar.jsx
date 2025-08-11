import React from "react";
import { Link } from "react-router-dom";
import './NavigationBar.css';

const NavigationBar = () => {
  return <nav>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/new-catch">New Catch</Link></li>
      <li><Link to="/available-catches">Available Catches</Link></li>
      <li><Link to="/page-not-found">Page Not Found</Link></li>
    </ul>
  </nav>;
};


export default NavigationBar;

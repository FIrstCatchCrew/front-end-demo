import React from "react";
import './PageNotFound.css';

const PageNotFound = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Page Not Found</h1>
      </div>
      <div className="page-content">
        <p>Sorry, the page you're looking for doesn't exist.</p>
      </div>
    </div>
  );
};

export default PageNotFound;

import React, { useState } from 'react';
import './FisherTooltip.css';

const FisherTooltip = ({ fisherName, fisherData }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div className="fisher-tooltip-container">
      <span 
        className="fisher-name"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {fisherName}
      </span>
      
      {isVisible && fisherData && (
        <div className="fisher-tooltip app-tooltip">
          <div className="tooltip-content">
            <div className="tooltip-header">
              {fisherData.person?.profileImageUrl && (
                <img 
                  src={fisherData.person.profileImageUrl} 
                  alt={fisherData.person.username || fisherName}
                  className="fisher-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="fisher-info">
                <h4 className="fisher-title">{fisherData.person?.username || fisherName}</h4>
                {fisherData.fishingLicenseNumber && (
                  <p className="license-number">License: {fisherData.fishingLicenseNumber}</p>
                )}
              </div>
            </div>
            
            {fisherData.person?.email && (
              <p className="fisher-email">📧 {fisherData.person.email}</p>
            )}
            
            {fisherData.person?.phoneNumber && (
              <p className="fisher-phone">📞 {fisherData.person.phoneNumber}</p>
            )}
            
            {fisherData.defaultLanding && (
              <p className="default-landing">🏠 Home Port: {fisherData.defaultLanding.name || fisherData.defaultLanding.portName}</p>
            )}
            
            {fisherData.yearsOfExperience && (
              <p className="experience">⭐ {fisherData.yearsOfExperience} years experience</p>
            )}
            
            {fisherData.specializations && fisherData.specializations.length > 0 && (
              <div className="specializations">
                <strong>Specializations:</strong>
                <div className="spec-tags">
                  {fisherData.specializations.map((spec, index) => (
                    <span key={index} className="spec-tag">{spec}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FisherTooltip;

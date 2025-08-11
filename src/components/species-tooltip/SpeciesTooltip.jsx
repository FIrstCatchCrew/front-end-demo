import React, { useState } from 'react';
import './SpeciesTooltip.css';

const SpeciesTooltip = ({ speciesName, speciesData }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div className="species-tooltip-container">
      <span 
        className="species-name"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {speciesName}
      </span>
      
      {isVisible && speciesData && (
        <div className="species-tooltip">
          <div className="tooltip-content">
            <div className="tooltip-header">
              {speciesData.imageUrl && (
                <img 
                  src={speciesData.imageUrl} 
                  alt={speciesData.name}
                  className="species-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <h4 className="species-title">{speciesData.name}</h4>
            </div>
            
            {speciesData.description && (
              <p className="species-description">{speciesData.description}</p>
            )}
            
            {speciesData.infoLink && (
              <a 
                href={speciesData.infoLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="species-link"
                onClick={(e) => e.stopPropagation()}
              >
                Learn More →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeciesTooltip;

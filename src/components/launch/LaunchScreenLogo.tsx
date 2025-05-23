
import React from "react";

interface LaunchScreenLogoProps {
  stamped: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const LaunchScreenLogo: React.FC<LaunchScreenLogoProps> = ({ stamped, size = 'md' }) => {
  const sizes = {
    sm: {
      container: "w-12 h-12",
      wrapper: "w-14 h-14"
    },
    md: {
      container: "w-16 h-16 sm:w-20 sm:h-20",
      wrapper: "w-16 h-16 sm:w-24 sm:h-24"
    },
    lg: {
      container: "w-20 h-20 sm:w-28 sm:h-28",
      wrapper: "w-20 h-20 sm:w-28 sm:h-28"
    }
  };

  return (
    <div 
      className={`relative flex items-center justify-center transition-all duration-500 ${stamped ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
      style={{ marginBottom: "0.25rem" }}
    >
      <div className="absolute inset-0 rounded-md opacity-0"></div>
      
      <div className={`relative ${sizes[size].wrapper} flex items-center justify-center`}>
        {/* Add a stamp effect ring that appears when stamped */}
        <div 
          className={`absolute inset-0 border-4 rounded-full transition-all duration-700 ${stamped ? 'border-amber-700 scale-100 opacity-20' : 'scale-150 opacity-0'}`}
          style={{
            transform: stamped ? 'scale(1.2)' : 'scale(1.5)',
          }}
        ></div>
        
        <img 
          src="/lovable-uploads/8408dab2-58e0-488d-927d-f0930cf39585.png" 
          alt="Total Recall Catalog Logo" 
          className={`${sizes[size].container} object-contain transition-all duration-700`}
          style={{ 
            transform: stamped ? "rotate(0deg) scale(1)" : "rotate(45deg) scale(0.8)",
            transition: "transform 0.7s ease-in-out"
          }} 
        />
        
        {/* Add stamp impression effect */}
        <div 
          className={`absolute inset-0 bg-amber-800 mix-blend-color-burn rounded-full transition-opacity duration-500 ${stamped ? 'opacity-10' : 'opacity-0'}`}
        ></div>
      </div>
    </div>
  );
};

export default LaunchScreenLogo;

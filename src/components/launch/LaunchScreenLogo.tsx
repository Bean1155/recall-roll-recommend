
import React from "react";

interface LaunchScreenLogoProps {
  stamped: boolean;
}

const LaunchScreenLogo: React.FC<LaunchScreenLogoProps> = ({ stamped }) => {
  return (
    <div 
      className={`relative flex items-center justify-center transition-all duration-500 ${stamped ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
      style={{ marginBottom: "0.5rem" }}
    >
      <div className="absolute inset-0 rounded-md opacity-0"></div>
      
      <div className="relative w-24 h-24 flex items-center justify-center">
        <img 
          src="/lovable-uploads/c1229700-5ec5-4c21-baef-dc535d219a0e.png" 
          alt="Total Recall Catalog Logo" 
          className="w-full h-full object-contain"
          style={{ 
            transform: stamped ? "rotate(0deg)" : "rotate(45deg)",
            transition: "transform 0.5s ease-in-out"
          }} 
        />
      </div>
    </div>
  );
};

export default LaunchScreenLogo;

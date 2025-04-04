
import React from "react";

interface LaunchScreenLogoProps {
  stamped: boolean;
}

const LaunchScreenLogo: React.FC<LaunchScreenLogoProps> = ({ stamped }) => {
  return (
    <div 
      className={`relative flex items-center justify-center mb-8 transition-all duration-500 ${stamped ? 'rotate-0' : 'rotate-45'}`}
    >
      <div className="absolute inset-0 rounded-md opacity-20 shadow-xl"></div>
      
      <div className="relative w-40 h-40 mb-3 flex items-center justify-center">
        <img 
          src="/lovable-uploads/051572e4-ca2a-4eef-81be-0463d9c5ec0a.png" 
          alt="Total Recall Catalog Logo" 
          className="w-full h-full object-contain"
          style={{ 
            mixBlendMode: 'multiply',
            maxWidth: '100%',
            maxHeight: '100%',
            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
          }}
        />
      </div>
    </div>
  );
};

export default LaunchScreenLogo;

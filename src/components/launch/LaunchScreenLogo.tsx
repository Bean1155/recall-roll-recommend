import React from "react";

interface LaunchScreenLogoProps {
  stamped: boolean;
}

const LaunchScreenLogo: React.FC<LaunchScreenLogoProps> = ({ stamped }) => {
  return (
    <div 
      className={`relative flex items-center justify-center transition-all duration-500 ${stamped ? 'rotate-0' : 'rotate-45'}`}
    >
      <div className="absolute inset-0 rounded-md opacity-0"></div>
      
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Logo removed */}
      </div>
    </div>
  );
};

export default LaunchScreenLogo;

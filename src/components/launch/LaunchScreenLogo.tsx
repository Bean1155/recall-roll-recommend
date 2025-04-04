
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
      
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Logo placeholder - left empty as requested */}
      </div>
    </div>
  );
};

export default LaunchScreenLogo;


import React, { useState, useEffect } from "react";
import LaunchScreenLogo from "./LaunchScreenLogo";

interface LaunchScreenTitleProps {
  stamped: boolean;
}

const LaunchScreenTitle: React.FC<LaunchScreenTitleProps> = ({ stamped }) => {
  return (
    <div className="text-center mb-6 transition-all duration-700">
      {/* Add the new logo at the top */}
      <LaunchScreenLogo stamped={stamped} />
    </div>
  );
};

export default LaunchScreenTitle;

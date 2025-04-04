
import React, { useState, useEffect } from "react";
import LaunchScreenTitle from "./LaunchScreenTitle";

interface LaunchScreenAnimationProps {
  open: boolean;
  forcedOpen: boolean;
  setStamped: (stamped: boolean) => void;
  stamped: boolean;
}

const LaunchScreenAnimation: React.FC<LaunchScreenAnimationProps> = ({ 
  open, 
  forcedOpen, 
  setStamped,
  stamped 
}) => {
  // Animation sequence for the stamp effect
  useEffect(() => {
    if (open && !stamped) {
      const timer = setTimeout(() => {
        setStamped(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [open, stamped, setStamped]);

  // Reset animation when forcedOpen changes
  useEffect(() => {
    if (forcedOpen) {
      const timer = setTimeout(() => {
        setStamped(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [forcedOpen, setStamped]);

  return (
    <div 
      className={`relative flex flex-col items-center justify-center transition-all duration-1000 transform mb-6 ${stamped ? 'scale-100 opacity-100' : 'scale-150 opacity-0'}`}
    >
      <div className="bg-white bg-opacity-50 p-4 rounded border border-catalog-softBrown w-full">
        <LaunchScreenTitle stamped={stamped} />
      </div>
    </div>
  );
};

export default LaunchScreenAnimation;

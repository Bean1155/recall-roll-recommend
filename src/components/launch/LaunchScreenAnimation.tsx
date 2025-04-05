
import React, { useState, useEffect } from "react";
import LaunchScreenLogo from "./LaunchScreenLogo";

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
      className={`relative flex flex-col items-center justify-center transition-all duration-1000 transform mt-6 w-full ${stamped ? 'scale-100 opacity-100' : 'scale-150 opacity-0'}`}
    >
      {/* Envelope container */}
      <div className="w-full max-w-sm">
        {/* Envelope pocket */}
        <div 
          className={`bg-amber-500 rounded-md p-4 text-center border-2 border-amber-700 shadow-md transition-all duration-500 ${stamped ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{
            backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"none\" stroke=\"%23000000\" stroke-opacity=\"0.05\" stroke-width=\"0.5\" /><rect width=\"50\" height=\"50\" fill=\"none\" stroke=\"%23000000\" stroke-opacity=\"0.05\" stroke-width=\"0.3\" /><rect width=\"25\" height=\"25\" fill=\"none\" stroke=\"%23000000\" stroke-opacity=\"0.05\" stroke-width=\"0.2\" /></svg>')",
            backgroundSize: "100px",
          }}
        >
          <div className="font-bold text-amber-900 uppercase tracking-wider text-sm">TOTAL RECALL CATALOG</div>
          <div className="mt-1 text-xs text-amber-800">Tracking Every Bite and Blockbuster</div>
        </div>
      </div>
    </div>
  );
};

export default LaunchScreenAnimation;

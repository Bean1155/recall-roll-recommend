
import React, { useEffect } from "react";

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
      className={`relative transition-all duration-1000 transform w-full ${stamped ? 'scale-100 opacity-100' : 'scale-150 opacity-0'}`}
    >
      {/* Envelope container - Full width */}
      <div className="w-full">
        {/* Envelope pocket - Now with rounded top corners only, larger padding and more emphasis */}
        <div 
          className={`bg-amber-500 rounded-t-md p-3 sm:p-5 text-center border-3 border-amber-700 shadow-lg transition-all duration-500 ${stamped ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{
            backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"none\" stroke=\"%23000000\" stroke-opacity=\"0.05\" stroke-width=\"0.5\" /><rect width=\"50\" height=\"50\" fill=\"none\" stroke=\"%23000000\" stroke-opacity=\"0.05\" stroke-width=\"0.3\" /><rect width=\"25\" height=\"25\" fill=\"none\" stroke=\"%23000000\" stroke-opacity=\"0.05\" stroke-width=\"0.2\" /></svg>')",
            backgroundSize: "100px",
            borderWidth: "3px",
            marginTop: "0", /* Reset margin to make envelope visible */
            position: "relative",
            zIndex: "10" /* Make envelope appear above the catalog card */
          }}
        >
          <div className="font-bold text-amber-900 uppercase tracking-wider text-sm sm:text-base font-typewriter">
            CATALOG COMPANION
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchScreenAnimation;

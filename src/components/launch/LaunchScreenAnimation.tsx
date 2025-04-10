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
        {/* Removing the amber background and "Catalog Companion" text, keeping only the logo */}
        <div 
          className={`rounded-t-md p-3 sm:p-5 text-center transition-all duration-500 ${stamped ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{
            marginTop: "0", /* Reset margin to make envelope visible */
            position: "relative",
            zIndex: "10" /* Make envelope appear above the catalog card */
          }}
        >
          {/* Kept only the Total Recall logo */}
          <div>
            <img 
              src="/lovable-uploads/34a59979-7077-413b-a547-452796892364.png" 
              alt="Total Recall Catalog" 
              className="w-24 h-24 object-contain mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchScreenAnimation;

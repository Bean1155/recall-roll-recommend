
import React, { useState, useEffect } from "react";

interface LaunchScreenTitleProps {
  stamped: boolean;
}

const LaunchScreenTitle: React.FC<LaunchScreenTitleProps> = ({ stamped }) => {
  const [displayTextLine1, setDisplayTextLine1] = useState("");
  const [displayTextLine2, setDisplayTextLine2] = useState("");
  const fullTextLine1 = "TOTAL RECALL CATALOG";
  const fullTextLine2 = "Tracking Every Bite and Blockbuster";
  
  // Typewriter effect for the title
  useEffect(() => {
    if (stamped) {
      // Reset text first
      setDisplayTextLine1("");
      setDisplayTextLine2("");
      
      // Start typing first line
      let currentIndex = 0;
      const typeInterval = setInterval(() => {
        if (currentIndex < fullTextLine1.length) {
          setDisplayTextLine1(fullTextLine1.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          
          // Start typing second line after first is complete
          let secondIndex = 0;
          const typeSecondInterval = setInterval(() => {
            if (secondIndex < fullTextLine2.length) {
              setDisplayTextLine2(fullTextLine2.substring(0, secondIndex + 1));
              secondIndex++;
            } else {
              clearInterval(typeSecondInterval);
            }
          }, 50);
        }
      }, 100);
      
      return () => {
        clearInterval(typeInterval);
      };
    }
  }, [stamped]);

  return (
    <div className="text-center mb-6 transition-all duration-700">
      <div className={`transition-all duration-500 ${stamped ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
        <h1 className="text-2xl sm:text-3xl font-bold text-catalog-teal mb-2">
          {displayTextLine1}
          <span className={`inline-block ${displayTextLine1.length < fullTextLine1.length ? 'animate-pulse' : 'opacity-0'}`}>|</span>
        </h1>
        <p className="text-sm sm:text-base italic text-catalog-softBrown">
          {displayTextLine2}
          <span className={`inline-block ${displayTextLine1.length === fullTextLine1.length && displayTextLine2.length < fullTextLine2.length ? 'animate-pulse' : 'opacity-0'}`}>|</span>
        </p>
      </div>
    </div>
  );
};

export default LaunchScreenTitle;


import React, { useState, useEffect } from "react";

interface LaunchScreenTitleProps {
  stamped: boolean;
}

const LaunchScreenTitle: React.FC<LaunchScreenTitleProps> = ({ stamped }) => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "TOTAL RECALL   CATALOG";
  
  // Typewriter effect for the title
  useEffect(() => {
    if (stamped && displayText.length < fullText.length) {
      const typeTimer = setTimeout(() => {
        setDisplayText(fullText.substring(0, displayText.length + 1));
      }, 100);
      
      return () => clearTimeout(typeTimer);
    }
  }, [stamped, displayText]);

  return (
    <div 
      className={`text-center transform transition-all duration-700 mb-2 ${stamped ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      style={{
        fontFamily: "'American Typewriter', 'Courier New', monospace",
      }}
    >
      <h1 
        className="text-3xl font-bold mb-0 font-typewriter"
        style={{
          color: "#000000",
          minHeight: "40px",
          lineHeight: '1.2rem',
        }}
      >
        {displayText}
        <span className={`inline-block ${displayText.length < fullText.length ? 'animate-pulse' : 'opacity-0'}`}>|</span>
      </h1>
      <p className="text-lg text-vintage-red font-typewriter">
        Tracking Every Bite and Blockbuster
      </p>
    </div>
  );
};

export default LaunchScreenTitle;

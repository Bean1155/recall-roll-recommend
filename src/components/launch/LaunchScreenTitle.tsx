
import React, { useState, useEffect } from "react";

interface LaunchScreenTitleProps {
  stamped: boolean;
}

const LaunchScreenTitle: React.FC<LaunchScreenTitleProps> = ({ stamped }) => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "TOTAL RECALL CATALOG";
  
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
      className={`text-center transform transition-all duration-700 ${stamped ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      style={{
        fontFamily: "'American Typewriter', 'Courier New', monospace",
      }}
    >
      <h1 className="text-4xl font-bold mb-2 font-typewriter"
        style={{
          textShadow: "1px 1px 0px rgba(50, 50, 93, 0.25)",
          color: "#000000",
          minHeight: "48px",
        }}>
        {displayText}
        <span className={`inline-block ${displayText.length < fullText.length ? 'animate-pulse' : 'opacity-0'}`}>|</span>
      </h1>
      <p className="text-xl text-vintage-red font-typewriter mb-4">
        Tracking Every Bite and Blockbuster
      </p>
    </div>
  );
};

export default LaunchScreenTitle;

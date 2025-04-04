
import React, { useState, useEffect } from "react";

interface LaunchScreenTitleProps {
  stamped: boolean;
}

const LaunchScreenTitle: React.FC<LaunchScreenTitleProps> = ({ stamped }) => {
  const [displayTextLine1, setDisplayTextLine1] = useState("");
  const [displayTextLine2, setDisplayTextLine2] = useState("");
  const fullTextLine1 = "TOTAL RECALL";
  const fullTextLine2 = "CATALOG";
  
  // Typewriter effect for the title (first line)
  useEffect(() => {
    if (stamped && displayTextLine1.length < fullTextLine1.length) {
      const typeTimer = setTimeout(() => {
        setDisplayTextLine1(fullTextLine1.substring(0, displayTextLine1.length + 1));
      }, 100);
      
      return () => clearTimeout(typeTimer);
    } else if (stamped && displayTextLine1.length === fullTextLine1.length && displayTextLine2.length < fullTextLine2.length) {
      // Start typing second line after first is complete
      const typeTimer = setTimeout(() => {
        setDisplayTextLine2(fullTextLine2.substring(0, displayTextLine2.length + 1));
      }, 100);
      
      return () => clearTimeout(typeTimer);
    }
  }, [stamped, displayTextLine1, displayTextLine2]);

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
          minHeight: "2.4rem",
          lineHeight: '1.2rem',
        }}
      >
        <div className="mb-4">
          {displayTextLine1}
          <span className={`inline-block ${displayTextLine1.length < fullTextLine1.length ? 'animate-pulse' : 'opacity-0'}`}>|</span>
        </div>
        <div>
          {displayTextLine2}
          <span className={`inline-block ${displayTextLine1.length === fullTextLine1.length && displayTextLine2.length < fullTextLine2.length ? 'animate-pulse' : 'opacity-0'}`}>|</span>
        </div>
      </h1>
      <p className="text-lg text-vintage-red font-typewriter mt-2">
        Tracking Every Bite and Blockbuster
      </p>
    </div>
  );
};

export default LaunchScreenTitle;

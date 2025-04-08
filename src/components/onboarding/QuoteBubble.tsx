
import React, { useState, useEffect } from "react";

interface QuoteBubbleProps {
  text: string;
  color?: string;
  delay?: number;
  isEntertainment?: boolean;
}

const QuoteBubble: React.FC<QuoteBubbleProps> = ({ 
  text, 
  color = "#add8e6", 
  delay = 0,
  isEntertainment = false
}) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`relative transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div 
        className="relative p-4 md:p-6 mb-8 rounded-lg border-2 border-black shadow-lg"
        style={{ 
          backgroundColor: color,
          minHeight: "100px",
          maxWidth: isEntertainment ? "450px" : "350px",
        }}
      >
        <p className="font-bold text-xl md:text-2xl text-center">
          {text}
        </p>
        
        {/* Triangular pointer at the bottom */}
        <div 
          className="absolute bottom-0 w-6 h-6 transform translate-y-1/2 rotate-45"
          style={{
            backgroundColor: color,
            borderRight: "2px solid black",
            borderBottom: "2px solid black",
            right: isEntertainment ? "30%" : "20%"
          }}
        >
        </div>
      </div>
    </div>
  );
};

export default QuoteBubble;

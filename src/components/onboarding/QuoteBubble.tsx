
import React, { useState, useEffect } from "react";

interface QuoteBubbleProps {
  text: string;
  color?: string;
  delay?: number;
  isEntertainment?: boolean;
  position?: "left" | "right" | "center";
  animation?: "vertical" | "horizontal" | "static";
}

const QuoteBubble: React.FC<QuoteBubbleProps> = ({ 
  text, 
  color = "#add8e6", 
  delay = 0,
  isEntertainment = false,
  position = "center",
  animation = "static"
}) => {
  const [visible, setVisible] = useState(false);
  const [animationOffset, setAnimationOffset] = useState(0);
  
  useEffect(() => {
    // Initial appearance animation
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    
    // Floating animation
    if (animation !== "static") {
      const animInterval = setInterval(() => {
        setAnimationOffset(prev => (prev + 1) % 2); // Toggle between 0 and 1
      }, 2000); // Change direction every 2 seconds
      
      return () => {
        clearTimeout(timer);
        clearInterval(animInterval);
      };
    }
    
    return () => clearTimeout(timer);
  }, [delay, animation]);
  
  // Calculate position styles
  const getPositionStyle = () => {
    let positionStyles = {};
    
    switch (position) {
      case "left":
        positionStyles = { left: "10%", top: "30%" };
        break;
      case "right":
        positionStyles = { right: "10%", top: "70%" };
        break;
      default:
        positionStyles = { left: "50%", top: "50%", transform: "translate(-50%, -50%)" };
    }
    
    // Add animation transforms
    if (animation === "vertical") {
      const yOffset = animationOffset === 0 ? "0px" : "-15px";
      return {
        ...positionStyles,
        transform: `translateY(${yOffset})`,
        transition: "transform 2s ease-in-out"
      };
    } else if (animation === "horizontal") {
      const xOffset = animationOffset === 0 ? "0px" : "15px";
      return {
        ...positionStyles,
        transform: `translateX(${xOffset})`,
        transition: "transform 2s ease-in-out"
      };
    }
    
    return positionStyles;
  };

  return (
    <div 
      className={`absolute transition-all duration-700 ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{ 
        ...getPositionStyle(),
        transitionDelay: `${delay}ms`,
        zIndex: position === "right" ? 2 : 1
      }}
    >
      <div 
        className="relative p-3 md:p-4 mb-8 rounded-lg border-2 border-black shadow-lg"
        style={{ 
          backgroundColor: color,
          minHeight: "80px",
          maxWidth: isEntertainment ? "400px" : "240px",
        }}
      >
        <p className="font-bold text-lg md:text-xl text-center text-black">
          {text}
        </p>
        
        {/* Triangular pointer at the bottom */}
        <div 
          className="absolute bottom-0 w-5 h-5 transform translate-y-1/2 rotate-45"
          style={{
            backgroundColor: color,
            borderRight: "2px solid black",
            borderBottom: "2px solid black",
            right: position === "left" ? "20%" : (position === "right" ? "75%" : "20%")
          }}
        >
        </div>
      </div>
    </div>
  );
};

export default QuoteBubble;

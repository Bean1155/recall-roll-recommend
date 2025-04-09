
import React, { useState, useEffect } from "react";
import QuoteBubble from "./QuoteBubble";

interface OnboardingStepProps {
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  backgroundColor?: string;
  stepType?: "intro" | "bites" | "blockbusters" | "other";
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  subtitle,
  description,
  image,
  backgroundColor = "#F5F1E6",
  stepType = "other",
}) => {
  // State for controlling the catalog card animation
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  // Start the animation after component mounts
  useEffect(() => {
    if (stepType === "intro") {
      // Start the card opening animation
      const animationTimer = setTimeout(() => {
        setIsAnimating(true);
      }, 500);
      
      // Show logo after card opens
      const logoTimer = setTimeout(() => {
        setShowLogo(true);
      }, 1200);
      
      return () => {
        clearTimeout(animationTimer);
        clearTimeout(logoTimer);
      };
    }
  }, [stepType]);

  return (
    <div className="flex flex-col items-center text-center">
      {/* Header section with colored background */}
      <div 
        className="w-full py-6 px-8 flex flex-col items-center justify-center"
        style={{ backgroundColor }}
      >
        <h2 className="text-2xl font-bold font-typewriter text-[#5D4037]">
          {title}
        </h2>
        {subtitle && (
          <h3 className="text-xl font-bold font-typewriter text-[#5D4037] mt-1">
            {subtitle}
          </h3>
        )}
      </div>
      
      {/* Content section with either quote bubbles, animated catalog card, or normal image */}
      {stepType === "intro" ? (
        <div className="p-6 w-full flex justify-center bg-white">
          {/* Animated catalog card */}
          <div 
            className={`relative transition-all duration-1000 ease-in-out transform ${
              isAnimating ? 'scale-100' : 'scale-90'
            }`}
            style={{
              width: "250px",
              height: "250px",
              perspective: "1000px"
            }}
          >
            {/* Catalog card container */}
            <div 
              className={`relative w-full h-full transition-all duration-1000 transform ${
                isAnimating ? 'rotate-y-0' : 'rotate-y-180'
              }`}
              style={{
                transformStyle: "preserve-3d",
                transform: isAnimating ? "rotateY(0deg)" : "rotateY(180deg)"
              }}
            >
              {/* Card front (showing logo) */}
              <div 
                className="absolute inset-0 flex items-center justify-center bg-white rounded-md border-2 border-catalog-softBrown shadow-md"
                style={{
                  backfaceVisibility: "hidden",
                  zIndex: 2
                }}
              >
                <div 
                  className={`transition-all duration-700 transform ${
                    showLogo ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                  }`}
                >
                  <img 
                    src={image} 
                    alt="Total Recall Catalog Logo" 
                    className="max-w-full max-h-full object-contain p-4"
                  />
                </div>
              </div>
              
              {/* Card back */}
              <div 
                className="absolute inset-0 bg-amber-100 rounded-md border-2 border-catalog-softBrown flex items-center justify-center"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  zIndex: 1
                }}
              >
                <div className="w-4/5 h-4/5 border border-dashed border-amber-800 rounded opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      ) : stepType === "bites" ? (
        <div className="p-6 w-full flex flex-col items-center justify-center bg-white">
          {/* Two animated speech clouds for bites page with increased height for better spacing */}
          <div className="relative w-full h-[300px] overflow-hidden">
            {/* First speech cloud - moving up/down */}
            <QuoteBubble 
              text="WE JUST WENT TO A GREAT RESTAURANT!" 
              color="#FFDEE2"
              delay={300}
              position="left"
              animation="vertical"
            />
            
            {/* Second speech cloud - moving side to side */}
            <QuoteBubble 
              text="OOOH, WHAT'S THE NAME?" 
              color="#D3E4FD" 
              delay={800}
              position="right"
              animation="horizontal"
            />
          </div>
        </div>
      ) : stepType === "blockbusters" ? (
        <div className="p-6 w-full flex flex-col items-center justify-center bg-white">
          <QuoteBubble 
            text="WATCH ANY GOOD SHOWS OR MOVIES LATELY?" 
            color="#add8e6" 
            delay={300}
            isEntertainment={true}
          />
        </div>
      ) : (
        <div className="p-6 w-full flex justify-center bg-white">
          <div 
            className="rounded-md overflow-hidden border-2 border-catalog-softBrown shadow-md"
            style={{ 
              maxWidth: "250px",
              maxHeight: "250px",
              backgroundColor: "#FFFFFF"
            }}
          >
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      
      {/* Description section */}
      <div className="px-8 pb-6 bg-white w-full">
        <p className="text-lg font-typewriter text-gray-700"
           style={{ lineHeight: 1.6 }}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default OnboardingStep;

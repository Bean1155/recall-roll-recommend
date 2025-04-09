import React, { useState, useEffect } from "react";
import QuoteBubble from "./QuoteBubble";
import { Sparkles } from "lucide-react";

interface OnboardingStepProps {
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  backgroundColor?: string;
  stepType?: "intro" | "bites" | "blockbusters" | "other" | "share";
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
  const [showDrawers, setShowDrawers] = useState(false);
  const [sparkleAngle, setSparkleAngle] = useState(0);
  const [logoVisible, setLogoVisible] = useState(false);

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
    } else if (stepType === "blockbusters") {
      // Start the catalog drawers animation
      const drawerTimer = setTimeout(() => {
        setShowDrawers(true);
      }, 500);
      
      return () => {
        clearTimeout(drawerTimer);
      };
    } else if (stepType === "share") {
      // Show the logo with a simple fade-in animation
      const logoTimer = setTimeout(() => {
        setLogoVisible(true);
      }, 500);
      
      return () => {
        clearTimeout(logoTimer);
      };
    }
  }, [stepType]);

  // Animate the sparkles icon
  useEffect(() => {
    const sparkleInterval = setInterval(() => {
      setSparkleAngle(prev => (prev + 15) % 360);
    }, 1000);
    
    return () => clearInterval(sparkleInterval);
  }, []);

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
              {/* Card front (showing icon) */}
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
                  {/* Animated sparkles icon instead of static logo */}
                  <div className="flex items-center justify-center h-32 w-32 relative">
                    <Sparkles 
                      size={64}
                      className="text-[#D3E4FD] absolute"
                      style={{
                        transform: `rotate(${sparkleAngle}deg)`,
                        transition: 'transform 1s ease-in-out',
                      }}
                    />
                    <Sparkles 
                      size={48}
                      className="text-catalog-teal"
                    />
                  </div>
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
          {/* Three animated speech clouds arranged in two rows */}
          <div className="relative w-full h-[400px] overflow-hidden">
            {/* First row: two speech clouds side by side */}
            <div className="flex justify-between mb-10 pt-10">
              {/* Left speech cloud - Restaurant */}
              <QuoteBubble 
                text="WE JUST WENT TO A GREAT RESTAURANT!" 
                color="#FFDEE2"
                delay={300}
                position="left"
                animation="vertical"
                size="small"
              />
              
              {/* Right speech cloud - Movie */}
              <QuoteBubble 
                text="YOU'VE GOT TO SEE THIS MOVIE!" 
                color="#D3E4FD" 
                delay={500}
                position="right"
                animation="vertical"
                size="small"
                style={{ top: "5%" }}
              />
            </div>
            
            {/* Second row: one speech cloud centered */}
            <QuoteBubble 
              text="OOOH, WHAT'S THE NAME?" 
              color="#D8E4C8" 
              delay={800}
              position="center"
              animation="horizontal"
              size="medium"
              style={{ top: "60%" }}
            />
          </div>
        </div>
      ) : stepType === "blockbusters" ? (
        <div className="p-6 w-full flex flex-col items-center justify-center bg-white">
          {/* Animated catalog box with drawers */}
          <div className="w-full max-w-md mx-auto">
            {/* Removed the title "BUILD YOUR PERSONAL LIBRARY" that was here */}
            
            <div className="relative bg-catalog-cream border-2 border-catalog-softBrown rounded-lg p-4 shadow-lg">
              {/* Catalog drawer animation */}
              <div className="space-y-3">
                {/* First drawer - Movies */}
                <div 
                  className={`transition-all duration-500 ease-in-out transform bg-[#D3E4FD] border border-catalog-softBrown rounded-md p-3 shadow ${
                    showDrawers ? 'translate-x-0' : 'translate-x-[-100%]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-typewriter text-sm ml-3">MOVIES</div>
                    {/* Changed tab color to the blue used in blockbusters home page */}
                    <div className="w-4 h-6 rounded-l-sm bg-[#D3E4FD] border-l border-t border-b border-catalog-softBrown"></div>
                  </div>
                </div>
                
                {/* Second drawer - Bakeries */}
                <div 
                  className={`transition-all duration-500 delay-100 ease-in-out transform bg-[#FFDEE2] border border-catalog-softBrown rounded-md p-3 shadow ${
                    showDrawers ? 'translate-x-0' : 'translate-x-[-100%]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-typewriter text-sm ml-3">BAKERIES</div>
                    {/* Changed tab color to the blue used in blockbusters home page */}
                    <div className="w-4 h-6 rounded-l-sm bg-[#D3E4FD] border-l border-t border-b border-catalog-softBrown"></div>
                  </div>
                </div>
                
                {/* Third drawer - TV Shows */}
                <div 
                  className={`transition-all duration-500 delay-200 ease-in-out transform bg-[#D8E4C8] border border-catalog-softBrown rounded-md p-3 shadow ${
                    showDrawers ? 'translate-x-0' : 'translate-x-[-100%]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-typewriter text-sm ml-3">TV SHOWS</div>
                    {/* Changed tab color to the blue used in blockbusters home page */}
                    <div className="w-4 h-6 rounded-l-sm bg-[#D3E4FD] border-l border-t border-b border-catalog-softBrown"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-bold font-typewriter text-center mt-4 text-[#5D4037]">
              RECOMMEND BITES AND BLOCKBUSTERS BY SHARING INDIVIDUAL CARDS
            </h3>
          </div>
        </div>
      ) : stepType === "share" ? (
        <div className="p-6 w-full flex flex-col justify-center items-center bg-white">
          {/* Simple logo display with fade-in animation */}
          <div 
            className={`transition-all duration-1000 transform ${
              logoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <img 
              src="/lovable-uploads/34a59979-7077-413b-a547-452796892364.png" 
              alt="Total Recall Catalog" 
              className="w-64 h-64 object-contain"
            />
          </div>
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
      
      {/* Description section - only display if there's a description */}
      {description && (
        <div className="px-8 pb-6 bg-white w-full">
          <p className="text-lg font-typewriter text-gray-700"
             style={{ lineHeight: 1.6 }}>
            {description}
          </p>
        </div>
      )}
    </div>
  );
};

export default OnboardingStep;


import React, { useState, useEffect } from "react";
import IntroStep from "./steps/IntroStep";
import BitesStep from "./steps/BitesStep";
import BlockbustersStep from "./steps/BlockbustersStep";
import ShareStep from "./steps/ShareStep";
import DefaultStep from "./steps/DefaultStep";

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
  // State for controlling animations
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showDrawers, setShowDrawers] = useState(false);
  const [sparkleAngle, setSparkleAngle] = useState(0);
  const [logoVisible, setLogoVisible] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

  // Start the animation after component mounts
  useEffect(() => {
    if (stepType === "intro") {
      // First animate the book opening
      const bookTimer = setTimeout(() => {
        setBookOpen(true);
      }, 500);
      
      // Then show the title
      const titleTimer = setTimeout(() => {
        setShowTitle(true);
      }, 1400);
      
      return () => {
        clearTimeout(bookTimer);
        clearTimeout(titleTimer);
      };
    } else if (stepType === "bites") {
      // Start the card opening animation
      const animationTimer = setTimeout(() => {
        setIsAnimating(true);
      }, 500);
      
      return () => {
        clearTimeout(animationTimer);
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

  // Render the appropriate step content based on stepType
  const renderStepContent = () => {
    switch (stepType) {
      case "intro":
        return <IntroStep showTitle={showTitle} bookOpen={bookOpen} sparkleAngle={sparkleAngle} />;
      case "bites":
        return <BitesStep />;
      case "blockbusters":
        return <BlockbustersStep showDrawers={showDrawers} />;
      case "share":
        return <ShareStep logoVisible={logoVisible} />;
      default:
        return <DefaultStep image={image} title={title} />;
    }
  };

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
      
      {/* Content section with appropriate step component */}
      {renderStepContent()}
      
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

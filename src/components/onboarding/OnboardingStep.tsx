
import React from "react";
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
      
      {/* Content section with either quote bubbles or normal image */}
      {stepType === "bites" ? (
        <div className="p-6 w-full flex flex-col items-center justify-center bg-white">
          <QuoteBubble 
            text="BEEN TO ANY GOOD RESTAURANTS?" 
            color="#add8e6"
            delay={300}
          />
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

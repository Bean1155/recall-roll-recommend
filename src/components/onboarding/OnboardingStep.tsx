
import React from "react";

interface OnboardingStepProps {
  title: string;
  description: string;
  image: string;
  backgroundColor?: string;
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  description,
  image,
  backgroundColor = "#F5F1E6",
}) => {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Header section with colored background */}
      <div 
        className="w-full py-6 px-8 flex items-center justify-center"
        style={{ backgroundColor }}
      >
        <h2 className="text-2xl font-bold font-typewriter text-[#5D4037]">
          {title}
        </h2>
      </div>
      
      {/* Image section */}
      <div className="p-6 w-full flex justify-center">
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
      
      {/* Description section */}
      <div className="px-8 pb-6">
        <p className="text-lg font-typewriter text-gray-700"
           style={{ lineHeight: 1.6 }}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default OnboardingStep;

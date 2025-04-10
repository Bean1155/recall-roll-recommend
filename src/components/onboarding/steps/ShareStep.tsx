
import React from "react";

interface ShareStepProps {
  logoVisible: boolean;
}

const ShareStep: React.FC<ShareStepProps> = ({ logoVisible }) => {
  return (
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
      
      <div className="mt-4">
        <p className="text-lg font-typewriter text-center text-gray-700">
          RECOMMEND BITES &amp; BLOCKBUSTERS TO FRIENDS AND TRACK WHO FOLLOWS YOUR SUGGESTIONS.
        </p>
      </div>
    </div>
  );
};

export default ShareStep;

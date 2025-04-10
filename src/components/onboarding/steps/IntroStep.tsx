
import React, { useState, useEffect } from "react";
import { BookOpen, Sparkles } from "lucide-react";

interface IntroStepProps {
  showTitle: boolean;
  bookOpen: boolean;
  sparkleAngle: number;
}

const IntroStep: React.FC<IntroStepProps> = ({ 
  showTitle, 
  bookOpen, 
  sparkleAngle 
}) => {
  return (
    <div className="p-6 w-full flex justify-center bg-white">
      {/* Animated book */}
      <div className="perspective-1000 w-64 h-64 relative">
        {/* Book cover */}
        <div 
          className={`absolute inset-0 rounded-md shadow-lg transition-all duration-1000 ease-in-out ${
            bookOpen ? 'rotate-y-90 opacity-0' : 'rotate-y-0 opacity-100'
          }`}
          style={{
            background: "linear-gradient(135deg, #1A1F2C 0%, #403E43 100%)",
            borderLeft: "12px solid #8B5CF6",
            transformStyle: "preserve-3d",
            transform: bookOpen ? "rotateY(-90deg)" : "rotateY(0deg)",
            transformOrigin: "left center",
            boxShadow: "rgba(0, 0, 0, 0.4) 0px 8px 20px"
          }}
        >
          {/* Book cover design */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <BookOpen size={48} className="text-white mb-6" />
              <div className="text-white font-typewriter text-lg font-bold tracking-wider">CATALOG</div>
              
              {/* Add decorative elements to the cover */}
              <div className="absolute top-4 left-4 w-20 h-1 bg-[#F97316]"></div>
              <div className="absolute bottom-4 right-4 w-20 h-1 bg-[#F97316]"></div>
              
              <div className="absolute top-8 right-8">
                <Sparkles 
                  size={20}
                  className="text-[#0EA5E9]"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Book pages */}
        <div 
          className="absolute inset-0 bg-white border border-gray-300 rounded-md"
          style={{
            transformStyle: "preserve-3d",
            boxShadow: "rgba(0, 0, 0, 0.15) -5px 0px 15px inset"
          }}
        >
          {/* Book content (appears after book opens) */}
          <div 
            className={`absolute inset-0 flex flex-col items-center justify-center p-4 transition-all duration-700 ${
              showTitle ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <h1 className="text-2xl font-bold text-[#5D4037] font-typewriter mb-2">TOTAL</h1>
            <h1 className="text-2xl font-bold text-[#5D4037] font-typewriter mb-4">RECALL</h1>
            <h1 className="text-2xl font-bold text-[#5D4037] font-typewriter">CATALOG</h1>
            
            <div className="absolute bottom-4 right-4">
              <Sparkles 
                size={24}
                className="text-catalog-teal"
                style={{
                  transform: `rotate(${sparkleAngle}deg)`,
                  transition: 'transform 1s ease-in-out',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroStep;

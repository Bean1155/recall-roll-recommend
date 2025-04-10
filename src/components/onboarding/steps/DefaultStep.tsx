
import React from "react";
import { Smile } from "lucide-react";

interface DefaultStepProps {
  image: string;
  title: string;
}

const DefaultStep: React.FC<DefaultStepProps> = ({ image, title }) => {
  // If this is the "HAPPY SHARER" slide, show the custom happy face image instead
  const isHappySharerSlide = title.includes("HAPPY SHARER");
  
  return (
    <div className="p-6 w-full flex justify-center bg-white">
      {isHappySharerSlide ? (
        <div className="flex items-center justify-center" style={{ width: "250px", height: "250px" }}>
          <img 
            src="/lovable-uploads/bc25fbcb-069d-4c14-989c-8b330ee064c2.png" 
            alt="Happy Sharer" 
            className="w-full h-full object-contain"
            style={{ maxWidth: "220px" }}
          />
        </div>
      ) : (
        <div 
          className="rounded-md overflow-hidden border-2 border-catalog-softBrown shadow-md flex items-center justify-center"
          style={{ 
            maxWidth: "250px",
            height: "250px",
            backgroundColor: "#FFFFFF"
          }}
        >
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default DefaultStep;

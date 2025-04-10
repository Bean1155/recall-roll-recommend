
import React from "react";
import { Smile } from "lucide-react";

interface DefaultStepProps {
  image: string;
  title: string;
}

const DefaultStep: React.FC<DefaultStepProps> = ({ image, title }) => {
  // If this is the "HAPPY SHARER" slide, show the smile icon instead of image
  const isHappySharerSlide = title.includes("HAPPY SHARER");
  
  return (
    <div className="p-6 w-full flex justify-center bg-white">
      {isHappySharerSlide ? (
        <div className="flex items-center justify-center" style={{ width: "250px", height: "250px" }}>
          <div className="rounded-full bg-[#FEF7CD] p-4 flex items-center justify-center" style={{ width: "180px", height: "180px" }}>
            <Smile size={120} strokeWidth={3} className="text-black" />
          </div>
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

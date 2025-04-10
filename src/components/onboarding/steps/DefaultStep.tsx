
import React from "react";

interface DefaultStepProps {
  image: string;
  title: string;
}

const DefaultStep: React.FC<DefaultStepProps> = ({ image, title }) => {
  return (
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
  );
};

export default DefaultStep;

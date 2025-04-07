
import React from "react";

interface BackgroundDecoratorProps {
  className?: string;
}

const BackgroundDecorator: React.FC<BackgroundDecoratorProps> = ({ className = "" }) => {
  return (
    <>
      {/* Background pattern */}
      <div className={`absolute top-0 left-0 w-full h-full pointer-events-none ${className}`} style={{
        background: "linear-gradient(90deg, rgba(139,125,107,0.02) 0%, rgba(139,125,107,0) 20%, rgba(139,125,107,0) 80%, rgba(139,125,107,0.02) 100%)",
        zIndex: 1
      }}></div>
    </>
  );
};

export default BackgroundDecorator;

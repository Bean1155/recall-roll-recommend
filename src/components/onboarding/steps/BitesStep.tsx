
import React from "react";
import QuoteBubble from "../QuoteBubble";

const BitesStep: React.FC = () => {
  return (
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
  );
};

export default BitesStep;

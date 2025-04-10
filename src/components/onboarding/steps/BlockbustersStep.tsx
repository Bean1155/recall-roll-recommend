
import React from "react";

interface BlockbustersStepProps {
  showDrawers: boolean;
}

const BlockbustersStep: React.FC<BlockbustersStepProps> = ({ showDrawers }) => {
  return (
    <div className="p-6 w-full flex flex-col items-center justify-center bg-white">
      {/* Animated catalog box with drawers */}
      <div className="w-full max-w-md mx-auto">
        <div className="relative bg-catalog-cream border-2 border-catalog-softBrown rounded-lg p-4 shadow-lg">
          {/* Catalog drawer animation */}
          <div className="space-y-3">
            {/* First drawer - Movies */}
            <div 
              className={`transition-all duration-500 ease-in-out transform bg-[#D3E4FD] border border-catalog-softBrown rounded-md p-3 shadow ${
                showDrawers ? 'translate-x-0' : 'translate-x-[-100%]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-typewriter text-sm ml-3">MOVIES</div>
                {/* Tab color from blockbusters home page */}
                <div className="w-4 h-6 rounded-l-sm bg-[#D3E4FD] border-l border-t border-b border-catalog-softBrown"></div>
              </div>
            </div>
            
            {/* Second drawer - Bakeries */}
            <div 
              className={`transition-all duration-500 delay-100 ease-in-out transform bg-[#FFDEE2] border border-catalog-softBrown rounded-md p-3 shadow ${
                showDrawers ? 'translate-x-0' : 'translate-x-[-100%]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-typewriter text-sm ml-3">BAKERIES</div>
                <div className="w-4 h-6 rounded-l-sm bg-[#D3E4FD] border-l border-t border-b border-catalog-softBrown"></div>
              </div>
            </div>
            
            {/* Third drawer - TV Shows */}
            <div 
              className={`transition-all duration-500 delay-200 ease-in-out transform bg-[#D8E4C8] border border-catalog-softBrown rounded-md p-3 shadow ${
                showDrawers ? 'translate-x-0' : 'translate-x-[-100%]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-typewriter text-sm ml-3">TV SHOWS</div>
                <div className="w-4 h-6 rounded-l-sm bg-[#D3E4FD] border-l border-t border-b border-catalog-softBrown"></div>
              </div>
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold font-typewriter text-center mt-4 text-[#5D4037]">
          RECOMMEND BITES AND BLOCKBUSTERS BY SHARING INDIVIDUAL CARDS
        </h3>
      </div>
    </div>
  );
};

export default BlockbustersStep;

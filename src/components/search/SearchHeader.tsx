
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchHeaderProps {
  type: 'food' | 'entertainment';
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ type }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`bg-[#1A7D76] w-full py-3 px-4 flex flex-col items-center justify-center ${isMobile ? 'mt-0' : ''}`}>
      <div className="text-white font-serif text-xl font-bold tracking-wide">
        CATALOG CARD
      </div>
      <div className="text-white/90 font-serif text-sm">
        {type === 'food' ? 'BITES' : 'BLOCKBUSTERS'}
      </div>
    </div>
  );
};

export default SearchHeader;

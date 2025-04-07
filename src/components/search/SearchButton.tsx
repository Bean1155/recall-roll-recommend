
import React from "react";
import { Button } from "@/components/ui/button";

interface SearchButtonProps {
  onClick: () => void;
}

const SearchButton: React.FC<SearchButtonProps> = ({ onClick }) => {
  return (
    <div className="mt-3 flex justify-center">
      <Button 
        onClick={onClick}
        className="bg-[#1A7D76] hover:bg-[#166661] px-8 rounded-2xl font-typewriter text-white"
      >
        SEARCH CATALOG
      </Button>
    </div>
  );
};

export default SearchButton;


import React from "react";
import { Button } from "@/components/ui/button";
import { Utensils, Film } from "lucide-react";

interface TypeToggleProps {
  currentType: 'food' | 'entertainment';
  onTypeChange: (type: 'food' | 'entertainment') => void;
}

const TypeToggle: React.FC<TypeToggleProps> = ({ currentType, onTypeChange }) => {
  return (
    <div className="flex justify-center mb-2">
      <div className="bg-catalog-cream rounded-full p-1 inline-flex">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onTypeChange('food')}
          className={`rounded-full px-4 ${
            currentType === 'food' 
            ? 'bg-white text-catalog-softBrown shadow-sm' 
            : 'text-catalog-softBrown/70 hover:text-catalog-softBrown'
          }`}
        >
          <Utensils className="h-4 w-4 mr-2" />
          Bites
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onTypeChange('entertainment')}
          className={`rounded-full px-4 ${
            currentType === 'entertainment' 
            ? 'bg-white text-catalog-softBrown shadow-sm' 
            : 'text-catalog-softBrown/70 hover:text-catalog-softBrown'
          }`}
        >
          <Film className="h-4 w-4 mr-2" />
          Blockbusters
        </Button>
      </div>
    </div>
  );
};

export default TypeToggle;

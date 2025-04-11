
import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon, Utensils, Film, CircleDot } from "lucide-react";

interface ToggleOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface TypeToggleProps {
  currentType: string;
  onTypeChange: (type: string) => void;
  options: ToggleOption[];
  className?: string;
}

const TypeToggle: React.FC<TypeToggleProps> = ({ 
  currentType, 
  onTypeChange, 
  options,
  className = ""
}) => {
  return (
    <div className={`flex justify-center mb-2 ${className}`}>
      <div className="bg-catalog-cream rounded-full p-1 inline-flex">
        {options.map((option) => {
          const Icon = option.icon;
          const isActive = currentType === option.value;
          
          return (
            <Button
              key={option.value}
              variant="ghost"
              size="sm"
              onClick={() => onTypeChange(option.value)}
              className={`rounded-full px-4 ${
                isActive
                ? 'bg-white text-catalog-softBrown shadow-sm' 
                : 'text-catalog-softBrown/70 hover:text-catalog-softBrown'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

// Preset configurations
export const FoodEntertainmentToggle: React.FC<{
  currentType: 'food' | 'entertainment';
  onTypeChange: (type: 'food' | 'entertainment') => void;
}> = ({ currentType, onTypeChange }) => {
  const options = [
    { value: 'food', label: 'Bites', icon: Utensils },
    { value: 'entertainment', label: 'Blockbusters', icon: Film }
  ];
  
  return (
    <TypeToggle 
      currentType={currentType} 
      onTypeChange={onTypeChange} 
      options={options} 
    />
  );
};

export default TypeToggle;

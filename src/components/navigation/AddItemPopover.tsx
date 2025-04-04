
import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon, PlusCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AddOption {
  name: string;
  icon: LucideIcon;
  path: string;
  description: string;
}

interface AddItemPopoverProps {
  options: AddOption[];
  color: string;
  onClick?: () => void;
}

const AddItemPopover: React.FC<AddItemPopoverProps> = ({ options, color, onClick }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex flex-col items-center cursor-pointer">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all duration-200 hover:scale-125 hover:shadow-lg"
            style={{ backgroundColor: color }}
          >
            <PlusCircle 
              size={22} 
              className="text-catalog-softBrown"
            />
          </div>
          <span className="text-xs font-medium text-catalog-softBrown transition-all duration-200">
            Add
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-white shadow-lg rounded-lg border border-catalog-softBrown/20">
        <div className="p-3 bg-purple-50 border-b border-catalog-softBrown/10 rounded-t-lg">
          <h3 className="font-medium text-center text-catalog-softBrown">What would you like to add?</h3>
        </div>
        <div className="flex flex-col">
          {options.map((option) => (
            <Link 
              key={option.name}
              to={option.path} 
              className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
              onClick={onClick}
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <option.icon size={18} className="text-catalog-softBrown" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{option.name}</span>
                <span className="text-xs text-gray-500">{option.description}</span>
              </div>
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddItemPopover;


import React from "react";
import { Star } from "lucide-react";
import { 
  DropdownMenuLabel, 
  DropdownMenuSub, 
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface RatingFiltersProps {
  activeRatings: number[];
  onSelect: (filterType: string, value: string) => void;
}

const RatingFilters = ({ activeRatings, onSelect }: RatingFiltersProps) => {
  return (
    <>
      <DropdownMenuLabel className="text-xs text-gray-500">Rating</DropdownMenuLabel>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="flex items-center">
          <span>By Star Rating</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent 
            className="w-56" 
            sideOffset={2} 
            alignOffset={-5}
            style={{ backgroundColor: "white", zIndex: 50 }}
          >
            <DropdownMenuCheckboxItem
              checked={activeRatings.includes(5)}
              onSelect={() => onSelect("rating", "5")}
              className="flex items-center"
            >
              <div className="flex items-center">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="ml-2">5 Stars Only</span>
              </div>
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={activeRatings.includes(4)}
              onSelect={() => onSelect("rating", "4")}
              className="flex items-center"
            >
              <div className="flex items-center">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="ml-2">4 Stars Only</span>
              </div>
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={activeRatings.includes(3)}
              onSelect={() => onSelect("rating", "3")}
              className="flex items-center"
            >
              <div className="flex items-center">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="ml-2">3 Stars Only</span>
              </div>
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={activeRatings.includes(2)}
              onSelect={() => onSelect("rating", "2")}
              className="flex items-center"
            >
              <div className="flex items-center">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="ml-2">2 Stars Only</span>
              </div>
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={activeRatings.includes(1)}
              onSelect={() => onSelect("rating", "1")}
              className="flex items-center"
            >
              <div className="flex items-center">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="ml-2">1 Star Only</span>
              </div>
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuCheckboxItem
              checked={activeRatings.some(r => r >= 4)}
              onSelect={() => onSelect("rating", "4+")}
              className="flex items-center"
            >
              4+ Stars
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeRatings.some(r => r >= 3)}
              onSelect={() => onSelect("rating", "3+")}
              className="flex items-center"
            >
              3+ Stars
            </DropdownMenuCheckboxItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
    </>
  );
};

export default RatingFilters;

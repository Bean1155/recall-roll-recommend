
import React, { useState } from "react";
import { FilterX, Filter, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

interface BitesFilterProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onOpenFilters: () => void;
  onFilterChange?: (filterType: string, value: string) => void;
  activeFilters?: {
    status: string[];
    rating: number[];
    tags: string[];
  };
}

const BitesFilter = ({ 
  hasActiveFilters, 
  onClearFilters, 
  onOpenFilters,
  onFilterChange,
  activeFilters = { status: [], rating: [], tags: [] }
}: BitesFilterProps) => {
  const [open, setOpen] = useState(false);
  
  const handleFilterSelect = (filterType: string, value: string) => {
    if (onFilterChange) {
      onFilterChange(filterType, value);
    }
    setOpen(false);
  };
  
  return (
    <>
      {hasActiveFilters && (
        <Button 
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={onClearFilters}
        >
          <FilterX className="h-4 w-4" />
          <span className="hidden sm:inline">Clear</span>
        </Button>
      )}
      
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white">
          <DropdownMenuLabel>Quick Filters</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel className="text-xs text-gray-500">Status</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={activeFilters.status.includes("Visited")}
            onSelect={() => handleFilterSelect("status", "Visited")}
          >
            Visited
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={activeFilters.status.includes("Interested")}
            onSelect={() => handleFilterSelect("status", "Interested")}
          >
            Interested
          </DropdownMenuCheckboxItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-gray-500">Rating</DropdownMenuLabel>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center">
              <span>By Star Rating</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-white">
                <DropdownMenuCheckboxItem
                  checked={activeFilters.rating.includes(5)}
                  onSelect={() => handleFilterSelect("rating", "5")}
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
                  checked={activeFilters.rating.includes(4)}
                  onSelect={() => handleFilterSelect("rating", "4")}
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
                  checked={activeFilters.rating.includes(3)}
                  onSelect={() => handleFilterSelect("rating", "3")}
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
                  checked={activeFilters.rating.includes(2)}
                  onSelect={() => handleFilterSelect("rating", "2")}
                  className="flex items-center"
                >
                  <div className="flex items-center">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="ml-2">2 Stars Only</span>
                  </div>
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuCheckboxItem
                  checked={activeFilters.rating.includes(1)}
                  onSelect={() => handleFilterSelect("rating", "1")}
                  className="flex items-center"
                >
                  <div className="flex items-center">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="ml-2">1 Star Only</span>
                  </div>
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuCheckboxItem
                  checked={activeFilters.rating.some(r => r >= 4)}
                  onSelect={() => handleFilterSelect("rating", "4+")}
                  className="flex items-center"
                >
                  4+ Stars
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={activeFilters.rating.some(r => r >= 3)}
                  onSelect={() => handleFilterSelect("rating", "3+")}
                  className="flex items-center"
                >
                  3+ Stars
                </DropdownMenuCheckboxItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => onOpenFilters()}>
            <span className="flex items-center justify-between w-full">
              Advanced Filters
              <Filter className="h-4 w-4" />
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default BitesFilter;

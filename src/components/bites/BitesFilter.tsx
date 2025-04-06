
import React, { useState } from "react";
import { FilterX, Filter, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
          <DropdownMenuCheckboxItem
            checked={activeFilters.rating.includes(5)}
            onSelect={() => handleFilterSelect("rating", "5")}
          >
            5 Stars
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={activeFilters.rating.includes(4)}
            onSelect={() => handleFilterSelect("rating", "4")}
          >
            4+ Stars
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={activeFilters.rating.includes(3)}
            onSelect={() => handleFilterSelect("rating", "3")}
          >
            3+ Stars
          </DropdownMenuCheckboxItem>
          
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

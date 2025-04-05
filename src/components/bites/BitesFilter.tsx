
import React from "react";
import { FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BitesFilterProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onOpenFilters: () => void;
}

const BitesFilter = ({ hasActiveFilters, onClearFilters, onOpenFilters }: BitesFilterProps) => {
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
      <Button 
        size="sm"
        variant="outline"
        className="flex items-center gap-1"
        onClick={onOpenFilters}
      >
        <FilterX className="h-4 w-4" />
        <span className="hidden sm:inline">Filter</span>
      </Button>
    </>
  );
};

export default BitesFilter;

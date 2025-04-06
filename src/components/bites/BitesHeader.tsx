
import React from "react";
import { Utensils } from "lucide-react";
import BitesFilter from "./BitesFilter";

interface BitesHeaderProps {
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

interface BitesHeaderResult {
  title: string;
  icon: React.ReactNode;
  headerContent: React.ReactNode;
}

const BitesHeader = ({
  hasActiveFilters,
  onClearFilters,
  onOpenFilters,
  onFilterChange,
  activeFilters
}: BitesHeaderProps): BitesHeaderResult => {
  return {
    title: "Bites",
    icon: <Utensils className="h-6 w-6 text-teal-700" />,
    headerContent: (
      <div className="flex gap-2">
        <BitesFilter 
          hasActiveFilters={hasActiveFilters} 
          onClearFilters={onClearFilters} 
          onOpenFilters={onOpenFilters} 
          onFilterChange={onFilterChange}
          activeFilters={activeFilters}
        />
      </div>
    ),
  };
};

export default BitesHeader;

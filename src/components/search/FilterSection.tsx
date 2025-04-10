
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import FilterTabs from "./FilterTabs";

interface FilterSectionProps {
  isFiltersOpen: boolean;
  setIsFiltersOpen: (isOpen: boolean) => void;
  activeFilter: string;
  handleTabChange: (value: string) => void;
  filterDescriptions: Record<string, string>;
  type?: 'food' | 'entertainment';
}

const FilterSection: React.FC<FilterSectionProps> = ({
  isFiltersOpen,
  setIsFiltersOpen,
  activeFilter,
  handleTabChange,
  filterDescriptions,
  type = 'food'
}) => {
  return (
    <div className="mb-4 mt-4 border-t border-[#8B7D6B]/20 pt-4">
      <Collapsible
        open={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
        className="w-full"
      >
        <div className="flex items-center justify-between">
          <h4 
            className="text-lg font-medium text-vintage-red font-typewriter hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            QUICK FILTERS
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-7 w-7 ml-2">
              <ChevronDown 
                className={`h-4 w-4 transition-transform duration-200 ${isFiltersOpen ? 'rotate-180' : ''}`} 
              />
              <span className="sr-only">Toggle filters</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <FilterTabs 
            activeFilter={activeFilter}
            handleTabChange={handleTabChange}
            filterDescriptions={filterDescriptions}
            type={type}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FilterSection;

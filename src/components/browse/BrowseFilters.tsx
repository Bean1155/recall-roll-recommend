
import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FoodEntertainmentToggle } from "@/components/browse/TypeToggle";

interface BrowseFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeType: 'food' | 'entertainment';
  onTypeChange: (type: 'food' | 'entertainment') => void;
  onSearch: (e: React.FormEvent) => void;
}

const BrowseFilters: React.FC<BrowseFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  activeType,
  onTypeChange,
  onSearch,
}) => {
  return (
    <>
      <div className="px-4 py-4 pb-6">
        <form onSubmit={onSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by Keywords"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-white border-gray-300"
          />
          <Button type="submit" variant="default" className="bg-catalog-teal hover:bg-catalog-darkTeal text-white">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>
      
      <div className="px-4 mb-6 flex justify-center">
        <FoodEntertainmentToggle currentType={activeType} onTypeChange={onTypeChange} />
      </div>
    </>
  );
};

export default BrowseFilters;

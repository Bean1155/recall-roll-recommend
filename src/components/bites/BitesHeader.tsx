
import React from "react";
import { Utensils, Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CatalogSearch from "@/components/CatalogSearch";

interface BitesHeaderProps {
  onClearFilters: () => void;
  cards: any[];
  onFilteredItemsChange: (filteredItems: any[]) => void;
}

interface BitesHeaderResult {
  title: string;
  icon: React.ReactNode;
  headerContent: React.ReactNode;
}

const BitesHeader = ({
  onClearFilters,
  cards,
  onFilteredItemsChange
}: BitesHeaderProps): BitesHeaderResult => {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return {
    title: "Bites",
    icon: <Utensils className="h-6 w-6 text-teal-700" />,
    headerContent: (
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsSearchOpen(true)} 
          className="flex items-center gap-1"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 bg-teal-700 text-white hover:bg-teal-800"
          asChild
        >
          <Link to="/create/food">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </Link>
        </Button>

        {isSearchOpen && (
          <CatalogSearch 
            items={cards}
            onFilteredItemsChange={onFilteredItemsChange}
            type="food"
            onClose={() => setIsSearchOpen(false)}
          />
        )}
      </div>
    ),
  };
};

export default BitesHeader;

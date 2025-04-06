
import React from "react";
import { Utensils, Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CatalogSearch from "@/components/CatalogSearch";
import BitesFilter from "./BitesFilter";
import { FoodCard } from "@/lib/types";

interface BitesHeaderProps {
  onClearFilters: () => void;
  cards: FoodCard[];
  onFilteredItemsChange: (filteredItems: any[]) => void;
  onCardClick?: (card: FoodCard) => void;
  hasActiveFilters?: boolean;
}

const BitesHeader = ({
  onClearFilters,
  cards,
  onFilteredItemsChange,
  onCardClick,
  hasActiveFilters = false
}: BitesHeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const handleFilterChange = (filterType: string, value: string) => {
    // Filter the cards based on the selected filter
    let filteredItems: FoodCard[] = [];
    
    if (filterType === "status") {
      filteredItems = cards.filter(card => card.status === value);
    } else if (filterType === "rating") {
      if (value.includes("+")) {
        const minRating = parseInt(value);
        filteredItems = cards.filter(card => 
          card.rating && card.rating >= minRating
        );
      } else {
        const exactRating = parseInt(value);
        filteredItems = cards.filter(card => 
          card.rating && card.rating === exactRating
        );
      }
    } else if (filterType === "tags") {
      filteredItems = cards.filter(card => 
        card.tags && card.tags.includes(value)
      );
    }
    
    onFilteredItemsChange(filteredItems);
  };

  return (
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
      
      <BitesFilter 
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        onOpenFilters={() => {}}
        onFilterChange={handleFilterChange}
        allCards={cards}
        onCardClick={onCardClick}
      />
      
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
  );
};

export default BitesHeader;

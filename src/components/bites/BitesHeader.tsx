
import React, { useState } from "react";
import { Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CatalogSearch from "@/components/CatalogSearch";
import BitesFilter from "./BitesFilter";
import { FoodCard } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerOverlay } from "@/components/ui/drawer";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();

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
    } else if (filterType === "location") {
      filteredItems = cards.filter(card => 
        card.location === value
      );
    }
    
    console.log(`BitesHeader: Filter applied ${filterType}=${value}, found ${filteredItems.length} results`);
    onFilteredItemsChange(filteredItems);
  };

  const handleCardClickFromFilter = (card: FoodCard) => {
    if (onCardClick) {
      console.log('BitesHeader: Card clicked from filter dropdown:', card.title);
      onCardClick(card);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsSearchOpen(true)} 
        className={`flex items-center gap-1 ${isMobile ? 'flex-1 justify-center' : ''}`}
      >
        <Search className="h-4 w-4" />
        <span className={isMobile ? 'inline' : 'hidden sm:inline'}>
          {isMobile ? 'Search & Filter' : 'Search'}
        </span>
      </Button>
      
      {/* Only show the filter button on desktop */}
      {!isMobile && (
        <BitesFilter 
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
          onOpenFilters={() => {}}
          onFilterChange={handleFilterChange}
          allCards={cards}
          onCardClick={handleCardClickFromFilter}
        />
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        className={`flex items-center gap-1 bg-teal-700 text-white hover:bg-teal-800 ${isMobile ? 'flex-1 justify-center' : ''}`}
        asChild
      >
        <Link to="/create/food">
          <PlusCircle className="h-4 w-4" />
          <span className={isMobile ? 'inline' : 'hidden sm:inline'}>Add</span>
        </Link>
      </Button>

      {isSearchOpen && (
        isMobile ? (
          <Drawer
            open={isSearchOpen}
            onOpenChange={setIsSearchOpen}
          >
            <DrawerContent className="p-0 border border-gray-200 bg-[#FAF3E3] rounded-t-xl overflow-hidden max-h-[280px]">
              <div className="overflow-y-auto pb-0">
                <CatalogSearch 
                  items={cards}
                  onFilteredItemsChange={onFilteredItemsChange}
                  type="food"
                  onClose={() => setIsSearchOpen(false)}
                  compact={true}
                />
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogOverlay className="bg-black/70 backdrop-blur-sm" />
            <DialogContent 
              className="p-0 border-0 shadow-none bg-transparent"
              style={{ maxWidth: "90vw", width: "550px" }}
            >
              <CatalogSearch 
                items={cards}
                onFilteredItemsChange={onFilteredItemsChange}
                type="food"
                onClose={() => setIsSearchOpen(false)}
                compact={true}
              />
            </DialogContent>
          </Dialog>
        )
      )}
    </div>
  );
};

export default BitesHeader;

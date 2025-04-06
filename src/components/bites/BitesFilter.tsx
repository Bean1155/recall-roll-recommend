import React, { useState, useEffect } from "react";
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
import { FoodCard } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

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
  allCards?: FoodCard[];
  onCardClick?: (card: FoodCard) => void;
}

const BitesFilter = ({ 
  hasActiveFilters, 
  onClearFilters, 
  onOpenFilters,
  onFilterChange,
  activeFilters = { status: [], rating: [], tags: [] },
  allCards = [],
  onCardClick
}: BitesFilterProps) => {
  const [open, setOpen] = useState(false);
  const [filteredCards, setFilteredCards] = useState<FoodCard[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<{ type: string, value: string } | null>(null);
  const [showFilteredCards, setShowFilteredCards] = useState(false);
  
  useEffect(() => {
    if (selectedFilter && allCards.length > 0) {
      let filtered: FoodCard[] = [];
      
      if (selectedFilter.type === "status") {
        filtered = allCards.filter(card => 
          card.status === selectedFilter.value
        );
      } else if (selectedFilter.type === "rating") {
        const ratingValue = parseInt(selectedFilter.value);
        if (selectedFilter.value.includes("+")) {
          // For 3+ or 4+ ratings
          const minRating = parseInt(selectedFilter.value);
          filtered = allCards.filter(card => 
            card.rating && card.rating >= minRating
          );
        } else {
          // For exact rating match
          filtered = allCards.filter(card => 
            card.rating && card.rating === ratingValue
          );
        }
      } else if (selectedFilter.type === "tags") {
        filtered = allCards.filter(card => 
          card.tags && card.tags.includes(selectedFilter.value)
        );
      }
      
      setFilteredCards(filtered);
      if (filtered.length > 0) {
        setShowFilteredCards(true);
      }
    }
  }, [selectedFilter, allCards]);
  
  const handleFilterSelect = (filterType: string, value: string) => {
    setSelectedFilter({ type: filterType, value });
    
    if (onFilterChange) {
      onFilterChange(filterType, value);
    }
    
    // Keep the dropdown open to show results
    if (allCards.length > 0) {
      // Don't close dropdown if we want to show filtered cards
    } else {
      setOpen(false);
    }
  };

  const handleCardSelect = (card: FoodCard) => {
    if (onCardClick) {
      onCardClick(card);
      setOpen(false);
      setShowFilteredCards(false);
    }
  };
  
  const closeFilteredCards = () => {
    setShowFilteredCards(false);
    setSelectedFilter(null);
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
      
      <DropdownMenu open={open} onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setShowFilteredCards(false);
        }
      }}>
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
        <DropdownMenuContent className="w-64 bg-white z-50">
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
              <DropdownMenuSubContent 
                className="w-56 bg-white z-50" 
                sideOffset={2} 
                alignOffset={-5}
                style={{ backgroundColor: "white" }}
              >
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

          {showFilteredCards && filteredCards.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Results ({filteredCards.length})</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 p-1" 
                  onClick={closeFilteredCards}
                >
                  <FilterX className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuLabel>
              <div className="max-h-64 overflow-y-auto pb-2">
                {filteredCards.slice(0, 6).map((card) => (
                  <Card 
                    key={card.id} 
                    className="mx-2 my-1.5 cursor-pointer hover:bg-gray-50" 
                    onClick={() => handleCardSelect(card)}
                  >
                    <CardContent className="p-2 text-xs">
                      <div className="font-medium truncate">{card.title}</div>
                      <div className="text-gray-500 truncate">{card.description?.substring(0, 50)}</div>
                      {card.rating && (
                        <div className="flex mt-1">
                          {Array.from({ length: card.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {filteredCards.length > 6 && (
                  <div className="text-center text-xs text-gray-500 mt-1">
                    + {filteredCards.length - 6} more results
                  </div>
                )}
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default BitesFilter;

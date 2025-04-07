import React, { useState } from "react";
import { FilterX, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FoodCard } from "@/lib/types";
import StatusFilters from "./StatusFilters";
import RatingFilters from "./RatingFilters";
import LocationFilters from "./LocationFilters";
import FilteredCardsList from "./FilteredCardsList";
import { useFilteredCards, ProximitySearch } from "@/hooks/useFilteredCards";
import { useNavigate } from "react-router-dom";

interface BitesFilterProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onOpenFilters: () => void;
  onFilterChange?: (filterType: string, value: string) => void;
  activeFilters?: {
    status: string[];
    rating: number[];
    tags: string[];
    location: string[];
  };
  allCards?: FoodCard[];
  onCardClick?: (card: FoodCard) => void;
}

const BitesFilter = ({ 
  hasActiveFilters, 
  onClearFilters, 
  onOpenFilters,
  onFilterChange,
  activeFilters = { status: [], rating: [], tags: [], location: [] },
  allCards = [],
  onCardClick
}: BitesFilterProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const {
    filteredCards,
    showFilteredCards,
    uniqueLocations,
    handleFilterSelect,
    handleProximitySearch,
    closeFilteredCards,
    setShowFilteredCards,
    proximitySearch,
    selectedFilter
  } = useFilteredCards(allCards);
  
  const handleFilterSelect_ = (filterType: string, value: string) => {
    handleFilterSelect(filterType, value);
    
    if (onFilterChange) {
      onFilterChange(filterType, value);
    }
    
    // Always keep the dropdown open to show results
    setOpen(true);
    setShowFilteredCards(true);

    // If we have enough results, navigate to a filtered list view
    if (filteredCards.length > 4) {
      setOpen(false);
      const filterParams = `${filterType}=${encodeURIComponent(value)}`;
      navigate(`/bites?filter=${filterParams}`);
    }
  };

  const handleProximitySearch_ = (options: ProximitySearch) => {
    handleProximitySearch(options);
    
    // Always keep the dropdown open to show results
    setOpen(true);
    setShowFilteredCards(true);

    // Add a slight delay to allow filteredCards to update
    setTimeout(() => {
      // Only navigate if we have sufficient results
      if (filteredCards.length > 4) {
        setOpen(false);
        navigate(`/bites?proximity=${options.location}&distance=${options.distance}`);
      }
    }, 100);
  };

  const handleCardSelect = (card: FoodCard) => {
    if (onCardClick) {
      onCardClick(card);
      setOpen(false);
      setShowFilteredCards(false);
    }
  };
  
  const handleShowAllResults = () => {
    setOpen(false);
    
    if (selectedFilter) {
      const filterParams = `${selectedFilter.type}=${encodeURIComponent(selectedFilter.value)}`;
      navigate(`/bites?filter=${filterParams}`);
    } else if (proximitySearch) {
      navigate(`/bites?proximity=${proximitySearch.location}&distance=${proximitySearch.distance}`);
    }
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
        if (!o && !filteredCards.length) {
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
        <DropdownMenuContent className="w-64" style={{ backgroundColor: "white", zIndex: 50 }}>
          <DropdownMenuLabel>Quick Filters</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <StatusFilters
            activeStatuses={activeFilters.status}
            onSelect={handleFilterSelect_}
          />
          
          <RatingFilters
            activeRatings={activeFilters.rating}
            onSelect={handleFilterSelect_}
          />
          
          <LocationFilters
            activeLocations={activeFilters.location}
            uniqueLocations={uniqueLocations}
            onSelect={handleFilterSelect_}
            onProximitySearch={handleProximitySearch_}
          />

          <DropdownMenuItem onSelect={() => onOpenFilters()}>
            <span className="flex items-center justify-between w-full">
              Advanced Filters
              <Filter className="h-4 w-4" />
            </span>
          </DropdownMenuItem>

          <FilteredCardsList
            showFilteredCards={showFilteredCards}
            filteredCards={filteredCards}
            onCardSelect={handleCardSelect}
            onClose={closeFilteredCards}
            proximitySearch={proximitySearch}
            onShowAll={handleShowAllResults}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default BitesFilter;

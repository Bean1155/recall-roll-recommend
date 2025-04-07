
import { useState, useEffect } from "react";
import { FoodCard } from "@/lib/types";

export interface FilterState {
  status: string[];
  rating: number[];
  tags: string[];
  location: string[];
}

export interface FilteredSelection {
  type: string;
  value: string;
}

export const useFilteredCards = (allCards: FoodCard[] = []) => {
  const [selectedFilter, setSelectedFilter] = useState<FilteredSelection | null>(null);
  const [filteredCards, setFilteredCards] = useState<FoodCard[]>([]);
  const [showFilteredCards, setShowFilteredCards] = useState(false);
  const [uniqueLocations, setUniqueLocations] = useState<string[]>([]);
  
  // Extract unique locations from cards
  useEffect(() => {
    if (allCards.length > 0) {
      const locations = Array.from(new Set(
        allCards
          .filter(card => card.location && card.location.trim() !== '')
          .map(card => card.location)
      )).sort();
      
      setUniqueLocations(locations);
    }
  }, [allCards]);
  
  // Apply filter when selectedFilter changes
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
      } else if (selectedFilter.type === "location") {
        filtered = allCards.filter(card => 
          card.location === selectedFilter.value
        );
      }
      
      setFilteredCards(filtered);
      if (filtered.length > 0) {
        setShowFilteredCards(true);
      }
      
      // Log the number of filtered results for debugging
      console.log(`Filter applied: ${selectedFilter.type}="${selectedFilter.value}", found ${filtered.length} results`);
    }
  }, [selectedFilter, allCards]);

  const handleFilterSelect = (filterType: string, value: string) => {
    setSelectedFilter({ type: filterType, value });
    setShowFilteredCards(true);
  };
  
  const closeFilteredCards = () => {
    setShowFilteredCards(false);
    setSelectedFilter(null);
  };
  
  return {
    filteredCards,
    selectedFilter,
    showFilteredCards,
    uniqueLocations,
    handleFilterSelect,
    closeFilteredCards,
    setShowFilteredCards
  };
};

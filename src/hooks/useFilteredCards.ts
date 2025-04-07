
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

export interface ProximitySearch {
  location: string;
  distance: number;
}

export const useFilteredCards = (allCards: FoodCard[] = []) => {
  const [selectedFilter, setSelectedFilter] = useState<FilteredSelection | null>(null);
  const [filteredCards, setFilteredCards] = useState<FoodCard[]>([]);
  const [showFilteredCards, setShowFilteredCards] = useState(false);
  const [uniqueLocations, setUniqueLocations] = useState<string[]>([]);
  const [proximitySearch, setProximitySearch] = useState<ProximitySearch | null>(null);
  
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
  
  // Calculate distance between two points using Haversine formula
  const calculateDistance = (location1: string, location2: string): number => {
    // In a real application, this would use geocoding to convert locations to coordinates
    // and then calculate the actual distance
    
    // For demo purposes, we're just doing a simple string comparison
    // If locations match exactly, distance is 0, otherwise random distance between 1-20 miles
    if (location1.toLowerCase() === location2.toLowerCase()) {
      return 0;
    }
    
    // Generate consistent but pseudo-random distance based on the two location strings
    const stringToNum = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash);
    };
    
    const combinedHash = stringToNum(location1 + location2);
    return (combinedHash % 20) + 1; // Distance between 1-20 miles
  };
  
  // Apply filter when selectedFilter changes
  useEffect(() => {
    if (allCards.length === 0) return;
    
    let filtered: FoodCard[] = [...allCards];
    
    if (selectedFilter) {
      if (selectedFilter.type === "status") {
        filtered = filtered.filter(card => 
          card.status === selectedFilter.value
        );
      } else if (selectedFilter.type === "rating") {
        const ratingValue = parseInt(selectedFilter.value);
        if (selectedFilter.value.includes("+")) {
          // For 3+ or 4+ ratings
          const minRating = parseInt(selectedFilter.value);
          filtered = filtered.filter(card => 
            card.rating && card.rating >= minRating
          );
        } else {
          // For exact rating match
          filtered = filtered.filter(card => 
            card.rating && card.rating === ratingValue
          );
        }
      } else if (selectedFilter.type === "tags") {
        filtered = filtered.filter(card => 
          card.tags && card.tags.includes(selectedFilter.value)
        );
      } else if (selectedFilter.type === "location") {
        filtered = filtered.filter(card => 
          card.location === selectedFilter.value
        );
      }
    }
    
    // Apply proximity search if active
    if (proximitySearch && proximitySearch.location) {
      filtered = filtered.filter(card => {
        if (!card.location) return false;
        
        const distance = calculateDistance(proximitySearch.location, card.location);
        return distance <= proximitySearch.distance;
      });
    }
    
    setFilteredCards(filtered);
    if (filtered.length > 0) {
      setShowFilteredCards(true);
    }
    
    // Log the number of filtered results for debugging
    if (selectedFilter) {
      console.log(`Filter applied: ${selectedFilter.type}="${selectedFilter.value}", found ${filtered.length} results`);
    }
    
    if (proximitySearch) {
      console.log(`Proximity search: ${proximitySearch.distance} miles from ${proximitySearch.location}, found ${filtered.length} results`);
    }
  }, [selectedFilter, proximitySearch, allCards]);

  const handleFilterSelect = (filterType: string, value: string) => {
    setSelectedFilter({ type: filterType, value });
    setShowFilteredCards(true);
  };
  
  const handleProximitySearch = (options: ProximitySearch) => {
    setProximitySearch(options);
    setShowFilteredCards(true);
  };
  
  const closeFilteredCards = () => {
    setShowFilteredCards(false);
    setSelectedFilter(null);
    setProximitySearch(null);
  };
  
  return {
    filteredCards,
    selectedFilter,
    showFilteredCards,
    proximitySearch,
    uniqueLocations,
    handleFilterSelect,
    handleProximitySearch,
    closeFilteredCards,
    setShowFilteredCards
  };
};

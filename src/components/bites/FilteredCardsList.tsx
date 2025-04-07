
import React from "react";
import { FoodCard } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, FilterX, Navigation, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ProximitySearch } from "@/hooks/useFilteredCards";

interface FilteredCardsListProps {
  showFilteredCards: boolean;
  filteredCards: FoodCard[];
  onCardSelect: (card: FoodCard) => void;
  onClose: () => void;
  proximitySearch?: ProximitySearch | null;
  onShowAll?: () => void;
}

const FilteredCardsList = ({
  showFilteredCards,
  filteredCards,
  onCardSelect,
  onClose,
  proximitySearch,
  onShowAll
}: FilteredCardsListProps) => {
  if (!showFilteredCards || filteredCards.length === 0) {
    return null;
  }

  // Calculate distance between two points (simplified approach matching the hook)
  const calculateApproxDistance = (location1: string, location2: string): number => {
    // In a real app, this would use actual geocoding and proper distance calculation
    // Here we use a simplified version to get consistent results matching the hook
    
    // Generate consistent but pseudo-random distance based on string inputs
    const stringToNum = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash);
    };
    
    if (location1.toLowerCase() === location2.toLowerCase()) {
      return 0;
    }
    
    const combinedHash = stringToNum(location1 + location2);
    return ((combinedHash % 200) / 10) + 0.1; // Distance between 0.1-20 miles with one decimal
  };

  // Display limited number of cards in dropdown
  const displayCards = filteredCards.slice(0, 5);
  const hasMoreCards = filteredCards.length > displayCards.length;

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuLabel className="flex justify-between items-center">
        <span>Results ({filteredCards.length})</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 p-1" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
        >
          <FilterX className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuLabel>
      
      <ScrollArea className="max-h-64 w-full">
        <div className="p-2">
          {displayCards.map((card) => (
            <Card 
              key={card.id} 
              className="mb-2 cursor-pointer hover:bg-gray-50 border border-gray-200" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("FilteredCardsList: Card clicked:", card.id, card.title);
                console.log("FilteredCardsList: Card data:", JSON.stringify(card));
                onCardSelect(card);
              }}
            >
              <CardContent className="p-3 text-sm">
                <div className="font-medium">{card.title}</div>
                {card.location && (
                  <div className="flex mt-1 text-gray-500 text-xs items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {card.location}
                    </div>
                    
                    {proximitySearch && proximitySearch.location && card.location && (
                      <div className="flex items-center text-xs text-teal-600">
                        <Navigation className="h-3 w-3 mr-1" />
                        {calculateApproxDistance(proximitySearch.location, card.location).toFixed(1)} mi
                      </div>
                    )}
                  </div>
                )}
                {card.rating && (
                  <div className="flex mt-1">
                    {Array.from({ length: card.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                )}
                {card.notes && (
                  <div className="text-gray-500 text-xs mt-1 line-clamp-2">{card.notes}</div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {hasMoreCards && onShowAll && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2 flex items-center justify-between"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onShowAll();
              }}
            >
              <span>View all {filteredCards.length} results</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </ScrollArea>
    </>
  );
};

export default FilteredCardsList;

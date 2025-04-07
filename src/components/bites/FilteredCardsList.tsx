
import React from "react";
import { FoodCard } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

interface FilteredCardsListProps {
  showFilteredCards: boolean;
  filteredCards: FoodCard[];
  onCardSelect: (card: FoodCard) => void;
  onClose: () => void;
}

const FilteredCardsList = ({
  showFilteredCards,
  filteredCards,
  onCardSelect,
  onClose
}: FilteredCardsListProps) => {
  if (!showFilteredCards || filteredCards.length === 0) {
    return null;
  }

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
          {filteredCards.map((card) => (
            <Card 
              key={card.id} 
              className="mb-2 cursor-pointer hover:bg-gray-50 border border-gray-200" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCardSelect(card);
              }}
            >
              <CardContent className="p-3 text-sm">
                <div className="font-medium">{card.title}</div>
                {card.location && (
                  <div className="flex mt-1 text-gray-500 text-xs items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {card.location}
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
        </div>
      </ScrollArea>
    </>
  );
};

export default FilteredCardsList;

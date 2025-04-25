
import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CatalogCardCompact from "@/components/CatalogCardCompact";
import { CatalogCard } from "@/lib/types";

interface BrowseResultsProps {
  showAllCards: boolean;
  filteredCards: CatalogCard[];
  selectedSubcategory: string | null;
  onCloseAllCards: () => void;
  onCardClick: (card: CatalogCard) => void;
  activeType: 'food' | 'entertainment';
}

const BrowseResults: React.FC<BrowseResultsProps> = ({
  showAllCards,
  filteredCards,
  selectedSubcategory,
  onCloseAllCards,
  onCardClick,
  activeType,
}) => {
  if (!showAllCards || filteredCards.length === 0) {
    return null;
  }

  return (
    <div className="px-4 pb-20">
      <div className="bg-gray-50 border rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-700">
            {selectedSubcategory} ({filteredCards.length} items)
          </h3>
          <Button variant="ghost" size="sm" onClick={onCloseAllCards} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredCards.map(card => (
            <div 
              key={card.id} 
              className="cursor-pointer"
              onClick={() => onCardClick(card)}
            >
              <div className="letterboxd-style-card">
                <CatalogCardCompact card={card} compact={true} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowseResults;


import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CatalogCard } from "@/lib/types";

interface SearchResultsProps {
  searchResults: CatalogCard[];
  searchTerm: string;
  handleCardClick: (card: CatalogCard) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
  searchTerm,
  handleCardClick
}) => {
  if (searchResults.length === 0 || !searchTerm) {
    return null;
  }

  return (
    <div className="mt-6 border-t border-[#8B7D6B]/40 pt-4">
      <h4 className="text-lg font-medium text-vintage-red mb-3 font-typewriter">SEARCH PREVIEW</h4>
      <div className="space-y-2 overflow-y-auto">
        {searchResults.slice(0, 3).map((item) => (
          <Card 
            key={item.id} 
            className="bg-catalog-cream hover:bg-vintage-tan cursor-pointer border border-catalog-softBrown/40 transition-colors duration-150"
            onClick={() => {
              console.log("SearchResults: Card clicked with ID:", item.id);
              console.log("SearchResults: Card data:", JSON.stringify(item));
              handleCardClick(item);
            }}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <h5 className="font-medium font-typewriter">{item.title}</h5>
                  <p className="text-xs text-[#5d4037] font-typewriter">{item.creator}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-amber-500">{"★".repeat(item.rating || 0)}</span>
                  <span className="text-gray-300">{"★".repeat(5 - (item.rating || 0))}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;

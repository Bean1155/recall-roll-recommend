
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Globe } from "lucide-react";
import { performWebSearch, simulateWebSearch } from "@/utils/webSearch";
import SearchResultsDialog from "@/components/bites/SearchResultsDialog";
import { FoodCard, EntertainmentCard } from "@/lib/types";

interface WebSearchAutofillProps {
  type: 'food' | 'entertainment';
  onResultSelect: (result: FoodCard | EntertainmentCard) => void;
  className?: string;
}

const WebSearchAutofill = ({ type, onResultSelect, className }: WebSearchAutofillProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<(FoodCard | EntertainmentCard)[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Categories for styling (consistent with existing app)
  const categoryColors = {
    restaurant: "bg-orange-100",
    cafe: "bg-yellow-100",
    bakery: "bg-amber-100",
    bar: "bg-red-100",
    "food truck": "bg-green-100",
    movies: "bg-blue-100",
    "tv shows": "bg-indigo-100",
    books: "bg-purple-100",
    games: "bg-pink-100",
    podcasts: "bg-violet-100",
  };

  const handleSearch = async () => {
    if (query.length < 2) return;
    
    setIsLoading(true);
    setDialogOpen(true);
    
    try {
      // Search for multiple results using DuckDuckGo API
      const searchResults = await performWebSearch(query, type);
      console.log(`Web search returned ${searchResults.length} results:`, searchResults);
      setResults(searchResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
      // Fallback to simulated search if API fails
      try {
        const fallbackResults = await simulateWebSearch(query, type);
        console.log(`Fallback search returned ${fallbackResults.length} results`);
        setResults(fallbackResults);
      } catch (fallbackError) {
        console.error("Even fallback search failed:", fallbackError);
        setResults([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounce search for better UX (wait 500ms after user stops typing)
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    // Only perform auto-search when there's enough input (3+ characters)
    if (value.length >= 3) {
      searchTimeout.current = setTimeout(() => {
        handleSearch();
      }, 500);
    }
  };

  const handleResultSelect = (result: FoodCard | EntertainmentCard) => {
    console.log("Selected result with complete data:", result);
    onResultSelect(result);
    setDialogOpen(false);
    setQuery("");  // Clear the search input
  };

  useEffect(() => {
    // Clean up any pending timeouts when component unmounts
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="flex w-full max-w-full items-center space-x-2 mb-2">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder={`Search online for ${type === 'food' ? 'restaurants' : 'entertainment'}...`}
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyPress}
            className="pl-10"
          />
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <Button 
          onClick={handleSearch} 
          type="button" 
          variant="outline"
          className="px-3"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <SearchResultsDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        results={results}
        categoryColors={categoryColors}
        onCardClick={handleResultSelect}
        isLoading={isLoading}
        searchSource="web"
      />
    </div>
  );
};

export default WebSearchAutofill;

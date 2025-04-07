
import React, { useState, useEffect } from "react";
import { Film, Plus, Search, FilterX } from "lucide-react";
import GridLayout from "@/components/GridLayout";
import { Button } from "@/components/ui/button";
import { EntertainmentCard } from "@/lib/types";
import { getEntertainmentCards } from "@/lib/data";
import { useNavigate, useLocation } from "react-router-dom";
import EntertainmentCardsDisplay from "@/components/blockbusters/EntertainmentCardsDisplay";
import EntertainmentCategoryDrawer from "@/components/blockbusters/EntertainmentCategoryDrawer";

const BlockbustersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cards, setCards] = useState<EntertainmentCard[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [] as string[],
    rating: [] as number[],
    tags: [] as string[]
  });
  
  useEffect(() => {
    const entertainmentCards = getEntertainmentCards();
    setCards(entertainmentCards);
    
    // Check for browse parameters in the URL
    const params = new URLSearchParams(location.search);
    const browseCategory = params.get('browse');
    const subcategory = params.get('subcategory');
    const highlightedCardId = params.get('highlight');
    
    if (highlightedCardId) {
      // Scroll to the highlighted card if needed
      setTimeout(() => {
        const element = document.getElementById(`card-${highlightedCardId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-4', 'ring-blue-400', 'ring-opacity-75');
          setTimeout(() => {
            element.classList.remove('ring-4', 'ring-blue-400', 'ring-opacity-75');
          }, 2000);
        }
      }, 500);
    }
  }, [location]);
  
  useEffect(() => {
    const fetchCards = () => {
      const entertainmentCards = getEntertainmentCards();
      setCards(entertainmentCards);
    };
    
    fetchCards();
    
    const handleCardAdded = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.action === 'card_added' && customEvent.detail?.cardType === 'entertainment') {
        fetchCards();
      }
    };
    
    window.addEventListener('catalog_action', handleCardAdded);
    
    return () => {
      window.removeEventListener('catalog_action', handleCardAdded);
    };
  }, []);
  
  const applyFilters = (filterConfig: typeof filters) => {
    setFilters(filterConfig);
    setIsFiltersOpen(false);
  };
  
  const clearFilters = () => {
    setFilters({
      status: [],
      rating: [],
      tags: []
    });
  };
  
  const hasActiveFilters = () => {
    return filters.status.length > 0 || filters.rating.length > 0 || filters.tags.length > 0;
  };
  
  const handleCardClick = (card: EntertainmentCard) => {
    navigate(`/edit/${card.id}`);
  };
  
  const categoryColors: Record<string, string> = {
    "books": "#E6F3F3",      // Light blue-green
    "comedies": "#FFE8CC",   // Light orange
    "events": "#FCF0D3",     // Light yellow
    "games": "#E2D8F3",      // Light purple
    "live performances": "#D3F4E6", // Light green
    "movies": "#FDE1D3",     // Light pink
    "podcasts": "#F9E8FF",   // Light lavender
    "tv shows": "#FFE5EC",   // Light pink
    "etc.": "#F5F5F5",       // Light gray
  };
  
  // Check for custom categories and add colors if needed
  const categories = [...new Set(cards.map(card => card.entertainmentCategory.toLowerCase()))];
  categories.forEach(category => {
    if (!categoryColors[category]) {
      categoryColors[category] = "#F5F5F5"; // Default light gray for custom categories
    }
  });
  
  return (
    <GridLayout 
      title="Blockbusters" 
      icon={<Film className="h-5 w-5" />}
      headerContent={
        <div className="flex space-x-2">
          {hasActiveFilters() && (
            <Button 
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={clearFilters}
            >
              <FilterX className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}
          <Button 
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => navigate('/search?type=entertainment')}
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </Button>
          <Button 
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => navigate('/browse?type=entertainment')}
          >
            <Film className="h-4 w-4" />
            <span className="hidden sm:inline">Browse</span>
          </Button>
          <Button 
            size="sm"
            variant="default"
            className="flex items-center gap-1"
            onClick={() => navigate('/create/entertainment')}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Blockbuster</span>
          </Button>
        </div>
      }
    >
      <div className="w-full">
        <EntertainmentCardsDisplay 
          cards={cards} 
          onCardClick={handleCardClick} 
          filters={filters}
          categoryColors={categoryColors}
          onOpenFilters={() => setIsFiltersOpen(true)}
        />
      </div>
      
      <EntertainmentCategoryDrawer 
        isOpen={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
        cards={cards}
        onApplyFilters={applyFilters}
        currentFilters={filters}
      />
    </GridLayout>
  );
};

export default BlockbustersPage;


import React, { useState, useEffect } from "react";
import { Film, Plus, Search } from "lucide-react";
import GridLayout from "@/components/GridLayout";
import { EntertainmentCard } from "@/lib/types";
import { getEntertainmentCards } from "@/lib/data";
import { useLocation } from "react-router-dom";
import EntertainmentCategoryDrawers from "@/components/blockbusters/EntertainmentCategoryDrawers";
import { useEntertainmentCardDetailHandling } from "@/components/blockbusters/useEntertainmentCardDetailHandling";
import EntertainmentDetailDialog from "@/components/blockbusters/EntertainmentDetailDialog";
import BitesHeader from "@/components/bites/BitesHeader";

const BlockbustersPage = () => {
  const location = useLocation();
  const [cards, setCards] = useState<EntertainmentCard[]>([]);
  const [filters, setFilters] = useState({
    status: [] as string[],
    rating: [] as number[],
    tags: [] as string[]
  });
  
  const {
    selectedCardId,
    isCardDetailOpen,
    setIsCardDetailOpen,
    selectedCard,
    handleCardClick
  } = useEntertainmentCardDetailHandling(cards);
  
  useEffect(() => {
    const entertainmentCards = getEntertainmentCards();
    setCards(entertainmentCards);
    
    // Handle URL parameters like highlight if needed
    const params = new URLSearchParams(location.search);
    const fromSearch = params.get('fromSearch') === 'true';
    
    if (fromSearch) {
      console.log("BlockbustersPage: Detected fromSearch parameter");
      // Could add any special handling for cards coming from search here
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

  // Define category colors for entertainment
  const categoryColors: Record<string, string> = {
    "movies": "#e9b44c",        // Gold/Yellow
    "tv shows": "#a64b2a",      // Rust
    "books": "#9de0d0",         // Mint
    "comedies": "#e18336",      // Orange
    "podcasts": "#e0c5c1",      // Light pink
    "games": "#c1cc99",         // Light green
    "live performances": "#a5b1c2", // Light blue
    "events": "#ddb892",        // Tan
    "etc.": "#F5F5F5",          // Light gray
  };
  
  return (
    <GridLayout 
      title="Blockbusters" 
      icon={<Film className="h-5 w-5" />}
      headerContent={
        <BitesHeader 
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters()}
        />
      }
    >
      <div className="w-full flex justify-center">
        <div className="w-full max-w-md">
          <EntertainmentCategoryDrawers 
            cards={cards}
            categoryColors={categoryColors}
            onCardClick={handleCardClick}
            hideEmptyCategories={false}
            startCollapsed={false}
          />
        </div>
      </div>
      
      {selectedCard && (
        <EntertainmentDetailDialog
          isOpen={isCardDetailOpen}
          setIsOpen={setIsCardDetailOpen}
          card={selectedCard}
        />
      )}
    </GridLayout>
  );
};

export default BlockbustersPage;

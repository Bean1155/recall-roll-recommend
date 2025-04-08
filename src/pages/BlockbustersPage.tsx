
import React, { useState, useEffect } from "react";
import { Film } from "lucide-react";
import GridLayout from "@/components/GridLayout";
import { EntertainmentCard } from "@/lib/types";
import { getEntertainmentCards } from "@/lib/data";
import { useLocation } from "react-router-dom";
import EntertainmentCategoryDrawers from "@/components/blockbusters/EntertainmentCategoryDrawers";
import { useEntertainmentCardDetailHandling } from "@/components/blockbusters/useEntertainmentCardDetailHandling";
import EntertainmentDetailDialog from "@/components/blockbusters/EntertainmentDetailDialog";
import BitesHeader from "@/components/bites/BitesHeader";
import { getDefaultCategoryColors } from "@/utils/categoryUtils";

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
  
  // Track which category is currently open
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  
  useEffect(() => {
    const entertainmentCards = getEntertainmentCards();
    setCards(entertainmentCards);
    
    // Open first category if there are cards and no already open category
    if (entertainmentCards.length > 0 && !openCategory) {
      const firstCategory = entertainmentCards[0]?.entertainmentCategory?.toLowerCase();
      if (firstCategory) {
        console.log(`BlockbustersPage: Opening first category: ${firstCategory}`);
        setOpenCategory(firstCategory);
      }
    }
    
    // Handle URL parameters like highlight if needed
    const params = new URLSearchParams(location.search);
    const fromSearch = params.get('fromSearch') === 'true';
    
    if (fromSearch) {
      console.log("BlockbustersPage: Detected fromSearch parameter");
    }
  }, [location, openCategory]);
  
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

  // Get category colors from utility function
  const categoryColors = getDefaultCategoryColors();
  
  // Handle the drawer open/close state
  const handleCategoryToggle = (category: string, isOpen: boolean) => {
    console.log(`BlockbustersPage: Category ${category} is now ${isOpen ? 'open' : 'closed'}`);
    setOpenCategory(isOpen ? category : null);
  };
  
  return (
    <GridLayout 
      title="Blockbusters" 
      icon={<Film className="h-5 w-5" />}
      headerContent={
        <BitesHeader 
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters()}
          type="entertainment"
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
            openCategory={openCategory}
            onCategoryToggle={handleCategoryToggle}
          />
        </div>
      </div>
      
      {selectedCard && (
        <EntertainmentDetailDialog
          isOpen={isCardDetailOpen}
          onOpenChange={setIsCardDetailOpen}
          card={selectedCard}
          categoryColors={categoryColors}
        />
      )}
    </GridLayout>
  );
};

export default BlockbustersPage;

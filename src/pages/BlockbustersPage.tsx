
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
import { getDefaultCategoryColors, getCategoryDisplayName } from "@/utils/categoryUtils";
import { toast } from "sonner";

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
  
  // This effect loads cards and sets the initial open category
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const entertainmentCards = getEntertainmentCards();
        setCards(entertainmentCards);
        console.log(`BlockbustersPage: Loaded ${entertainmentCards.length} cards`);
        
        // Set first category as open if there are cards and no category is currently open
        if (entertainmentCards.length > 0 && openCategory === null) {
          const categories = [...new Set(entertainmentCards.map(card => 
            card.entertainmentCategory?.toLowerCase() || 'etc.'
          ))];
          
          if (categories.length > 0) {
            const firstCategory = categories[0];
            console.log(`BlockbustersPage: Setting initial open category to "${firstCategory}"`);
            setOpenCategory(firstCategory);
            
            // Debug to see what the display name would be
            const displayName = getCategoryDisplayName(firstCategory);
            console.log(`BlockbustersPage: Display name for "${firstCategory}" is "${displayName}"`);
          }
        }
      } catch (error) {
        console.error("Error fetching entertainment cards:", error);
        toast.error("Failed to load entertainment cards");
      }
    };
    
    fetchCards();
  }, []);
  
  // Listen for changes from other components
  useEffect(() => {
    const fetchCards = () => {
      const entertainmentCards = getEntertainmentCards();
      setCards(entertainmentCards);
    };
    
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
    console.log(`BlockbustersPage: Category "${category}" toggled to ${isOpen ? 'open' : 'closed'}`);
    // When opening a category, close any previously open one
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

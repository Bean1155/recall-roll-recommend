
import React, { useState, useEffect, useRef } from "react";
import { Film } from "lucide-react";
import GridLayout from "@/components/GridLayout";
import { EntertainmentCard } from "@/lib/types";
import { getEntertainmentCards } from "@/lib/data";
import { useLocation, useSearchParams } from "react-router-dom";
import EntertainmentCategoryDrawers from "@/components/blockbusters/EntertainmentCategoryDrawers";
import { useEntertainmentCardDetailHandling } from "@/components/blockbusters/useEntertainmentCardDetailHandling";
import EntertainmentDetailDialog from "@/components/blockbusters/EntertainmentDetailDialog";
import BitesHeader from "@/components/bites/BitesHeader";
import { getDefaultCategoryColors, getCategoryDisplayName, getAllEntertainmentCategories } from "@/utils/categoryUtils";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { addPointsForCardCreation, forceRewardsRefresh } from "@/utils/rewardUtils";
import CatalogSearch from "@/components/CatalogSearch";

const BlockbustersPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [cards, setCards] = useState<EntertainmentCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<EntertainmentCard[]>([]);
  const [filters, setFilters] = useState({
    status: [] as string[],
    rating: [] as number[],
    tags: [] as string[]
  });
  const { currentUser } = useUser();
  
  // Ref to track rerenders and help with debugging
  const renderCountRef = useRef(0);
  
  const {
    selectedCardId,
    isCardDetailOpen,
    setIsCardDetailOpen,
    selectedCard,
    handleCardClick
  } = useEntertainmentCardDetailHandling(cards);
  
  // Track which category is currently open
  const [openCategory, setOpenCategory] = useState<string | null>(categoryParam);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Force component re-render
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // This effect loads cards and sets the initial open category
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const entertainmentCards = getEntertainmentCards();
        setCards(entertainmentCards);
        setFilteredCards(entertainmentCards);
        console.log(`BlockbustersPage: Loaded ${entertainmentCards.length} cards`);
        
        // Handle URL category parameter
        if (categoryParam) {
          console.log(`BlockbustersPage: Category param found in URL: ${categoryParam}`);
          setOpenCategory(categoryParam.toLowerCase());
        }
        // Only set first category as open if we haven't initialized yet and no category param
        else if (!isInitialized && entertainmentCards.length > 0 && !openCategory) {
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
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Error fetching entertainment cards:", error);
        toast.error("Failed to load entertainment cards");
      }
    };
    
    fetchCards();
    
    // Force a refresh of points when the page loads
    if (currentUser) {
      console.log("BlockbustersPage: Initial mount - forcing rewards refresh");
      forceRewardsRefresh();
      
      // Add an immediate second refresh after a delay to ensure UI updates
      setTimeout(() => {
        console.log("BlockbustersPage: Follow-up rewards refresh");
        forceRewardsRefresh();
      }, 300);
    }
    
    // Increment render count to track component lifecycle
    renderCountRef.current += 1;
    console.log(`BlockbustersPage: Render count: ${renderCountRef.current}`);
  }, [isInitialized, refreshTrigger, currentUser, categoryParam, openCategory]);
  
  // Listen for changes from other components
  useEffect(() => {
    const fetchCards = () => {
      const entertainmentCards = getEntertainmentCards();
      setCards(entertainmentCards);
      setFilteredCards(entertainmentCards);
    };
    
    const handleCardAdded = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.action === 'card_added' && customEvent.detail?.cardType === 'entertainment') {
        console.log("BlockbustersPage: Detected new entertainment card added");
        fetchCards();
        
        // CRITICAL FIX: Award points more reliably for adding a blockbuster card
        if (currentUser && customEvent.detail?.cardId) {
          console.log(`BlockbustersPage: Detected new card ${customEvent.detail.cardId} added by user ${currentUser.id}`);
          
          // Direct call to add points without checking
          addPointsForCardCreation(currentUser.id, 'entertainment');
          
          // Ensure rewards are refreshed multiple times to handle race conditions
          setTimeout(() => forceRewardsRefresh(), 100);
          setTimeout(() => forceRewardsRefresh(), 500);
          setTimeout(() => forceRewardsRefresh(), 1500);
        }
      }
    };
    
    window.addEventListener('catalog_action', handleCardAdded);
    
    return () => {
      window.removeEventListener('catalog_action', handleCardAdded);
    };
  }, [currentUser]);
  
  const handleFilteredCardsChange = (filtered: EntertainmentCard[]) => {
    setFilteredCards(filtered as EntertainmentCard[]);
  };
  
  const clearFilters = () => {
    setFilters({
      status: [],
      rating: [],
      tags: []
    });
    setFilteredCards(cards);
  };
  
  const hasActiveFilters = () => {
    return filters.status.length > 0 || filters.rating.length > 0 || filters.tags.length > 0 || filteredCards.length !== cards.length;
  };

  // Get category colors from utility function
  const categoryColors = getDefaultCategoryColors();
  
  // Handle the drawer open/close state
  const handleCategoryToggle = (category: string, isOpen: boolean) => {
    console.log(`BlockbustersPage: Category "${category}" toggled to ${isOpen ? 'open' : 'closed'}`);
    // When opening a category, close any previously open one
    setOpenCategory(isOpen ? category : null);
  };
  
  // Force refresh when component mounts
  useEffect(() => {
    // Initial refresh
    const initialTimer = setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 100);
    
    return () => clearTimeout(initialTimer);
  }, []);
  
  return (
    <GridLayout 
      title="Blockbusters" 
      icon={<Film className="h-5 w-5" />}
      headerContent={
        <>
          <BitesHeader 
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters()}
            type="entertainment"
          />
          <div className="mt-4">
            <CatalogSearch 
              items={cards} 
              onFilteredItemsChange={handleFilteredCardsChange}
              type="entertainment"
              compact={true}
            />
          </div>
        </>
      }
    >
      <div className="w-full flex justify-center">
        <div className="w-full max-w-md">
          <EntertainmentCategoryDrawers 
            cards={filteredCards}
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

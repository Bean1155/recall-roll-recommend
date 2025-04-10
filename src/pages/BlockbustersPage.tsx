import React, { useState, useEffect, useRef } from "react";
import { Film } from "lucide-react";
import GridLayout from "@/components/GridLayout";
import { EntertainmentCard } from "@/lib/types";
import { getEntertainmentCards } from "@/lib/data";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import EntertainmentCategoryDrawers from "@/components/blockbusters/EntertainmentCategoryDrawers";
import { useEntertainmentCardDetailHandling } from "@/components/blockbusters/useEntertainmentCardDetailHandling";
import EntertainmentDetailDialog from "@/components/blockbusters/EntertainmentDetailDialog";
import BitesHeader from "@/components/bites/BitesHeader";
import { getDefaultCategoryColors, getCategoryDisplayName, getAllEntertainmentCategories } from "@/utils/categoryUtils";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { addPointsForCardCreation, forceRewardsRefresh } from "@/utils/rewardUtils";

const BlockbustersPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const filterParam = searchParams.get('filter');
  const filterValueParam = searchParams.get('value');
  
  const [cards, setCards] = useState<EntertainmentCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<EntertainmentCard[]>([]);
  const [filters, setFilters] = useState({
    status: [] as string[],
    rating: [] as number[],
    tags: [] as string[]
  });
  const { currentUser } = useUser();
  
  const renderCountRef = useRef(0);
  
  const {
    selectedCardId,
    isCardDetailOpen,
    setIsCardDetailOpen,
    selectedCard,
    handleCardClick
  } = useEntertainmentCardDetailHandling(cards);
  
  const [openCategory, setOpenCategory] = useState<string | null>(categoryParam);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const entertainmentCards = getEntertainmentCards();
        setCards(entertainmentCards);
        
        // Handle filter parameters - particularly for Top Rated
        if (filterParam === 'topRated') {
          const topRatedCards = entertainmentCards.filter(card => card.rating && card.rating >= 4);
          setFilteredCards(topRatedCards);
          console.log(`BlockbustersPage: Filtered to ${topRatedCards.length} top rated cards`);
        } 
        // Handle category + value filter
        else if (filterParam && filterValueParam) {
          let filteredResults = [...entertainmentCards];
          
          switch (filterParam) {
            case 'genre':
              filteredResults = filteredResults.filter(card => 
                card.genre?.toLowerCase() === filterValueParam.toLowerCase()
              );
              break;
            case 'medium':
              filteredResults = filteredResults.filter(card => 
                card.entertainmentCategory?.toLowerCase() === filterValueParam.toLowerCase()
              );
              break;
            case 'status':
              filteredResults = filteredResults.filter(card => 
                card.status?.toLowerCase() === filterValueParam.toLowerCase()
              );
              break;
          }
          
          setFilteredCards(filteredResults);
          console.log(`BlockbustersPage: Filtered to ${filteredResults.length} cards with ${filterParam}=${filterValueParam}`);
        }
        else {
          setFilteredCards(entertainmentCards);
          console.log(`BlockbustersPage: Loaded ${entertainmentCards.length} cards`);
        }
        
        if (categoryParam) {
          console.log(`BlockbustersPage: Category param found in URL: ${categoryParam}`);
          setOpenCategory(categoryParam.toLowerCase());
        }
        else if (!isInitialized && entertainmentCards.length > 0 && !openCategory) {
          const categories = [...new Set(entertainmentCards.map(card => 
            card.entertainmentCategory?.toLowerCase() || 'etc.'
          ))];
          
          if (categories.length > 0) {
            const firstCategory = categories[0];
            console.log(`BlockbustersPage: Setting initial open category to "${firstCategory}"`);
            setOpenCategory(firstCategory);
            
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
    
    if (currentUser) {
      console.log("BlockbustersPage: Initial mount - forcing rewards refresh");
      forceRewardsRefresh();
      
      setTimeout(() => {
        console.log("BlockbustersPage: Follow-up rewards refresh");
        forceRewardsRefresh();
      }, 300);
    }
    
    renderCountRef.current += 1;
    console.log(`BlockbustersPage: Render count: ${renderCountRef.current}`);
  }, [isInitialized, refreshTrigger, currentUser, categoryParam, openCategory, filterParam, filterValueParam]);
  
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
        
        if (currentUser && customEvent.detail?.cardId) {
          console.log(`BlockbustersPage: Detected new card ${customEvent.detail.cardId} added by user ${currentUser.id}`);
          
          addPointsForCardCreation(currentUser.id, 'entertainment');
          
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
    
    navigate('/blockbusters');
  };
  
  const hasActiveFilters = () => {
    return filters.status.length > 0 || filters.rating.length > 0 || filters.tags.length > 0 || 
           filteredCards.length !== cards.length || filterParam !== null;
  };

  const categoryColors = getDefaultCategoryColors();
  
  const handleCategoryToggle = (category: string, isOpen: boolean) => {
    console.log(`BlockbustersPage: Category "${category}" toggled to ${isOpen ? 'open' : 'closed'}`);
    setOpenCategory(isOpen ? category : null);
  };
  
  useEffect(() => {
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

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GridLayout from "@/components/GridLayout";
import { FoodCard } from "@/lib/types";
import { getAllCards } from "@/lib/data";
import { Utensils } from "lucide-react";
import CategoryDrawers from "@/components/bites/CategoryDrawers"; 
import AddCategoryDialog from "@/components/bites/AddCategoryDialog";
import BitesHeader from "@/components/bites/BitesHeader";
import { useCategoryColors } from "@/components/bites/useCategoryColors";
import { useCardDetailHandling } from "@/components/bites/useCardDetailHandling";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/components/ui/use-toast";
import CardDetailDialog from "@/components/bites/CardDetailDialog";

const BitesPage = () => {
  const { currentUser } = useUser();
  const [cards, setCards] = useState<FoodCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<FoodCard[]>([]);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [filterDescription, setFilterDescription] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  
  const categoryColors = useCategoryColors(cards);

  useEffect(() => {
    const fetchCards = () => {
      const allCards = getAllCards();
      const foodCards = allCards.filter(card => card.type === 'food') as FoodCard[];
      console.log('BitesPage: Fetched food cards:', foodCards.length);
      setCards(foodCards);
      setFilteredCards(foodCards);
    };

    fetchCards();
    
    const handleCardAdded = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.action === 'card_added' && customEvent.detail?.cardType === 'food') {
        console.log('BitesPage: Card added event received, refreshing cards');
        fetchCards();
      }
    };
    
    window.addEventListener('catalog_action', handleCardAdded);
    
    return () => {
      window.removeEventListener('catalog_action', handleCardAdded);
    };
  }, []);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    console.log('BitesPage: Processing URL params:', location.search);
    
    const cardToOpen = searchParams.get('open');
    const highlightParam = searchParams.get('highlight');
    const fromSearch = searchParams.get('fromSearch');
    
    if (cardToOpen || highlightParam) {
      const cardId = cardToOpen || highlightParam;
      console.log('BitesPage: Found card param in URL:', cardId);
      if (cards.length > 0) {
        const cardToSelect = cards.find(card => card.id === cardId);
        if (cardToSelect) {
          console.log('BitesPage: Found card to open:', cardToSelect.title);
          handleCardClick(cardToSelect);
        } else {
          console.log('BitesPage: Card not found with ID:', cardId);
          console.log('BitesPage: Available card IDs:', cards.map(c => c.id).join(', '));
        }
      } else {
        console.log('BitesPage: Cards not loaded yet, will retry when cards are available');
      }
    }
    
    const filterParam = searchParams.get('filter');
    const proximityLocation = searchParams.get('proximity');
    const proximityDistance = searchParams.get('distance');
    
    if (filterParam) {
      const [filterType, filterValue] = filterParam.split('=');
      if (filterType && filterValue) {
        applyFilterFromUrl(filterType, decodeURIComponent(filterValue));
      }
    } else if (proximityLocation && proximityDistance) {
      applyProximityFilterFromUrl(proximityLocation, Number(proximityDistance));
    }
  }, [location.search, cards]);
  
  const {
    selectedCardId,
    isCardDetailOpen,
    setIsCardDetailOpen,
    selectedCard,
    handleCardClick
  } = useCardDetailHandling(cards);
  
  const applyFilterFromUrl = (filterType: string, value: string) => {
    let filtered: FoodCard[] = [...cards];
    
    if (filterType === "status") {
      filtered = filtered.filter(card => card.status === value);
      setFilterDescription(`Status: ${value}`);
    } else if (filterType === "rating") {
      const ratingValue = parseInt(value);
      if (value.includes("+")) {
        const minRating = parseInt(value);
        filtered = filtered.filter(card => card.rating && card.rating >= minRating);
        setFilterDescription(`Rating: ${minRating}+ stars`);
      } else {
        filtered = filtered.filter(card => card.rating && card.rating === ratingValue);
        setFilterDescription(`Rating: ${ratingValue} stars`);
      }
    } else if (filterType === "tags") {
      filtered = filtered.filter(card => card.tags && card.tags.includes(value));
      setFilterDescription(`Tag: ${value}`);
    } else if (filterType === "location") {
      filtered = filtered.filter(card => card.location === value);
      setFilterDescription(`Location: ${value}`);
    }
    
    setFilteredCards(filtered);
    setHasActiveFilters(true);
    
    toast({
      title: "Filter Applied",
      description: `Showing ${filtered.length} results for ${filterDescription}`
    });
  };
  
  const applyProximityFilterFromUrl = (location: string, distance: number) => {
    const calculateDistance = (loc1: string, loc2: string) => {
      const stringToNum = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = ((hash << 5) - hash) + str.charCodeAt(i);
          hash |= 0;
        }
        return Math.abs(hash);
      };
      
      if (loc1.toLowerCase() === loc2.toLowerCase()) return 0;
      const combinedHash = stringToNum(loc1 + loc2);
      return ((combinedHash % 200) / 10) + 0.1;
    };
    
    const filtered = cards.filter(card => {
      if (!card.location) return false;
      const calcDistance = calculateDistance(location, card.location);
      return calcDistance <= distance;
    });
    
    filtered.sort((a, b) => {
      if (!a.location || !b.location) return 0;
      const distA = calculateDistance(location, a.location);
      const distB = calculateDistance(location, b.location);
      return distA - distB;
    });
    
    setFilteredCards(filtered);
    setHasActiveFilters(true);
    setFilterDescription(`Within ${distance} miles of ${location}`);
    
    toast({
      title: "Proximity Filter Applied",
      description: `Showing ${filtered.length} places within ${distance} miles of ${location}`
    });
  };
  
  const clearFilters = () => {
    setFilteredCards(cards);
    setHasActiveFilters(false);
    setFilterDescription("");
    console.log('BitesPage: Filters cleared');
    
    navigate('/bites');
  };
  
  const handleFilteredItemsChange = (filteredItems: FoodCard[]) => {
    console.log('BitesPage: Filtered items changed, count:', filteredItems.length);
    setFilteredCards(filteredItems);
    setHasActiveFilters(filteredItems.length !== cards.length);
  };
  
  const searchParams = new URLSearchParams(location.search);
  const focusCardId = searchParams.get('highlight') || searchParams.get('open');
  const focusCategory = focusCardId ? cards.find(c => c.id === focusCardId)?.category : undefined;
  
  return (
    <GridLayout 
      title={hasActiveFilters ? `Bites - ${filterDescription}` : "Bites"}
      icon={<Utensils className="h-6 w-6 text-teal-700" />}
      headerContent={
        <div className="w-full flex justify-center">
          <BitesHeader 
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      }
    >
      <div className="w-full">
        {hasActiveFilters && filteredCards.length > 0 && (
          <div className="mb-4 text-sm text-gray-600 text-center">
            Showing {filteredCards.length} results for {filterDescription}
          </div>
        )}
        
        <CategoryDrawers
          cards={filteredCards.length > 0 ? filteredCards : cards} 
          onCardClick={handleCardClick} 
          categoryColors={categoryColors}
          defaultOpenCategory={focusCategory}
          hideEmptyCategories={true} 
          startCollapsed={!focusCategory}
        />
      </div>
      
      <AddCategoryDialog 
        isOpen={isAddCategoryDialogOpen} 
        onOpenChange={setIsAddCategoryDialogOpen} 
      />
      
      <CardDetailDialog
        isOpen={isCardDetailOpen}
        onOpenChange={setIsCardDetailOpen}
        card={selectedCard}
        categoryColors={categoryColors}
      />
    </GridLayout>
  );
};

export default BitesPage;

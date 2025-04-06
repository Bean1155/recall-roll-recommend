import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GridLayout from "@/components/GridLayout";
import { FoodCard } from "@/lib/types";
import { getAllCards } from "@/lib/data";
import CategoryDrawers from "@/components/bites/CategoryDrawers"; 
import AddCategoryDialog from "@/components/bites/AddCategoryDialog";
import CategoryDrawer from "@/components/bites/CategoryDrawer";
import CardDetailDialog from "@/components/bites/CardDetailDialog";
import BitesHeader from "@/components/bites/BitesHeader";
import { useCategoryColors } from "@/components/bites/useCategoryColors";
import { useCardDetailHandling } from "@/components/bites/useCardDetailHandling";
import { useUser } from "@/contexts/UserContext";

const BitesPage = () => {
  const { currentUser } = useUser();
  const [cards, setCards] = useState<FoodCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<FoodCard[]>([]);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const location = useLocation();
  const [filters, setFilters] = useState({
    status: [] as string[],
    rating: [] as number[],
    tags: [] as string[]
  });
  
  useEffect(() => {
    const fetchCards = () => {
      const allCards = getAllCards();
      const foodCards = allCards.filter(card => card.type === 'food') as FoodCard[];
      console.log('BitesPage: Fetched food cards:', foodCards.length);
      setCards(foodCards);
      setFilteredCards(foodCards);
    };

    fetchCards();
    
    const searchParams = new URLSearchParams(location.search);
    const cardToOpen = searchParams.get('open');
    if (cardToOpen) {
      setTimeout(() => {
        console.log('BitesPage: Opening card from URL param:', cardToOpen);
        const cardToSelect = cards.find(card => card.id === cardToOpen);
        if (cardToSelect) {
          handleCardClick(cardToSelect);
        }
      }, 300);
    }
    
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
  }, [location.search]);
  
  const categoryColors = useCategoryColors(cards);
  
  const {
    selectedCardId,
    isCardDetailOpen,
    setIsCardDetailOpen,
    selectedCard,
    handleCardClick
  } = useCardDetailHandling(cards);
  
  useEffect(() => {
    if (!hasActiveFilters()) {
      setFilteredCards(cards);
      return;
    }
    
    const filtered = cards.filter(card => {
      if (filters.status.length > 0 && !filters.status.includes(card.status)) {
        return false;
      }
      
      if (filters.rating.length > 0 && card.rating && !filters.rating.includes(card.rating)) {
        return false;
      }
      
      if (filters.tags.length > 0) {
        if (!card.tags || card.tags.length === 0) {
          return false;
        }
        
        const hasMatchingTag = filters.tags.some(tag => 
          card.tags?.some(cardTag => cardTag.toLowerCase().includes(tag.toLowerCase()))
        );
        
        if (!hasMatchingTag) {
          return false;
        }
      }
      
      return true;
    });
    
    setFilteredCards(filtered);
  }, [filters, cards]);
  
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

  const handleQuickFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters };
    
    if (filterType === "status") {
      if (newFilters.status.includes(value)) {
        newFilters.status = newFilters.status.filter(status => status !== value);
      } else {
        newFilters.status = [...newFilters.status, value];
      }
    }
    
    if (filterType === "rating") {
      const ratingValue = parseInt(value, 10);
      if (newFilters.rating.includes(ratingValue)) {
        newFilters.rating = newFilters.rating.filter(r => r !== ratingValue);
      } else {
        newFilters.rating = [...newFilters.rating, ratingValue];
      }
    }
    
    setFilters(newFilters);
  };
  
  const handleFilteredItemsChange = (filteredItems: FoodCard[]) => {
    setFilteredCards(filteredItems);
  };
  
  const headerProps = BitesHeader({
    hasActiveFilters: hasActiveFilters(),
    onClearFilters: clearFilters,
    onOpenFilters: () => setIsFiltersOpen(true),
    onFilterChange: handleQuickFilterChange,
    activeFilters: filters,
    cards: cards,
    onFilteredItemsChange: handleFilteredItemsChange
  });
  
  const searchParams = new URLSearchParams(location.search);
  const focusCardId = searchParams.get('open');
  
  return (
    <GridLayout 
      title={headerProps.title}
      icon={headerProps.icon}
      headerContent={headerProps.headerContent}
    >
      <div className="w-full">
        <CategoryDrawers
          cards={filteredCards.length > 0 ? filteredCards : cards} 
          onCardClick={handleCardClick} 
          categoryColors={categoryColors}
          defaultOpenCategory={focusCardId ? 
            cards.find(c => c.id === focusCardId)?.category : undefined}
        />
      </div>
      
      <CategoryDrawer 
        isOpen={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
        cards={cards}
        onApplyFilters={applyFilters}
        currentFilters={filters}
      />
      
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

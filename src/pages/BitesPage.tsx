
import React, { useState, useEffect } from "react";
import GridLayout from "@/components/GridLayout";
import { FoodCard } from "@/lib/types";
import { getAllCards } from "@/lib/data";
import CategoryCardsDisplay from "@/components/bites/CategoryCardsDisplay";
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
  const [filters, setFilters] = useState({
    status: [] as string[],
    rating: [] as number[],
    tags: [] as string[]
  });
  
  // Get food cards from all cards
  useEffect(() => {
    const fetchCards = () => {
      const allCards = getAllCards();
      const foodCards = allCards.filter(card => card.type === 'food') as FoodCard[];
      setCards(foodCards);
      setFilteredCards(foodCards);
    };

    fetchCards();
    
    const handleCardAdded = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.action === 'card_added' && customEvent.detail?.cardType === 'food') {
        fetchCards();
      }
    };
    
    window.addEventListener('catalog_action', handleCardAdded);
    
    return () => {
      window.removeEventListener('catalog_action', handleCardAdded);
    };
  }, []);
  
  const categoryColors = useCategoryColors(cards);
  
  const {
    selectedCardId,
    isCardDetailOpen,
    setIsCardDetailOpen,
    selectedCard,
    handleCardClick
  } = useCardDetailHandling(cards);
  
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
    setFilteredCards(cards);
  };
  
  const hasActiveFilters = () => {
    return filters.status.length > 0 || filters.rating.length > 0 || filters.tags.length > 0;
  };

  const handleQuickFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters };
    
    if (filterType === "status") {
      // Toggle status filter
      if (newFilters.status.includes(value)) {
        newFilters.status = newFilters.status.filter(status => status !== value);
      } else {
        newFilters.status = [...newFilters.status, value];
      }
    }
    
    if (filterType === "rating") {
      const ratingValue = parseInt(value, 10);
      // Toggle rating filter
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
  
  return (
    <GridLayout 
      title={headerProps.title}
      icon={headerProps.icon}
      headerContent={headerProps.headerContent}
    >
      <div className="w-full">
        <CategoryCardsDisplay 
          cards={filteredCards.length > 0 ? filteredCards : cards} 
          onCardClick={handleCardClick} 
          filters={filters}
          categoryColors={categoryColors}
          onOpenFilters={() => setIsFiltersOpen(true)}
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

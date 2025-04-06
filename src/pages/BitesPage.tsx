
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GridLayout from "@/components/GridLayout";
import { FoodCard } from "@/lib/types";
import { getAllCards } from "@/lib/data";
import CategoryDrawers from "@/components/bites/CategoryDrawers"; 
import AddCategoryDialog from "@/components/bites/AddCategoryDialog";
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
  const location = useLocation();
  
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
  
  const clearFilters = () => {
    setFilteredCards(cards);
  };
  
  const handleFilteredItemsChange = (filteredItems: FoodCard[]) => {
    setFilteredCards(filteredItems);
  };
  
  const headerProps = BitesHeader({
    onClearFilters: clearFilters,
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

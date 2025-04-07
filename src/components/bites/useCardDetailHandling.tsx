import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FoodCard } from "@/lib/types";

export const useCardDetailHandling = (cards: FoodCard[]) => {
  const location = useLocation();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isCardDetailOpen, setIsCardDetailOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<FoodCard | null>(null);
  
  useEffect(() => {
    // Check for card ID in the URL query parameter
    const params = new URLSearchParams(location.search);
    const cardToOpen = params.get('open');
    const highlightCard = params.get('highlight');
    
    if (cardToOpen) {
      const card = cards.find(c => c.id === cardToOpen);
      if (card) {
        console.log('useCardDetailHandling: Opening card with ID:', cardToOpen);
        setSelectedCard(card);
        setSelectedCardId(cardToOpen);
        setIsCardDetailOpen(true);
        
        // Clear the URL parameter without refreshing
        const newUrl = `${window.location.pathname}${window.location.hash}`;
        window.history.replaceState({}, document.title, newUrl);
      }
    } else if (highlightCard) {
      // Handle the highlight parameter
      console.log('useCardDetailHandling: Found highlight parameter:', highlightCard);
      const card = cards.find(c => c.id === highlightCard);
      if (card) {
        console.log('useCardDetailHandling: Found matching card:', card.title);
        setSelectedCard(card);
        setSelectedCardId(highlightCard);
        setIsCardDetailOpen(true);
        
        // Clear the highlight parameter from URL without refreshing
        const newParams = new URLSearchParams(location.search);
        newParams.delete('highlight');
        
        // Keep other parameters if they exist
        const newUrl = newParams.toString() 
          ? `${window.location.pathname}?${newParams.toString()}${window.location.hash}`
          : `${window.location.pathname}${window.location.hash}`;
          
        window.history.replaceState({}, document.title, newUrl);
      } else {
        console.log('useCardDetailHandling: No matching card found for ID:', highlightCard);
      }
    }
    
    // Check for hash in URL (legacy method)
    if (location.hash) {
      const cardId = location.hash.replace('#card-', '');
      const card = cards.find(c => c.id === cardId);
      if (card) {
        console.log('useCardDetailHandling: Opening card from hash:', cardId);
        setSelectedCard(card);
        setSelectedCardId(cardId);
        setIsCardDetailOpen(true);
        
        // Clear the hash without refreshing
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
      }
    }
  }, [location, cards]);
  
  const handleCardClick = (card: FoodCard) => {
    console.log('useCardDetailHandling: handleCardClick called for card:', card.id, card.title);
    setSelectedCard(card);
    setSelectedCardId(card.id);
    setIsCardDetailOpen(true);
  };
  
  return {
    selectedCardId,
    isCardDetailOpen,
    setIsCardDetailOpen,
    selectedCard,
    handleCardClick
  };
};

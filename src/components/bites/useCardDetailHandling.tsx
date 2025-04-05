
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
    
    if (cardToOpen) {
      const card = cards.find(c => c.id === cardToOpen);
      if (card) {
        setSelectedCard(card);
        setSelectedCardId(cardToOpen);
        setIsCardDetailOpen(true);
        
        // Clear the URL parameter without refreshing
        const newUrl = `${window.location.pathname}${window.location.hash}`;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
    
    // Check for hash in URL (legacy method)
    if (location.hash) {
      const cardId = location.hash.replace('#card-', '');
      const card = cards.find(c => c.id === cardId);
      if (card) {
        setSelectedCard(card);
        setSelectedCardId(cardId);
        setIsCardDetailOpen(true);
      }
    }
  }, [location, cards]);
  
  const handleCardClick = (card: FoodCard) => {
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

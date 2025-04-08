import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { EntertainmentCard } from "@/lib/types";

export const useEntertainmentCardDetailHandling = (cards: EntertainmentCard[]) => {
  const location = useLocation();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isCardDetailOpen, setIsCardDetailOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<EntertainmentCard | null>(null);
  
  useEffect(() => {
    console.log("useEntertainmentCardDetailHandling: Effect running with location change");
    console.log("useEntertainmentCardDetailHandling: Current location:", location.search);
    
    // Check for card ID in the URL query parameter
    const params = new URLSearchParams(location.search);
    const cardToOpen = params.get('open');
    const highlightCard = params.get('highlight');
    
    if (cardToOpen) {
      console.log('useEntertainmentCardDetailHandling: Found open parameter:', cardToOpen);
      const card = cards.find(c => c.id === cardToOpen);
      if (card) {
        console.log('useEntertainmentCardDetailHandling: Opening card with ID:', cardToOpen);
        setSelectedCard(card);
        setSelectedCardId(cardToOpen);
        setIsCardDetailOpen(true);
        
        // Clear the URL parameter without refreshing
        const newUrl = `${window.location.pathname}${window.location.hash}`;
        window.history.replaceState({}, document.title, newUrl);
      }
    } else if (highlightCard) {
      // Handle the highlight parameter
      console.log('useEntertainmentCardDetailHandling: Found highlight parameter:', highlightCard);
      console.log('useEntertainmentCardDetailHandling: Available cards count:', cards.length);
      
      if (cards.length > 0) {
        const card = cards.find(c => c.id === highlightCard);
        if (card) {
          console.log('useEntertainmentCardDetailHandling: Found matching card for highlight:', card.title);
          setSelectedCard(card);
          setSelectedCardId(highlightCard);
          setIsCardDetailOpen(true);
          
          // Only remove the highlight param, keep other params
          const newParams = new URLSearchParams(location.search);
          newParams.delete('highlight');
          
          // Keep other parameters if they exist
          const newUrl = newParams.toString() 
            ? `${window.location.pathname}?${newParams.toString()}${window.location.hash}`
            : `${window.location.pathname}${window.location.hash}`;
            
          window.history.replaceState({}, document.title, newUrl);
        } else {
          console.log('useEntertainmentCardDetailHandling: No matching card found for ID:', highlightCard);
          console.log('useEntertainmentCardDetailHandling: Available card IDs:', cards.map(c => c.id).join(', '));
        }
      } else {
        console.log('useEntertainmentCardDetailHandling: Cards array is empty, cannot find highlighted card');
      }
    }
    
    // Check for hash in URL (legacy method)
    if (location.hash) {
      const cardId = location.hash.replace('#card-', '');
      const card = cards.find(c => c.id === cardId);
      if (card) {
        console.log('useEntertainmentCardDetailHandling: Opening card from hash:', cardId);
        setSelectedCard(card);
        setSelectedCardId(cardId);
        setIsCardDetailOpen(true);
        
        // Clear the hash without refreshing
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
      }
    }
  }, [location, cards]);
  
  const handleCardClick = (card: EntertainmentCard) => {
    console.log('useEntertainmentCardDetailHandling: handleCardClick called for card:', card.id, card.title);
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

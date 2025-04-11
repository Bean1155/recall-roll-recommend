
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CatalogCard } from '@/lib/types';

interface UseCardDetailHandlingOptions {
  cards: CatalogCard[];
  type: 'food' | 'entertainment';
  defaultCategory?: string | null;
}

export function useCardDetailHandling({ 
  cards, 
  type,
  defaultCategory = null 
}: UseCardDetailHandlingOptions) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CatalogCard | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(defaultCategory);
  const navigate = useNavigate();

  // Handle highlight parameter from URL
  useEffect(() => {
    const highlightId = searchParams.get('highlight');
    if (highlightId) {
      const cardToHighlight = cards.find(card => card.id === highlightId);
      if (cardToHighlight) {
        setSelectedCard(cardToHighlight);
        setIsDetailOpen(true);
        
        // Set category if available
        if (type === 'food' && 'category' in cardToHighlight) {
          setSelectedCategory(cardToHighlight.category as string);
        } else if (type === 'entertainment' && 'entertainmentType' in cardToHighlight) {
          setSelectedCategory(cardToHighlight.entertainmentType as string);
        }
      } else {
        // Clear the highlight param if card not found
        searchParams.delete('highlight');
        setSearchParams(searchParams);
      }
    }
    
    // Handle category parameter
    const categoryParam = searchParams.get('category');
    if (categoryParam && !selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams, cards, type]);

  const handleCardClick = useCallback((card: CatalogCard) => {
    setSelectedCard(card);
    setIsDetailOpen(true);
    
    // Update URL with highlight parameter
    searchParams.set('highlight', card.id);
    setSearchParams(searchParams);
    
    // Scroll to the card if needed
    const cardElement = document.getElementById(`card-${card.id}`);
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [searchParams, setSearchParams]);

  const handleDetailClose = useCallback(() => {
    setIsDetailOpen(false);
    
    // Remove highlight from URL
    searchParams.delete('highlight');
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    
    // Update URL with category parameter
    if (category) {
      searchParams.set('category', category);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  const clearCategory = useCallback(() => {
    setSelectedCategory(null);
    searchParams.delete('category');
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  return {
    isDetailOpen,
    selectedCard,
    selectedCategory,
    handleCardClick,
    handleDetailClose,
    handleCategoryChange,
    clearCategory
  };
}

export default useCardDetailHandling;

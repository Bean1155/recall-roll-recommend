
import React, { useState, useEffect } from "react";
import { UtensilsCrossed, Plus, Search, FilterX } from "lucide-react";
import GridLayout from "@/components/GridLayout";
import { Button } from "@/components/ui/button";
import { FoodCard } from "@/lib/types";
import { getFoodCards } from "@/lib/data";
import { useNavigate, useLocation } from "react-router-dom";
import CategoryCardsDisplay from "@/components/bites/CategoryCardsDisplay";
import AddCategoryDialog from "@/components/bites/AddCategoryDialog";
import CategoryDrawer from "@/components/bites/CategoryDrawer";
import CardDetailDialog from "@/components/bites/CardDetailDialog";
import { useUser } from "@/contexts/UserContext";

const BitesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useUser();
  const [cards, setCards] = useState<FoodCard[]>([]);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [] as string[],
    rating: [] as number[],
    tags: [] as string[]
  });
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isCardDetailOpen, setIsCardDetailOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<FoodCard | null>(null);
  
  useEffect(() => {
    const foodCards = getFoodCards();
    setCards(foodCards);
    
    // Check for card ID in the URL query parameter
    const params = new URLSearchParams(location.search);
    const cardToOpen = params.get('open');
    
    if (cardToOpen) {
      const card = foodCards.find(c => c.id === cardToOpen);
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
      const card = foodCards.find(c => c.id === cardId);
      if (card) {
        setSelectedCard(card);
        setSelectedCardId(cardId);
        setIsCardDetailOpen(true);
      }
    }
  }, [location]);
  
  useEffect(() => {
    const fetchCards = () => {
      const foodCards = getFoodCards();
      setCards(foodCards);
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
  
  const handleCardClick = (card: FoodCard) => {
    setSelectedCard(card);
    setSelectedCardId(card.id);
    setIsCardDetailOpen(true);
  };
  
  const categoryColors: Record<string, string> = {
    "restaurant": "#FDE1D3", // Light pink
    "cafe": "#E6F3F3",       // Light blue-green
    "bakery": "#FCF0D3",     // Light yellow
    "bar": "#E2D8F3",        // Light purple
    "food truck": "#D3F4E6", // Light green
    "dessert": "#FFE5EC",    // Light pink
    "fastfood": "#FFE8CC",   // Light orange
    "grocery": "#E5FFE5",    // Light green
    "home cooking": "#F9E8FF", // Light lavender
    "other": "#F5F5F5",      // Light gray
  };
  
  // Check for custom categories and add colors if needed
  const customCategories = [...new Set(cards.map(card => card.category))];
  customCategories.forEach(category => {
    if (!categoryColors[category]) {
      categoryColors[category] = "#F5F5F5"; // Default light gray for custom categories
    }
  });
  
  return (
    <GridLayout 
      title="Bites" 
      icon={<UtensilsCrossed className="h-5 w-5" />}
      headerContent={
        <div className="flex space-x-2">
          {hasActiveFilters() && (
            <Button 
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={clearFilters}
            >
              <FilterX className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}
          <Button 
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => navigate('/search?type=food')}
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </Button>
          <Button 
            size="sm"
            variant="default"
            className="flex items-center gap-1"
            onClick={() => navigate('/create/food')}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Bite</span>
          </Button>
        </div>
      }
    >
      <div className="w-full">
        <CategoryCardsDisplay 
          cards={cards} 
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
        open={isAddCategoryDialogOpen} 
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

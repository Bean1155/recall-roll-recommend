import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FoodCard, FoodCategory } from "@/lib/types";
import { getCardsByType } from "@/lib/data";
import { useUser } from "@/contexts/UserContext";
import { PlusCircle } from "lucide-react";
import GridLayout from "@/components/GridLayout";
import { useToast } from "@/hooks/use-toast";
import CatalogSearch from "@/components/CatalogSearch";
import CategoryDrawer from "@/components/bites/CategoryDrawer";
import SearchResultsDialog from "@/components/bites/SearchResultsDialog";
import CardDetailDialog from "@/components/bites/CardDetailDialog";
import { 
  defaultCategories,
  getCategoryDisplayName,
  generateCategoryColors,
  getTextColor,
  getAllCategories
} from "@/utils/categoryUtils";

const BitesPage = () => {
  const [foodCards, setFoodCards] = useState<FoodCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<FoodCard[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [initialAccordionValues, setInitialAccordionValues] = useState<string[]>([]);
  const [selectedCard, setSelectedCard] = useState<FoodCard | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<FoodCard[]>([]);
  const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(false);
  const [openCatalogs, setOpenCatalogs] = useState<string[]>([]);
  const { userName } = useUser();
  const location = useLocation();
  const { toast } = useToast();
  const highlightedCardRef = useRef<HTMLDivElement>(null);
  
  // Load all categories including custom ones
  useEffect(() => {
    // Load custom categories
    const savedCategories = localStorage.getItem('customFoodCategories');
    let customCategories: FoodCategory[] = [];
    
    if (savedCategories) {
      try {
        customCategories = JSON.parse(savedCategories);
      } catch (e) {
        console.error("Error parsing custom categories:", e);
      }
    }
    
    // Combine default and custom categories, filter out duplicates
    const allCategories = [...defaultCategories, ...customCategories];
    const uniqueCategories = [...new Set(allCategories)];
    
    // Sort categories but keep "other" at the end
    const sortedCategories = uniqueCategories
      .filter(category => category !== "other" as FoodCategory)
      .sort((a, b) => a.localeCompare(b));
    
    sortedCategories.push("other");
    setCategories(sortedCategories);
    
    if (sortedCategories.length > 0) {
      setInitialAccordionValues([sortedCategories[0]]);
    }
  }, []);
  
  useEffect(() => {
    const cards = getCardsByType("food") as FoodCard[];
    setFoodCards(cards);
    setFilteredCards(cards);
    
    const searchParams = new URLSearchParams(location.search);
    const highlightId = searchParams.get('highlight');
    const categoryParam = searchParams.get('category');
    const fromSearch = searchParams.get('fromSearch');
    
    if (highlightId) {
      const cardToHighlight = cards.find(card => card.id === highlightId);
      
      if (cardToHighlight) {
        const category = categoryParam || cardToHighlight.category;
        
        setInitialAccordionValues([category]);
        
        if (fromSearch === 'true') {
          setSelectedCard(cardToHighlight);
          setIsCardModalOpen(true);
        } else {
          setTimeout(() => {
            const accordionItem = document.querySelector(`[data-value="${category}"]`);
            if (accordionItem && !accordionItem.closest('[data-state="open"]')) {
              (accordionItem as HTMLElement).click();
            }
            
            setTimeout(() => {
              const cardElement = document.getElementById(`card-${highlightId}`);
              if (cardElement) {
                cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                cardElement.classList.add('highlight-pulse');
                setTimeout(() => {
                  cardElement.classList.remove('highlight-pulse');
                }, 2000);
                
                toast({
                  title: "Card found",
                  description: `Showing ${cardToHighlight.title}`,
                });
              }
            }, 500);
          }, 300);
        }
      }
    }
    
    const searchResultsParam = searchParams.get('searchResults');
    if (searchResultsParam) {
      try {
        const ids = searchResultsParam.split(',');
        const matchingCards = cards.filter(card => ids.includes(card.id));
        if (matchingCards.length > 0) {
          setSearchResults(matchingCards);
          setIsSearchResultsOpen(true);
          
          toast({
            title: `Found ${matchingCards.length} results`,
            description: "Click on a card to view details",
          });
        }
      } catch (error) {
        console.error("Error parsing search results:", error);
      }
    }
  }, [location.search, toast]);

  const handleFilteredItemsChange = (items: FoodCard[]) => {
    setFilteredCards(items);
  };
  
  const handleSearchResultCardClick = (card: FoodCard) => {
    setIsSearchResultsOpen(false);
    setSelectedCard(card);
    setIsCardModalOpen(true);
  };

  const handleCatalogToggle = (category: string, isOpen: boolean) => {
    setOpenCatalogs(prev => {
      if (isOpen) {
        if (prev.includes(category)) return prev;
        return [...prev, category];
      } else {
        return prev.filter(cat => cat !== category);
      }
    });
  };

  // Create dynamic cardsByCategory based on available categories
  const cardsByCategory: Record<string, FoodCard[]> = {};
  
  categories.forEach(category => {
    cardsByCategory[category] = [];
  });
  
  filteredCards.forEach(card => {
    // If the category doesn't exist in our map yet, add it
    if (!cardsByCategory[card.category]) {
      cardsByCategory[card.category] = [];
    }
    cardsByCategory[card.category].push(card);
  });

  // Generate category pairs for grid layout
  const categoryPairs = [];
  for (let i = 0; i < categories.length; i += 2) {
    const pair = [categories[i]];
    if (i + 1 < categories.length) {
      pair.push(categories[i + 1]);
    }
    categoryPairs.push(pair);
  }

  // Generate category colors
  const categoryColors = generateCategoryColors(categories);

  return (
    <GridLayout>
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="catalog-title text-3xl">
          From the Library of <span className="font-typewriter font-bold text-black">{userName}</span>
        </h1>
        <div className="flex flex-wrap gap-2">
          <CatalogSearch 
            items={foodCards}
            onFilteredItemsChange={handleFilteredItemsChange}
            type="food"
          />
        </div>
      </div>

      {foodCards.length === 0 ? (
        <div className="text-center py-12 bg-catalog-cream rounded-lg border border-catalog-softBrown/30 shadow-md">
          <p className="text-lg text-catalog-softBrown mb-4">
            Your food catalog is empty.
          </p>
          <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal">
            <Link to="/create/food">
              <PlusCircle size={18} className="mr-2" />
              Add Your First Food Experience
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="flex justify-between items-center pb-4">
            <h2 className="text-xl font-medium text-catalog-softBrown">Categories</h2>
          </div>
          
          {categoryPairs.map((pair, pairIndex) => (
            <div key={`pair-${pairIndex}`} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {pair.map((category) => {
                const categoryColor = categoryColors[category] || "#d2b48c";
                const textColor = getTextColor(categoryColor);
                const isOpen = openCatalogs.includes(category);
                
                return (
                  <CategoryDrawer
                    key={category}
                    category={category}
                    cards={cardsByCategory[category] || []}
                    backgroundColor={categoryColor}
                    textColor={textColor}
                    categoryDisplayName={getCategoryDisplayName(category)}
                    isOpen={isOpen}
                    onOpenChange={(open) => handleCatalogToggle(category, open)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Dialogs */}
      <SearchResultsDialog
        isOpen={isSearchResultsOpen}
        onOpenChange={setIsSearchResultsOpen}
        results={searchResults}
        categoryColors={categoryColors}
        onCardClick={handleSearchResultCardClick}
      />

      <CardDetailDialog
        isOpen={isCardModalOpen}
        onOpenChange={setIsCardModalOpen}
        card={selectedCard}
        categoryColors={categoryColors}
      />

      <style>{`
        .highlight-pulse {
          animation: pulse 2s;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 128, 128, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(0, 128, 128, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 128, 128, 0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </GridLayout>
  );
};

export default BitesPage;

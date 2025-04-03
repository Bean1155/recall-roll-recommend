import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EntertainmentCard } from "@/lib/types";
import { getCardsByType } from "@/lib/data";
import { useUser } from "@/contexts/UserContext";
import { PlusCircle } from "lucide-react";
import GridLayout from "@/components/GridLayout";
import { useToast } from "@/hooks/use-toast";
import CatalogSearch from "@/components/CatalogSearch";
import EntertainmentCategoryDrawer from "@/components/blockbusters/EntertainmentCategoryDrawer";
import EntertainmentDetailDialog from "@/components/blockbusters/EntertainmentDetailDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Envelope from "@/components/Envelope";
import CatalogCard from "@/components/CatalogCard";

const allCategories = [
  "movies", "tv shows", "documentaries", "concerts", 
  "theater", "musicals", "podcasts", "comedy", "etc."
];

const categoryColors: Record<string, string> = {
  "movies": "#f5c4d3",
  "tv shows": "#e0c5c1",
  "documentaries": "#ddb892",
  "concerts": "#e9b44c",
  "theater": "#c1cc99",
  "musicals": "#9de0d0",
  "podcasts": "#a5b1c2",
  "comedy": "#a64b2a",
  "etc.": "#da7f5d",
};

const getCategoryDisplayName = (category: string): string => {
  return category
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getTextColor = (backgroundColor: string): string => {
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  return brightness > 145 ? "#603913" : "#ffffff";
};

const BlockbustersPage = () => {
  const [entertainmentCards, setEntertainmentCards] = useState<EntertainmentCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<EntertainmentCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<EntertainmentCard | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<EntertainmentCard[]>([]);
  const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(false);
  const [openCatalogs, setOpenCatalogs] = useState<string[]>([]);
  const { userName } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const highlightedCardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const cards = getCardsByType('entertainment') as EntertainmentCard[];
    setEntertainmentCards(cards);
    setFilteredCards(cards);
    
    const searchParams = new URLSearchParams(location.search);
    const highlightId = searchParams.get('highlight');
    const categoryParam = searchParams.get('category');
    const fromSearch = searchParams.get('fromSearch');
    
    if (highlightId) {
      const cardToHighlight = cards.find(card => card.id === highlightId);
      
      if (cardToHighlight) {
        const category = categoryParam || (cardToHighlight.entertainmentCategory?.toLowerCase() || 'etc.');
        
        setOpenCatalogs([category]);
        
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

  const handleFilteredItemsChange = (items: EntertainmentCard[]) => {
    setFilteredCards(items);
  };
  
  const handleSearchResultCardClick = (card: EntertainmentCard) => {
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

  const activeCategories = allCategories.filter(category => 
    filteredCards.some(card => 
      (card.entertainmentCategory?.toLowerCase() || 'etc.') === category
    )
  );

  const cardsByCategory: Record<string, EntertainmentCard[]> = {};
  
  activeCategories.forEach(category => {
    cardsByCategory[category] = [];
  });
  
  filteredCards.forEach(card => {
    const category = card.entertainmentCategory?.toLowerCase() || 'etc.';
    
    if (!cardsByCategory[category]) {
      cardsByCategory[category] = [];
    }
    cardsByCategory[category].push(card);
  });

  const categoryPairs = [];
  for (let i = 0; i < activeCategories.length; i += 2) {
    const pair = [activeCategories[i]];
    if (i + 1 < activeCategories.length) {
      pair.push(activeCategories[i + 1]);
    }
    categoryPairs.push(pair);
  }

  return (
    <GridLayout>
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="catalog-title text-3xl">
          From the Library of <span className="font-typewriter font-bold text-black">{userName}</span>
        </h1>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <CatalogSearch 
            items={entertainmentCards}
            onFilteredItemsChange={handleFilteredItemsChange}
            type="entertainment"
          />
          <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal">
            <Link to="/create/entertainment">
              <PlusCircle size={16} className="mr-2" />
              Add New Blockbuster
            </Link>
          </Button>
        </div>
      </div>

      {entertainmentCards.length === 0 ? (
        <div className="text-center py-12 bg-catalog-cream rounded-lg border border-catalog-softBrown/30 shadow-md">
          <p className="text-lg text-catalog-softBrown mb-4">
            Your entertainment catalog is empty.
          </p>
          <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal">
            <Link to="/create/entertainment">
              <PlusCircle size={18} className="mr-2" />
              Add Your First Entertainment Experience
            </Link>
          </Button>
        </div>
      ) : activeCategories.length === 0 ? (
        <div className="text-center py-12 bg-catalog-cream rounded-lg border border-catalog-softBrown/30 shadow-md">
          <p className="text-lg text-catalog-softBrown mb-4">
            No matching entertainment entries found.
          </p>
          <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal">
            <Link to="/create/entertainment">
              <PlusCircle size={18} className="mr-2" />
              Add New Entertainment Experience
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="flex justify-center items-center pb-4">
            <h2 className="text-xl font-medium text-[#1EAEDB] font-typewriter">Categories</h2>
          </div>
          
          {categoryPairs.map((pair, pairIndex) => (
            <div key={`pair-${pairIndex}`} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {pair.map((category) => {
                const categoryColor = categoryColors[category] || "#d2b48c";
                const textColor = getTextColor(categoryColor);
                const isOpen = openCatalogs.includes(category);
                
                const categoryCards = cardsByCategory[category] || [];
                if (categoryCards.length === 0) {
                  return null;
                }
                
                return (
                  <EntertainmentCategoryDrawer
                    key={category}
                    category={category}
                    cards={categoryCards}
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

      <Dialog open={isSearchResultsOpen} onOpenChange={setIsSearchResultsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Search Results</DialogTitle>
            <DialogDescription>
              Found {searchResults.length} matching items
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {searchResults.map(card => {
              const category = card.entertainmentCategory?.toLowerCase() || 'etc.';
              const categoryColor = categoryColors[category] || "#d2b48c";
              
              return (
                <div 
                  key={card.id}
                  className="cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => handleSearchResultCardClick(card)}
                >
                  <Envelope 
                    label={card.title}
                    backgroundColor={categoryColor}
                  >
                    <CatalogCard card={card} />
                  </Envelope>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline"
              onClick={() => {
                setIsSearchResultsOpen(false);
                navigate('/blockbusters', { replace: true });
              }}
            >
              Close Results
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <EntertainmentDetailDialog
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

export default BlockbustersPage;

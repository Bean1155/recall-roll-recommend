
import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { Button } from "@/components/ui/button";
import { FoodCard, FoodCategory } from "@/lib/types";
import { getCardsByType } from "@/lib/data";
import { useUser } from "@/contexts/UserContext";
import { PlusCircle, X } from "lucide-react";
import GridLayout from "@/components/GridLayout";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import CatalogSearch from "@/components/CatalogSearch";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  CatalogCollapsible
} from "@/components/ui/collapsible";

const allCategories: FoodCategory[] = [
  "cafe", "diner", "specialty food", "fine dining", "take out", 
  "bakery", "bar", "food truck", "event space", "restaurant", "other"
];

const sortedCategories: FoodCategory[] = [...allCategories]
  .filter(category => category !== "other" as FoodCategory)
  .sort((a, b) => a.localeCompare(b));

sortedCategories.push("other");

const categoryColors: Record<FoodCategory, string> = {
  "cafe": "#f5c4d3",
  "diner": "#e0c5c1",
  "specialty food": "#ddb892",
  "fine dining": "#e9b44c",
  "take out": "#c1cc99",
  "bakery": "#9de0d0",
  "bar": "#a5b1c2",
  "food truck": "#a64b2a",
  "event space": "#ff6b45",
  "restaurant": "#e18336",
  "other": "#da7f5d",
};

const extraColors = [
  "#cc7f43",
  "#d35843",
  "#4d583c",
  "#8c9e5e",
  "#358f8f",
  "#6b798e",
  "#2f5d60",
  "#1a535c",
  "#4a3f35",
  "#232e33",
];

const getCategoryDisplayName = (category: string): string => {
  const customDisplayNames: Record<string, string> = {
    "cafe": "Cafés",
    "diner": "Diners",
    "specialty food": "Specialty Foods",
    "fine dining": "Fine Dining",
    "take out": "Take-Out",
    "bakery": "Bakeries",
    "bar": "Bars",
    "food truck": "Food Trucks",
    "event space": "Event Spaces",
    "restaurant": "Restaurants",
    "other": "Other Places"
  };

  return customDisplayNames[category] || 
    category
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

const BitesPage = () => {
  const [foodCards, setFoodCards] = useState<FoodCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<FoodCard[]>([]);
  const [initialAccordionValues, setInitialAccordionValues] = useState<string[]>([sortedCategories[0]]);
  const [selectedCard, setSelectedCard] = useState<FoodCard | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<FoodCard[]>([]);
  const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(false);
  const [openCatalogs, setOpenCatalogs] = useState<string[]>([]);
  const { userName } = useUser();
  const isMobile = useIsMobile();
  const location = useLocation();
  const { toast } = useToast();
  const highlightedCardRef = useRef<HTMLDivElement>(null);
  
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

  const cardsByCategory: Record<string, FoodCard[]> = {};
  
  allCategories.forEach(category => {
    cardsByCategory[category] = [];
  });
  
  filteredCards.forEach(card => {
    if (cardsByCategory[card.category]) {
      cardsByCategory[card.category].push(card);
    }
  });

  const categoryPairs = [];
  for (let i = 0; i < sortedCategories.length; i += 2) {
    const pair = [sortedCategories[i]];
    if (i + 1 < sortedCategories.length) {
      pair.push(sortedCategories[i + 1]);
    }
    categoryPairs.push(pair);
  }

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
          {categoryPairs.map((pair, pairIndex) => (
            <div key={`pair-${pairIndex}`} className="grid grid-cols-2 gap-4 sm:gap-6">
              {pair.map((category) => {
                const categoryColor = categoryColors[category] || "#d2b48c";
                const textColor = getTextColor(categoryColor);
                const hasCards = cardsByCategory[category].length > 0;
                const isOpen = openCatalogs.includes(category);
                
                return (
                  <div key={category} className="w-full">
                    <CatalogCollapsible
                      label={getCategoryDisplayName(category)}
                      backgroundColor={categoryColor}
                      textColor={textColor}
                      open={isOpen}
                      onOpenChange={(open) => handleCatalogToggle(category, open)}
                    >
                      {hasCards ? (
                        <Carousel className="w-full">
                          <CarouselContent>
                            {cardsByCategory[category].map((card) => (
                              <CarouselItem key={card.id} className="basis-full">
                                <div 
                                  className="p-1" 
                                  id={`card-${card.id}`}
                                  ref={location.search.includes(`highlight=${card.id}`) ? highlightedCardRef : null}
                                >
                                  <Envelope 
                                    label={card.title}
                                    backgroundColor={categoryColor}
                                  >
                                    <CatalogCard card={card} />
                                  </Envelope>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <div className="flex justify-end gap-2 mt-4">
                            <CarouselPrevious 
                              className="relative static translate-y-0 h-6 w-6 sm:h-8 sm:w-8" 
                              style={{ backgroundColor: categoryColor, color: textColor }}
                            />
                            <CarouselNext 
                              className="relative static translate-y-0 h-6 w-6 sm:h-8 sm:w-8" 
                              style={{ backgroundColor: categoryColor, color: textColor }}
                            />
                          </div>
                        </Carousel>
                      ) : (
                        <div className="text-center py-4 sm:py-8">
                          <p className="text-catalog-softBrown mb-4 text-sm sm:text-base">No entries in this category yet.</p>
                          <Button asChild 
                            className="text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4 h-auto" 
                            style={{ backgroundColor: categoryColor, color: textColor }}
                          >
                            <Link to={`/create/food?category=${category}`}>
                              <PlusCircle size={12} className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="truncate">Add {getCategoryDisplayName(category)}</span>
                            </Link>
                          </Button>
                        </div>
                      )}
                    </CatalogCollapsible>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Search Results Dialog */}
      <Dialog open={isSearchResultsOpen} onOpenChange={setIsSearchResultsOpen}>
        <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
        <DialogContent 
          className="sm:max-w-[700px] p-4 border-2 border-catalog-softBrown rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: "#f8f8f8" }}
        >
          <DialogTitle className="text-xl font-typewriter text-catalog-teal">
            Search Results
          </DialogTitle>
          <DialogDescription className="text-sm text-catalog-softBrown mb-4">
            We found {searchResults.length} matches. Click on a card to view details.
          </DialogDescription>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            {searchResults.map((card) => (
              <div 
                key={card.id}
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleSearchResultCardClick(card)}
              >
                <Envelope 
                  label={card.title}
                  backgroundColor={categoryColors[card.category]}
                >
                  <CatalogCard card={card} showActions={false} />
                </Envelope>
              </div>
            ))}
          </div>
          
          <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-md hover:bg-gray-100">
            <X size={18} />
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Individual Card Modal */}
      <Dialog open={isCardModalOpen} onOpenChange={setIsCardModalOpen}>
        <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
        <DialogContent 
          className="sm:max-w-[600px] p-0 border-2 border-catalog-softBrown rounded-xl overflow-hidden max-h-[90vh]"
          style={{ backgroundColor: selectedCard ? categoryColors[selectedCard.category] : "#f8f8f8" }}
        >
          <DialogTitle className="sr-only">Card Details</DialogTitle>
          <div className="relative">
            <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-md hover:bg-gray-100">
              <X size={18} />
            </DialogClose>
            
            {selectedCard && (
              <div className="p-6 animate-fade-in">
                <Envelope label={selectedCard.title} backgroundColor={categoryColors[selectedCard.category]}>
                  <CatalogCard card={selectedCard} />
                </Envelope>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
        
        .catalog-drawer {
          transition: transform 0.3s ease-in-out;
        }
        
        .catalog-drawer .catalog-drawer-front {
          cursor: pointer;
        }
        
        .catalog-drawer:hover .catalog-drawer-front {
          transform: translateY(8px) !important;
          box-shadow: 0 3px 8px rgba(0,0,0,0.1) !important;
        }
        
        .border-3 {
          border-width: 3px;
        }
        
        .catalog-drawer-front {
          will-change: transform;
        }
      `}</style>
    </GridLayout>
  );
};

export default BitesPage;

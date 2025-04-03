import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { Button } from "@/components/ui/button";
import { EntertainmentCard } from "@/lib/types";
import { getCardsByType } from "@/lib/data";
import { PlusCircle } from "lucide-react";
import GridLayout from "@/components/GridLayout";
import { useUser } from "@/contexts/UserContext";
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
import CatalogSearch from "@/components/CatalogSearch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ShareOptions from "@/components/ShareOptions";
import { toast } from "@/components/ui/use-toast";

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
  const { userName } = useUser();
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null);
  const [showSearchResultsDialog, setShowSearchResultsDialog] = useState(false);
  const [searchResults, setSearchResults] = useState<EntertainmentCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<EntertainmentCard | null>(null);
  const [showCardDialog, setShowCardDialog] = useState(false);
  const accordionRefs = useRef<Record<string, HTMLElement | null>>({});
  
  useEffect(() => {
    const cards = getCardsByType('entertainment') as EntertainmentCard[];
    setEntertainmentCards(cards);
    setFilteredCards(cards);
    
    const searchParams = new URLSearchParams(location.search);
    const highlight = searchParams.get('highlight');
    const category = searchParams.get('category');
    const fromSearch = searchParams.get('fromSearch') === 'true';
    const searchResultsParam = searchParams.get('searchResults');
    
    if (searchResultsParam) {
      const resultIds = searchResultsParam.split(',');
      const results = cards.filter(card => resultIds.includes(card.id));
      if (results.length > 0) {
        setSearchResults(results);
        setShowSearchResultsDialog(true);
      }
    } else if (highlight) {
      const card = cards.find(c => c.id === highlight);
      if (card) {
        if (fromSearch) {
          setSelectedCard(card);
          setShowCardDialog(true);
        } else {
          const category = card.entertainmentCategory?.toLowerCase() || 'etc.';
          setOpenCategories([category]);
          setHighlightedCardId(card.id);
          setTimeout(() => {
            if (accordionRefs.current[category]) {
              accordionRefs.current[category]?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          }, 300);
        }
      }
    } else if (category) {
      setOpenCategories([category.toLowerCase()]);
    } else if (cards.length > 0) {
      for (const category of allCategories) {
        const hasCards = cards.some(c => 
          (c.entertainmentCategory?.toLowerCase() || 'etc.') === category
        );
        if (hasCards) {
          setOpenCategories([category]);
          break;
        }
      }
    }
  }, [location.search]);
  
  const cardsByCategory: Record<string, EntertainmentCard[]> = {};
  
  allCategories.forEach(category => {
    cardsByCategory[category] = [];
  });
  
  filteredCards.forEach(card => {
    const category = card.entertainmentCategory?.toLowerCase() || 'etc.';
    if (cardsByCategory[category]) {
      cardsByCategory[category].push(card);
    } else {
      cardsByCategory['etc.'].push(card);
    }
  });

  const handleFilteredItemsChange = (items: EntertainmentCard[]) => {
    setFilteredCards(items);
  };
  
  const handleAccordionChange = (value: string[]) => {
    setOpenCategories(value);
  };
  
  const handleCardClick = (card: EntertainmentCard) => {
    setSelectedCard(card);
    setShowCardDialog(true);
  };
  
  const handleSearchResultClick = (card: EntertainmentCard) => {
    setShowSearchResultsDialog(false);
    setSelectedCard(card);
    setShowCardDialog(true);
  };
  
  const handleCloseSearchResults = () => {
    setShowSearchResultsDialog(false);
    const newUrl = location.pathname;
    navigate(newUrl, { replace: true });
  };

  return (
    <GridLayout>
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="catalog-title text-3xl">
          From the Library of <span className="font-typewriter font-bold text-black">{userName}</span>
        </h1>
        <div className="flex flex-wrap gap-2">
          <div>
            <CatalogSearch 
              items={entertainmentCards} 
              onFilteredItemsChange={handleFilteredItemsChange}
              type="entertainment"
            />
          </div>
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
      ) : (
        <div className="space-y-6">
          <Accordion 
            type="multiple" 
            value={openCategories} 
            onValueChange={handleAccordionChange}
            className="w-full"
          >
            {allCategories.map((category) => {
              const categoryColor = categoryColors[category] || "#d2b48c";
              const textColor = getTextColor(categoryColor);
              const hasCards = cardsByCategory[category].length > 0;
              
              return (
                <AccordionItem 
                  key={category} 
                  value={category}
                  ref={el => accordionRefs.current[category] = el}
                >
                  <div 
                    style={{ backgroundColor: categoryColor, borderRadius: "0.5rem 0.5rem 0 0" }}
                    className="transition-colors duration-150"
                  >
                    <AccordionTrigger 
                      className="px-6 py-6 font-typewriter font-semibold text-lg"
                      style={{ color: textColor }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <span>{getCategoryDisplayName(category)}</span>
                          {!hasCards && (
                            <span className="text-sm opacity-70 font-normal">(No entries yet)</span>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                  </div>
                  
                  <AccordionContent 
                    className="bg-white border border-t-0 rounded-b-lg"
                    style={{ borderColor: categoryColor }}
                  >
                    {hasCards ? (
                      <Carousel className="w-full">
                        <CarouselContent>
                          {cardsByCategory[category].map((card) => (
                            <CarouselItem 
                              key={card.id} 
                              className={isMobile ? "basis-full" : "md:basis-1/2 lg:basis-1/3"}
                            >
                              <div 
                                className={`p-1 ${highlightedCardId === card.id ? 'animate-pulse' : ''}`}
                                onClick={() => handleCardClick(card)}
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
                            className="relative static translate-y-0" 
                            style={{ backgroundColor: categoryColor, color: textColor }}
                          />
                          <CarouselNext 
                            className="relative static translate-y-0" 
                            style={{ backgroundColor: categoryColor, color: textColor }}
                          />
                        </div>
                      </Carousel>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-catalog-softBrown mb-4">No entries in this category yet.</p>
                        <Button asChild style={{ backgroundColor: categoryColor, color: textColor }}>
                          <Link to={`/create/entertainment?category=${category}`}>
                            <PlusCircle size={16} className="mr-2" />
                            Add {getCategoryDisplayName(category)} Experience
                          </Link>
                        </Button>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}
      
      <Dialog open={showSearchResultsDialog} onOpenChange={setShowSearchResultsDialog}>
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
                  onClick={() => handleSearchResultClick(card)}
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
              onClick={handleCloseSearchResults}
            >
              Close Results
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showCardDialog} onOpenChange={setShowCardDialog}>
        <DialogContent className="sm:max-w-lg">
          {selectedCard && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCard.title}</DialogTitle>
                <DialogDescription>
                  {selectedCard.creator} • {selectedCard.entertainmentCategory}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4">
                <CatalogCard card={selectedCard} />
              </div>
              
              <div className="flex flex-wrap justify-between mt-4 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowCardDialog(false);
                    navigate('/blockbusters', { replace: true });
                  }}
                >
                  Close
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Card location saved",
                        description: "Direct link copied to clipboard"
                      });
                      const url = `${window.location.origin}/blockbusters?highlight=${selectedCard.id}&fromSearch=true`;
                      navigator.clipboard.writeText(url);
                    }}
                  >
                    Copy Direct Link
                  </Button>
                  
                  <ShareOptions 
                    card={selectedCard} 
                    variant="dialog" 
                    mode="external"
                  />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </GridLayout>
  );
};

export default BlockbustersPage;

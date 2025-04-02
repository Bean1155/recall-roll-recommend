import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { Button } from "@/components/ui/button";
import { FoodCard, FoodCategory } from "@/lib/types";
import { getCardsByType } from "@/lib/data";
import { useUser } from "@/contexts/UserContext";
import { PlusCircle } from "lucide-react";
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

const allCategories: FoodCategory[] = [
  "cafe", "diner", "specialty foods", "fine dining", "take out", 
  "bakeries", "bars", "food trucks", "large event space", "restaurant", "etc."
];

const categoryColors: Record<FoodCategory, string> = {
  "cafe": "#f5c4d3",
  "diner": "#e0c5c1",
  "specialty foods": "#ddb892",
  "fine dining": "#e9b44c",
  "take out": "#c1cc99",
  "bakeries": "#9de0d0",
  "bars": "#a5b1c2",
  "food trucks": "#a64b2a",
  "large event space": "#ff6b45",
  "restaurant": "#e18336",
  "etc.": "#da7f5d",
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

const BitesPage = () => {
  const [foodCards, setFoodCards] = useState<FoodCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<FoodCard[]>([]);
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
    
    if (highlightId) {
      const cardToHighlight = cards.find(card => card.id === highlightId);
      
      if (cardToHighlight) {
        const category = cardToHighlight.category;
        
        setTimeout(() => {
          const accordionItem = document.querySelector(`[data-value="${category}"]`);
          if (accordionItem) {
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
  }, [location.search, toast]);

  const handleFilteredItemsChange = (items: FoodCard[]) => {
    setFilteredCards(items);
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
          
          <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal">
            <Link to="/create/food">
              <PlusCircle size={18} className="mr-2" />
              Add New Bite
            </Link>
          </Button>
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
        <div className="space-y-6">
          <Accordion type="multiple" defaultValue={[allCategories[0]]} className="w-full">
            {allCategories.map((category) => {
              const categoryColor = categoryColors[category] || "#d2b48c";
              const textColor = getTextColor(categoryColor);
              const hasCards = cardsByCategory[category].length > 0;
              
              return (
                <AccordionItem 
                  key={category} 
                  value={category}
                >
                  <div 
                    style={{ backgroundColor: categoryColor, borderRadius: "0.5rem 0.5rem 0 0" }}
                    className="transition-colors duration-150"
                  >
                    <AccordionTrigger 
                      className="px-6 py-6 font-typewriter font-semibold text-lg"
                      style={{ color: textColor }}
                      data-value={category}
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
                            <CarouselItem key={card.id} className={isMobile ? "basis-full" : "md:basis-1/2 lg:basis-1/3"}>
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
                          <Link to={`/create/food?category=${category}`}>
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
      `}</style>
    </GridLayout>
  );
};

export default BitesPage;

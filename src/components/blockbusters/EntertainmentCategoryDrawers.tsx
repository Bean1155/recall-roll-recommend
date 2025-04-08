
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { EntertainmentCard } from "@/lib/types";
import { CatalogCollapsible } from "@/components/ui/collapsible";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface EntertainmentCategoryDrawersProps {
  cards: EntertainmentCard[];
  categoryColors?: Record<string, string>;
  onCardClick?: (card: EntertainmentCard) => void;
  defaultOpenCategory?: string;
  hideEmptyCategories?: boolean;
  startCollapsed?: boolean;
}

const EntertainmentCategoryDrawers = ({
  cards,
  categoryColors = {},
  onCardClick,
  defaultOpenCategory,
  hideEmptyCategories = true,
  startCollapsed = false
}: EntertainmentCategoryDrawersProps) => {
  const [categorizedCards, setCategorizedCards] = useState<Record<string, EntertainmentCard[]>>({});
  const [openCategory, setOpenCategory] = useState<string | null>(
    startCollapsed ? null : defaultOpenCategory || null
  );
  
  // Helper function to get a readable display name for categories
  const getCategoryDisplayName = (category: string): string => {
    const customDisplayNames: Record<string, string> = {
      "movies": "Movies",
      "tv shows": "TV Shows",
      "books": "Books",
      "comedies": "Comedies",
      "podcasts": "Podcasts",
      "games": "Games",
      "live performances": "Live Performances",
      "events": "Events"
    };

    return customDisplayNames[category.toLowerCase()] || 
      category
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  };
  
  useEffect(() => {
    if (!cards || cards.length === 0) {
      setCategorizedCards({});
      return;
    }
    
    const grouped = cards.reduce((acc: Record<string, EntertainmentCard[]>, card) => {
      const cardCategory = card.entertainmentCategory?.toLowerCase() || 'etc.';
      if (!acc[cardCategory]) {
        acc[cardCategory] = [];
      }
      acc[cardCategory].push(card);
      return acc;
    }, {});
    
    setCategorizedCards(grouped);
    
    if (!startCollapsed && !openCategory) {
      const firstCategoryWithCards = Object.entries(grouped)
        .find(([_, catCards]) => catCards.length > 0)?.[0];
      
      if (firstCategoryWithCards) {
        setOpenCategory(firstCategoryWithCards);
      }
    } else if (defaultOpenCategory && grouped[defaultOpenCategory]) {
      setOpenCategory(defaultOpenCategory);
    }
  }, [cards, defaultOpenCategory, startCollapsed]);

  const handleOpenChange = (cat: string, isOpen: boolean) => {
    setOpenCategory(isOpen ? cat : null);
  };

  // Get text color based on background color brightness
  const getTextColor = (backgroundColor: string): string => {
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    return brightness > 145 ? "#603913" : "#ffffff";
  };
  
  const renderCards = (cat: string, catCards: EntertainmentCard[], color: string, textColor: string) => {
    if (catCards.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-catalog-softBrown mb-4">No entries in this category yet.</p>
          <Button asChild 
            className="text-sm py-2 px-4 h-auto" 
            style={{ backgroundColor: color, color: textColor }}
          >
            <Link to={`/create/entertainment?category=${cat}`}>
              <PlusCircle size={16} className="mr-2" />
              <span>Add {getCategoryDisplayName(cat)}</span>
            </Link>
          </Button>
        </div>
      );
    }
    
    return (
      <Carousel className="w-full">
        <CarouselContent>
          {catCards.map(card => (
            <CarouselItem key={card.id} className="basis-full">
              <div 
                className="catalog-card cursor-pointer p-1"
                onClick={() => onCardClick?.(card)}
                id={`card-${card.id}`}
              >
                <Envelope
                  label={card.title}
                  backgroundColor={color}
                >
                  <CatalogCard card={card} />
                </Envelope>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-end gap-2 mt-4">
          <CarouselPrevious 
            className="relative static translate-y-0 h-8 w-8" 
            style={{ backgroundColor: color, color: textColor }}
          />
          <CarouselNext 
            className="relative static translate-y-0 h-8 w-8" 
            style={{ backgroundColor: color, color: textColor }}
          />
        </div>
      </Carousel>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {Object.entries(categorizedCards).map(([cat, catCards]) => {
        if (catCards.length === 0 && hideEmptyCategories) {
          return null;
        }
        
        const color = categoryColors[cat] || '#d2b48c';
        const displayName = getCategoryDisplayName(cat);
        const textColor = getTextColor(color);
        
        return (
          <CatalogCollapsible
            key={cat}
            label={displayName}
            backgroundColor={color}
            textColor={textColor}
            open={openCategory === cat}
            onOpenChange={(isOpen) => handleOpenChange(cat, isOpen)}
          >
            {renderCards(cat, catCards, color, textColor)}
          </CatalogCollapsible>
        );
      })}
    </div>
  );
};

export default EntertainmentCategoryDrawers;

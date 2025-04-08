
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { EntertainmentCard } from "@/lib/types";
import { CatalogCollapsible } from "@/components/ui/collapsible";
import { getCategoryDisplayName, getTextColor } from "@/utils/categoryUtils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { toast } from "sonner";

interface EntertainmentCategoryDrawersProps {
  cards: EntertainmentCard[];
  categoryColors?: Record<string, string>;
  onCardClick?: (card: EntertainmentCard) => void;
  defaultOpenCategory?: string;
  hideEmptyCategories?: boolean;
  startCollapsed?: boolean;
  openCategory?: string | null;
  onCategoryToggle?: (category: string, isOpen: boolean) => void;
}

const EntertainmentCategoryDrawers = ({
  cards,
  categoryColors = {},
  onCardClick,
  defaultOpenCategory,
  hideEmptyCategories = true,
  startCollapsed = false,
  openCategory,
  onCategoryToggle
}: EntertainmentCategoryDrawersProps) => {
  const [categorizedCards, setCategorizedCards] = useState<Record<string, EntertainmentCard[]>>({});
  
  useEffect(() => {
    if (!cards || cards.length === 0) {
      setCategorizedCards({});
      return;
    }
    
    const grouped = cards.reduce((acc: Record<string, EntertainmentCard[]>, card) => {
      // Normalize category to lowercase for consistent mapping and ensure it's never undefined
      const cardCategory = card.entertainmentCategory?.toLowerCase() || 'etc.';
      if (!acc[cardCategory]) {
        acc[cardCategory] = [];
      }
      acc[cardCategory].push(card);
      return acc;
    }, {});
    
    setCategorizedCards(grouped);
  }, [cards]);

  // Handle when a collapsible changes state
  const handleOpenChange = (cat: string, isOpen: boolean) => {
    console.log(`EntertainmentCategoryDrawers: Category ${cat} toggle called with isOpen=${isOpen}`);
    
    if (onCategoryToggle) {
      onCategoryToggle(cat, isOpen);
    }
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
        if (hideEmptyCategories && catCards.length === 0) {
          return null;
        }
        
        // Get color from categoryColors or use default
        const color = categoryColors[cat] || '#d2b48c';
        // Get proper display name for the category
        const displayName = getCategoryDisplayName(cat);
        // Get text color based on background color
        const textColor = getTextColor(color);
        
        const isOpen = openCategory === cat;
        console.log(`EntertainmentCategoryDrawers: Rendering category "${cat}" with displayName="${displayName}", isOpen=${isOpen}`);
        
        return (
          <div key={cat} className="mb-6" data-category={cat}>
            <CatalogCollapsible
              label={cat}
              categoryName={displayName}
              backgroundColor={color}
              textColor={textColor}
              open={isOpen}
              onOpenChange={(isOpen) => handleOpenChange(cat, isOpen)}
            >
              {renderCards(cat, catCards, color, textColor)}
            </CatalogCollapsible>
          </div>
        );
      })}
      
      {Object.keys(categorizedCards).length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No entertainment cards found.</p>
          <Button asChild>
            <Link to="/create/entertainment">
              <PlusCircle size={16} className="mr-2" />
              Add Your First Entertainment
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default EntertainmentCategoryDrawers;

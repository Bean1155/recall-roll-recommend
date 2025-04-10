import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { EntertainmentCard, CatalogCard as CatalogCardType } from "@/lib/types";
import { CatalogCollapsible } from "@/components/ui/collapsible";
import { getCategoryDisplayName, getTextColor } from "@/utils/categoryUtils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Category {
  name: string;
  count: number;
  type?: string;
}

interface EntertainmentCategoryDrawersProps {
  categories?: Category[];
  cards?: CatalogCardType[];
  categoryColors?: Record<string, string>;
  onCardClick?: (card: EntertainmentCard) => void;
  defaultOpenCategory?: string;
  hideEmptyCategories?: boolean;
  startCollapsed?: boolean;
  openCategory?: string | null;
  onCategoryToggle?: (category: string, isOpen: boolean) => void;
}

const EntertainmentCategoryDrawers = ({
  categories = [],
  cards = [],
  categoryColors = {},
  onCardClick,
  defaultOpenCategory,
  hideEmptyCategories = true,
  startCollapsed = false,
  openCategory,
  onCategoryToggle
}: EntertainmentCategoryDrawersProps) => {
  const [categorizedCards, setCategorizedCards] = useState<Record<string, CatalogCardType[]>>({});
  
  useEffect(() => {
    if (!cards || cards.length === 0) {
      setCategorizedCards({});
      return;
    }
    
    const grouped = cards.reduce((acc: Record<string, CatalogCardType[]>, card) => {
      // Normalize category to lowercase for consistent mapping and ensure it's never undefined
      const cardCategory = card.type === 'entertainment' && 'entertainmentType' in card 
        ? card.entertainmentType?.toLowerCase() || 'etc.'
        : 'etc.';
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
   
  const renderCards = (cat: string, catCards: CatalogCardType[], color: string, textColor: string) => {
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
                onClick={() => onCardClick?.(card as EntertainmentCard)}
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
      {categories.map((category) => {
        const cat = typeof category === 'string' ? category : category.name;
        const catCards = categorizedCards[cat.toLowerCase()] || [];

        if (hideEmptyCategories && catCards.length === 0) {
          return null;
        }
        
        // Get color from categoryColors or use default
        const color = categoryColors[cat] || '#d2b48c';
        // Get proper display name for the category
        const displayName = getCategoryDisplayName(cat);
        // Always use black for category names to ensure visibility
        const textColor = "#000000";
        
        const isOpen = openCategory === cat;
        console.log(`EntertainmentCategoryDrawers: Rendering category "${cat}" with displayName="${displayName}", isOpen=${isOpen}, color=${color}`);
        
        // Key directly includes both category and display name to force re-rendering
        const drawerKey = `${cat}-drawer-${displayName}-${isOpen ? 'open' : 'closed'}`;
        
        return (
          <div key={cat} className="mb-6" data-category={cat} data-display-name={displayName}>
            <CatalogCollapsible
              key={drawerKey}
              label={cat}
              categoryName={displayName}
              backgroundColor={color}
              textColor={textColor}
              open={isOpen}
              onOpenChange={(isOpen) => onCategoryToggle?.(cat, isOpen)}
              className="hover:brightness-95 transition-all duration-200"
            >
              {renderCards(cat, catCards, color, textColor)}
            </CatalogCollapsible>
          </div>
        );
      })}
      
      {categories.length === 0 && (
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

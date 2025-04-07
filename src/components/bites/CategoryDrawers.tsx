
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CatalogCard from "@/components/CatalogCard";
import CatalogCardCompact from "@/components/CatalogCardCompact";
import Envelope from "@/components/Envelope";
import { FoodCard, FoodCategory } from "@/lib/types";
import { getCategoryDisplayName, defaultCategories } from "@/utils/categoryUtils";
import { CatalogCollapsible } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CategoryDrawersProps {
  category?: FoodCategory;
  cards: FoodCard[];
  categoryColors?: Record<string, string>;
  onCardClick?: (card: FoodCard) => void;
  defaultOpenCategory?: string;
  hideEmptyCategories?: boolean;
}

const CategoryDrawers = ({
  category,
  cards,
  categoryColors,
  onCardClick,
  defaultOpenCategory,
  hideEmptyCategories = true
}: CategoryDrawersProps) => {
  const [categorizedCards, setCategorizedCards] = useState<Record<string, FoodCard[]>>({});
  const [openCategory, setOpenCategory] = useState<string | null>(defaultOpenCategory || null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!cards || cards.length === 0) {
      setCategorizedCards({});
      return;
    }
    
    if (category) {
      const filteredCards = cards.filter(card => card.category === category);
      setCategorizedCards({ [category]: filteredCards });
      
      if (!openCategory && filteredCards.length > 0) {
        setOpenCategory(category);
      }
      
      return;
    }
    
    const grouped = cards.reduce((acc: Record<string, FoodCard[]>, card) => {
      const cardCategory = card.category || 'other';
      if (!acc[cardCategory]) {
        acc[cardCategory] = [];
      }
      acc[cardCategory].push(card);
      return acc;
    }, {});
    
    if (!hideEmptyCategories) {
      defaultCategories.forEach(cat => {
        if (!grouped[cat]) {
          grouped[cat] = [];
        }
      });
    }
    
    setCategorizedCards(grouped);
    
    if (!openCategory) {
      const firstCategoryWithCards = Object.entries(grouped)
        .find(([_, catCards]) => catCards.length > 0)?.[0];
      
      if (firstCategoryWithCards) {
        setOpenCategory(firstCategoryWithCards);
      }
    }
  }, [cards, category, defaultOpenCategory, hideEmptyCategories]);

  const handleOpenChange = (cat: string, isOpen: boolean) => {
    if (isOpen) {
      setOpenCategory(cat);
    } else if (openCategory === cat) {
      setOpenCategory(null);
    }
  };
  
  const handleCardClick = (card: FoodCard) => {
    if (onCardClick) {
      onCardClick(card);
    } else {
      navigate(`/edit/${card.id}`);
    }
  };
  
  const renderCards = (catCards: FoodCard[], color: string) => {
    if (catCards.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-catalog-softBrown mb-4">No entries in this category yet.</p>
          <Button asChild 
            className="text-sm py-2 px-4 h-auto" 
            style={{ backgroundColor: color, color: '#603913' }}
          >
            <Link to={`/create/food?category=${openCategory}`}>
              <PlusCircle size={16} className="mr-2" />
              <span>Add {getCategoryDisplayName(openCategory || '')}</span>
            </Link>
          </Button>
        </div>
      );
    }
    
    if (catCards.length > 1) {
      return (
        <Carousel className="w-full">
          <CarouselContent>
            {catCards.map(card => (
              <CarouselItem key={card.id} className="basis-full">
                <div 
                  className="catalog-card cursor-pointer p-1"
                  onClick={() => handleCardClick(card)}
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
              style={{ backgroundColor: color, color: '#603913' }}
            />
            <CarouselNext 
              className="relative static translate-y-0 h-8 w-8" 
              style={{ backgroundColor: color, color: '#603913' }}
            />
          </div>
        </Carousel>
      );
    }
    
    return (
      <div className="grid grid-cols-1 gap-4">
        {catCards.map(card => (
          <div 
            key={card.id} 
            className="catalog-card cursor-pointer"
            onClick={() => handleCardClick(card)}
          >
            <Envelope
              label={card.title}
              backgroundColor={color}
            >
              <CatalogCard card={card} />
            </Envelope>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {Object.entries(categorizedCards).map(([cat, catCards]) => {
        if (catCards.length === 0 && (hideEmptyCategories || !defaultCategories.includes(cat as FoodCategory))) {
          return null;
        }
        
        const color = categoryColors?.[cat] || '#d2b48c';
        const displayName = getCategoryDisplayName(cat);
        const textColor = '#603913';
        
        return (
          <CatalogCollapsible
            key={cat}
            label={displayName}
            backgroundColor={color}
            textColor={textColor}
            open={openCategory === cat}
            onOpenChange={(isOpen) => handleOpenChange(cat, isOpen)}
          >
            {renderCards(catCards, color)}
          </CatalogCollapsible>
        );
      })}
    </div>
  );
};

export default CategoryDrawers;

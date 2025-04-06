import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { FoodCard, FoodCategory } from "@/lib/types";
import { getCategoryDisplayName, defaultCategories } from "@/utils/categoryUtils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CategoryCardsDisplayProps {
  category?: FoodCategory;
  cards: FoodCard[];
  categoryColor?: string;
  categoryDisplayName?: string;
  textColor?: string;
  onCardClick?: (card: FoodCard) => void;
  filters?: {
    status: string[];
    rating: number[];
    tags: string[];
  };
  categoryColors?: Record<string, string>;
  onOpenFilters?: () => void;
}

const CategoryCardsDisplay = ({
  category,
  cards,
  categoryColor,
  categoryDisplayName,
  textColor,
  onCardClick,
  filters,
  categoryColors,
  onOpenFilters,
}: CategoryCardsDisplayProps) => {
  const [categorizedCards, setCategorizedCards] = useState<Record<string, FoodCard[]>>({});
  
  useEffect(() => {
    if (!cards || cards.length === 0) {
      setCategorizedCards({});
      return;
    }
    
    if (category) {
      const filteredCards = cards.filter(card => card.category === category);
      setCategorizedCards({ [category]: filteredCards });
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
    
    defaultCategories.forEach(cat => {
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
    });
    
    setCategorizedCards(grouped);
  }, [cards, category]);

  if (category) {
    const hasCards = cards.length > 0;
    return (
      <SingleCategoryDisplay 
        category={category}
        cards={cards}
        categoryColor={categoryColor}
        categoryDisplayName={categoryDisplayName || getCategoryDisplayName(category)}
        textColor={textColor}
        onCardClick={onCardClick}
        hasCards={hasCards}
      />
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(categorizedCards).map(([cat, catCards]) => {
        if (catCards.length === 0 && !defaultCategories.includes(cat as FoodCategory)) {
          return null;
        }
        
        const color = categoryColors?.[cat] || '#d2b48c';
        const displayName = getCategoryDisplayName(cat);
        const catTextColor = textColor || '#603913';
        
        return (
          <div key={cat} className="mb-8">
            <h2 
              className="text-lg sm:text-xl font-semibold mb-3 px-2"
              style={{ color: catTextColor }}
            >
              {displayName}
            </h2>
            <SingleCategoryDisplay 
              category={cat as FoodCategory}
              cards={catCards}
              categoryColor={color}
              categoryDisplayName={displayName}
              textColor={catTextColor}
              onCardClick={onCardClick}
              hasCards={catCards.length > 0}
            />
          </div>
        );
      })}
    </div>
  );
};

const SingleCategoryDisplay = ({ 
  category,
  cards,
  categoryColor,
  categoryDisplayName,
  textColor,
  onCardClick,
  hasCards
}: {
  category: FoodCategory;
  cards: FoodCard[];
  categoryColor?: string;
  categoryDisplayName?: string;
  textColor?: string;
  onCardClick?: (card: FoodCard) => void;
  hasCards: boolean;
}) => {
  return (
    <>
      {hasCards ? (
        <Carousel className="w-full">
          <CarouselContent>
            {cards.map((card) => (
              <CarouselItem key={card.id} className="basis-full">
                <div 
                  className="p-1" 
                  id={`card-${card.id}`}
                  onClick={() => onCardClick?.(card)}
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
              <span className="truncate">Add {categoryDisplayName}</span>
            </Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default CategoryCardsDisplay;


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, ChevronDown, ChevronUp } from "lucide-react";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { FoodCard, FoodCategory } from "@/lib/types";
import { getCategoryDisplayName, defaultCategories } from "@/utils/categoryUtils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

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
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  
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
    
    // Auto-open categories with cards
    const categoriesToOpen = Object.entries(grouped)
      .filter(([_, catCards]) => catCards.length > 0)
      .map(([cat]) => cat);
    
    if (categoriesToOpen.length > 0) {
      setOpenCategories([categoriesToOpen[0]]); // Open just the first category with cards
    }
  }, [cards, category]);

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev => {
      if (prev.includes(cat)) {
        return prev.filter(c => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

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
    <div className="space-y-6">
      {Object.entries(categorizedCards).map(([cat, catCards]) => {
        if (catCards.length === 0 && !defaultCategories.includes(cat as FoodCategory)) {
          return null;
        }
        
        const color = categoryColors?.[cat] || '#d2b48c';
        const displayName = getCategoryDisplayName(cat);
        const catTextColor = textColor || '#603913';
        const isOpen = openCategories.includes(cat);
        
        return (
          <div 
            key={cat} 
            className="catalog-drawer mb-6 border rounded-lg overflow-hidden shadow-md"
            style={{ borderColor: color }}
          >
            <div 
              className="catalog-drawer-header flex justify-between items-center p-3 cursor-pointer"
              style={{ backgroundColor: color, color: catTextColor }}
              onClick={() => toggleCategory(cat)}
            >
              <h2 className="text-lg font-semibold">{displayName}</h2>
              <div className="flex items-center">
                <span className="mr-2 text-sm">
                  {catCards.length} {catCards.length === 1 ? 'item' : 'items'}
                </span>
                {isOpen ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>
            </div>
            
            {isOpen && (
              <div className="catalog-drawer-content p-3 bg-white">
                {catCards.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {catCards.map(card => (
                      <div 
                        key={card.id} 
                        className="catalog-card cursor-pointer"
                        onClick={() => onCardClick?.(card)}
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
                ) : (
                  <div className="text-center py-4">
                    <p className="text-catalog-softBrown mb-4">No entries in this category yet.</p>
                    <Button asChild 
                      className="text-sm py-2 px-4 h-auto" 
                      style={{ backgroundColor: color, color: catTextColor }}
                    >
                      <Link to={`/create/food?category=${cat}`}>
                        <PlusCircle size={16} className="mr-2" />
                        <span>Add {displayName}</span>
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
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
    <div className="border rounded-lg overflow-hidden shadow-md" style={{ borderColor: categoryColor }}>
      <div 
        className="p-3"
        style={{ backgroundColor: categoryColor, color: textColor }}
      >
        <h2 className="text-lg font-semibold">{categoryDisplayName}</h2>
      </div>
      
      <div className="p-3 bg-white">
        {hasCards ? (
          <div className="grid grid-cols-1 gap-4">
            {cards.map((card) => (
              <div 
                key={card.id} 
                className="catalog-card cursor-pointer"
                onClick={() => onCardClick?.(card)}
              >
                <Envelope 
                  label={card.title}
                  backgroundColor={categoryColor}
                >
                  <CatalogCard card={card} />
                </Envelope>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-catalog-softBrown mb-4">No entries in this category yet.</p>
            <Button asChild 
              className="text-sm py-2 px-4 h-auto" 
              style={{ backgroundColor: categoryColor, color: textColor }}
            >
              <Link to={`/create/food?category=${category}`}>
                <PlusCircle size={16} className="mr-2" />
                <span>Add {categoryDisplayName}</span>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryCardsDisplay;

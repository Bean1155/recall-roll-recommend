
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { FoodCard, FoodCategory } from "@/lib/types";
import { getCategoryDisplayName, defaultCategories } from "@/utils/categoryUtils";
import { CatalogCollapsible } from "@/components/ui/collapsible";

interface CategoryDrawersProps {
  category?: FoodCategory;
  cards: FoodCard[];
  categoryColors?: Record<string, string>;
  onCardClick?: (card: FoodCard) => void;
  defaultOpenCategory?: string;
  hideEmptyCategories?: boolean; // New prop to control visibility of empty categories
}

const CategoryDrawers = ({
  category,
  cards,
  categoryColors,
  onCardClick,
  defaultOpenCategory,
  hideEmptyCategories = true // Default to hiding empty categories
}: CategoryDrawersProps) => {
  const [categorizedCards, setCategorizedCards] = useState<Record<string, FoodCard[]>>({});
  const [openCategory, setOpenCategory] = useState<string | null>(defaultOpenCategory || null);
  
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
    
    // Only add default categories if we're not hiding empty categories
    if (!hideEmptyCategories) {
      defaultCategories.forEach(cat => {
        if (!grouped[cat]) {
          grouped[cat] = [];
        }
      });
    }
    
    setCategorizedCards(grouped);
    
    // If no category is open and we have cards, open the first category with cards
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

  return (
    <div className="space-y-2">
      {Object.entries(categorizedCards).map(([cat, catCards]) => {
        // Skip empty categories if hideEmptyCategories is true
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
                  style={{ backgroundColor: color, color: textColor }}
                >
                  <Link to={`/create/food?category=${cat}`}>
                    <PlusCircle size={16} className="mr-2" />
                    <span>Add {displayName}</span>
                  </Link>
                </Button>
              </div>
            )}
          </CatalogCollapsible>
        );
      })}
    </div>
  );
};

export default CategoryDrawers;

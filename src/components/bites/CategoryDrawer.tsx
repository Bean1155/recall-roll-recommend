
import { CatalogCollapsible } from "@/components/ui/collapsible";
import { FoodCard, FoodCategory } from "@/lib/types";
import CategoryCardsDisplay from "./CategoryCardsDisplay";
import { useEffect, useState } from "react";

interface CategoryDrawerProps {
  category?: FoodCategory;
  cards?: FoodCard[];
  backgroundColor?: string;
  textColor?: string;
  categoryDisplayName?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onApplyFilters?: (filterConfig: {
    status: string[];
    rating: number[];
    tags: string[];
  }) => void;
  currentFilters?: {
    status: string[];
    rating: number[];
    tags: string[];
  };
}

const CategoryDrawer = ({
  category,
  cards = [],
  backgroundColor,
  textColor,
  categoryDisplayName,
  isOpen,
  onOpenChange,
  onApplyFilters,
  currentFilters,
}: CategoryDrawerProps) => {
  const [visibleCards, setVisibleCards] = useState<FoodCard[]>([]);

  // Filter cards that match the current category
  useEffect(() => {
    if (category) {
      const filteredCards = cards.filter(card => card.category === category);
      setVisibleCards(filteredCards);
    } else {
      setVisibleCards(cards);
    }
  }, [cards, category]);

  // Only render if there are cards in this category
  if (visibleCards.length === 0 && category) {
    return null;
  }

  return (
    <div className="w-full">
      <CatalogCollapsible
        label={categoryDisplayName || "Category"}
        backgroundColor={backgroundColor}
        textColor={textColor}
        open={isOpen}
        onOpenChange={onOpenChange}
      >
        <CategoryCardsDisplay
          category={category}
          cards={visibleCards}
          categoryColor={backgroundColor}
          categoryDisplayName={categoryDisplayName}
          textColor={textColor}
        />
      </CatalogCollapsible>
    </div>
  );
};

export default CategoryDrawer;

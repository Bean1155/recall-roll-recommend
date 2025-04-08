
import { CatalogCollapsible } from "@/components/ui/collapsible";
import { EntertainmentCard } from "@/lib/types";
import EntertainmentCardsDisplay from "./EntertainmentCardsDisplay";
import { useEffect, useState } from "react";

interface EntertainmentCategoryDrawerProps {
  category?: string;
  cards?: EntertainmentCard[];
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
  startCollapsed?: boolean;
}

const EntertainmentCategoryDrawer = ({
  category,
  cards = [],
  backgroundColor,
  textColor,
  categoryDisplayName,
  isOpen,
  onOpenChange,
  onApplyFilters,
  currentFilters,
  startCollapsed = true,
}: EntertainmentCategoryDrawerProps) => {
  const [visibleCards, setVisibleCards] = useState<EntertainmentCard[]>([]);

  // Debug logging
  useEffect(() => {
    console.log(`EntertainmentCategoryDrawer rendering: category=${category}, displayName=${categoryDisplayName}`);
  }, [category, categoryDisplayName]);

  // Filter cards that match the current category
  useEffect(() => {
    if (category) {
      const filteredCards = cards.filter(card => 
        (card.entertainmentCategory?.toLowerCase() || 'etc.') === category.toLowerCase()
      );
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
        label={category || ""}
        backgroundColor={backgroundColor}
        textColor={textColor}
        open={isOpen}
        onOpenChange={onOpenChange}
        categoryName={categoryDisplayName}
      >
        <EntertainmentCardsDisplay
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

export default EntertainmentCategoryDrawer;

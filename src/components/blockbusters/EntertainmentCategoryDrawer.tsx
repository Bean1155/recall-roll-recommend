
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
}: EntertainmentCategoryDrawerProps) => {
  const [visibleCards, setVisibleCards] = useState<EntertainmentCard[]>([]);

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
        label={categoryDisplayName || "Category"}
        backgroundColor={backgroundColor}
        textColor={textColor}
        open={isOpen}
        onOpenChange={onOpenChange}
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

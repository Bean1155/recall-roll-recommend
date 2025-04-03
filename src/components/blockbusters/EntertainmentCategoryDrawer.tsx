
import { CatalogCollapsible } from "@/components/ui/collapsible";
import { EntertainmentCard } from "@/lib/types";
import EntertainmentCardsDisplay from "./EntertainmentCardsDisplay";
import { useEffect, useState } from "react";

interface EntertainmentCategoryDrawerProps {
  category: string;
  cards: EntertainmentCard[];
  backgroundColor: string;
  textColor: string;
  categoryDisplayName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EntertainmentCategoryDrawer = ({
  category,
  cards,
  backgroundColor,
  textColor,
  categoryDisplayName,
  isOpen,
  onOpenChange,
}: EntertainmentCategoryDrawerProps) => {
  const [visibleCards, setVisibleCards] = useState<EntertainmentCard[]>([]);

  // Filter cards that match the current category
  useEffect(() => {
    const filteredCards = cards.filter(card => 
      (card.entertainmentCategory?.toLowerCase() || 'etc.') === category.toLowerCase()
    );
    setVisibleCards(filteredCards);
  }, [cards, category]);

  // Only render if there are cards in this category
  if (visibleCards.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <CatalogCollapsible
        label={categoryDisplayName}
        backgroundColor={backgroundColor}
        textColor={textColor}
        open={isOpen}
        onOpenChange={(open) => onOpenChange(open)}
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

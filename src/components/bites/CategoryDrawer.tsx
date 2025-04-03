
import { CatalogCollapsible } from "@/components/ui/collapsible";
import { FoodCard, FoodCategory } from "@/lib/types";
import CategoryCardsDisplay from "./CategoryCardsDisplay";

interface CategoryDrawerProps {
  category: FoodCategory;
  cards: FoodCard[];
  backgroundColor: string;
  textColor: string;
  categoryDisplayName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CategoryDrawer = ({
  category,
  cards,
  backgroundColor,
  textColor,
  categoryDisplayName,
  isOpen,
  onOpenChange,
}: CategoryDrawerProps) => {
  return (
    <div className="w-full">
      <CatalogCollapsible
        label={categoryDisplayName}
        backgroundColor={backgroundColor}
        textColor={textColor}
        open={isOpen}
        onOpenChange={(open) => onOpenChange(open)}
      >
        <CategoryCardsDisplay
          category={category}
          cards={cards}
          categoryColor={backgroundColor}
          categoryDisplayName={categoryDisplayName}
          textColor={textColor}
        />
      </CatalogCollapsible>
    </div>
  );
};

export default CategoryDrawer;

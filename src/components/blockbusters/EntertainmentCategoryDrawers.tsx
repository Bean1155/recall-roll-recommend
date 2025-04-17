
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { EntertainmentCard, CatalogCard as CatalogCardType } from "@/lib/types";
import { CatalogCollapsible } from "@/components/ui/collapsible";
import { getCategoryDisplayName, getTextColor } from "@/utils/categoryUtils";
import CatalogCardDisplay from "@/components/catalog/CatalogCardDisplay";

interface Category {
  name: string;
  count: number;
  type?: string;
}

interface EntertainmentCategoryDrawersProps {
  categories?: Category[] | string[];
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
      // Group by entertainmentType instead of entertainmentCategory
      const cardCategory = card.type === 'entertainment' && 'entertainmentType' in card 
        ? (card.entertainmentType && typeof card.entertainmentType === 'string' 
            ? card.entertainmentType.toLowerCase() 
            : 'etc.')
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
              <CatalogCardDisplay 
                cards={catCards}
                categoryName={cat}
                categoryDisplayName={displayName}
                categoryColor={color}
                textColor={textColor}
                type="entertainment"
                onCardClick={onCardClick}
                compact={true}
                createPath={`/create/entertainment?category=${cat}`}
              />
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

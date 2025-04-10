
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Utensils, Film, Tv, Book, Music, Gamepad, Map } from "lucide-react";

// Category type mapping object for consistent display
const categoryTypeIcons: Record<string, React.ReactNode> = {
  "Restaurant": <Utensils className="h-4 w-4" />,
  "Café": <Utensils className="h-4 w-4" />,
  "Food Truck": <Utensils className="h-4 w-4" />,
  "Bakery": <Utensils className="h-4 w-4" />,
  "Bar": <Utensils className="h-4 w-4" />,
  "Ice Cream": <Utensils className="h-4 w-4" />,
  "Movie": <Film className="h-4 w-4" />,
  "TV Show": <Tv className="h-4 w-4" />,
  "Book": <Book className="h-4 w-4" />,
  "Video Game": <Gamepad className="h-4 w-4" />,
  "Music": <Music className="h-4 w-4" />,
  "Travel": <Map className="h-4 w-4" />,
};

interface Category {
  name: string;
  count: number;
  type?: string;
}

interface CategoryFiltersProps {
  categories: Category[];
  categoryFilter: string | null;
  onCategoryFilterClick: (categoryName: string) => void;
  getColorForCategory: (categoryName: string) => string;
  filteredCards: any[];
  type: 'food' | 'entertainment';
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  categories,
  categoryFilter,
  onCategoryFilterClick,
  getColorForCategory,
  filteredCards,
  type
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map(category => (
        <Badge
          key={category.name}
          className={`cursor-pointer flex items-center gap-1 px-3 py-1 ${
            categoryFilter === category.name
              ? 'bg-catalog-teal text-white hover:bg-catalog-darkTeal'
              : `hover:bg-catalog-softBrown/20`
          }`}
          style={{
            backgroundColor: categoryFilter === category.name 
              ? undefined
              : getColorForCategory(category.name),
            color: categoryFilter === category.name 
              ? undefined 
              : '#ffffff'
          }}
          onClick={() => onCategoryFilterClick(category.name)}
        >
          {categoryTypeIcons[category.name] || 
            (type === 'food' ? <Utensils className="h-4 w-4" /> : <Film className="h-4 w-4" />)
          }
          {category.name} ({
            filteredCards.filter(card => 
              type === 'food' 
                ? card.type === 'food' && card.category === category.name
                : card.type === 'entertainment' && card.entertainmentType === category.name
            ).length
          })
        </Badge>
      ))}
    </div>
  );
};

export default CategoryFilters;

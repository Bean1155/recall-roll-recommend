
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Utensils, Film, Tv, Book, Music, Gamepad, Map, ChefHat, Coffee, Beer, IceCream } from "lucide-react";

// Category type mapping object for consistent display
const categoryTypeIcons: Record<string, React.ReactNode> = {
  "restaurant": <Utensils className="h-4 w-4" />,
  "café": <Coffee className="h-4 w-4" />,
  "cafe": <Coffee className="h-4 w-4" />,
  "food truck": <Utensils className="h-4 w-4" />,
  "bakery": <ChefHat className="h-4 w-4" />,
  "bar": <Beer className="h-4 w-4" />,
  "ice cream": <IceCream className="h-4 w-4" />,
  "movies": <Film className="h-4 w-4" />,
  "tv shows": <Tv className="h-4 w-4" />,
  "books": <Book className="h-4 w-4" />,
  "games": <Gamepad className="h-4 w-4" />,
  "music": <Music className="h-4 w-4" />,
  "podcasts": <Tv className="h-4 w-4" />,
  "travel": <Map className="h-4 w-4" />,
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
  className?: string;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  categories,
  categoryFilter,
  onCategoryFilterClick,
  getColorForCategory,
  filteredCards,
  type,
  className = ""
}) => {
  const getCategoryCount = (categoryName: string) => {
    return filteredCards.filter(card => 
      type === 'food' 
        ? card.type === 'food' && card.category === categoryName
        : card.type === 'entertainment' && card.entertainmentType === categoryName
    ).length;
  };
  
  const getIconForCategory = (categoryName: string) => {
    const lowerCaseName = categoryName.toLowerCase();
    return categoryTypeIcons[lowerCaseName] || 
      (type === 'food' ? <Utensils className="h-4 w-4" /> : <Film className="h-4 w-4" />);
  };
  
  return (
    <div className={`flex flex-wrap gap-2 justify-center ${className}`}>
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
          {getIconForCategory(category.name)}
          {category.name} ({getCategoryCount(category.name)})
        </Badge>
      ))}
    </div>
  );
};

export default CategoryFilters;

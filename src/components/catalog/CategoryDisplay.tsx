
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getCategoryDisplayName } from "@/utils/categoryUtils";
import { CatalogCard } from "@/lib/types";
import { Utensils, Film, ChefHat, MapPin, Star, FileText, Heart, Music, Tv, Book, Gamepad } from "lucide-react";
import CatalogCardDisplay from "./CatalogCardDisplay";

interface CategoryDisplayProps {
  categories: string[];
  cardsByCategory: Record<string, CatalogCard[]>;
  colorForCategory: (categoryName: string) => string;
  type: 'food' | 'entertainment';
}

// Shared icons map for both food and entertainment
const categoryIcons: Record<string, React.ReactNode> = {
  // Food icons
  "restaurant": <Utensils className="h-5 w-5 text-white" />,
  "bakery": <ChefHat className="h-5 w-5 text-white" />,
  "cafe": <Utensils className="h-5 w-5 text-white" />,
  "bar": <Utensils className="h-5 w-5 text-white" />,
  "food truck": <Utensils className="h-5 w-5 text-white" />,
  "location": <MapPin className="h-5 w-5 text-white" />,
  "top rated": <Star className="h-5 w-5 text-white" />,
  "favorites": <Heart className="h-5 w-5 text-white" />,
  
  // Entertainment icons
  "movies": <Film className="h-5 w-5 text-white" />,
  "tv shows": <Tv className="h-5 w-5 text-white" />,
  "books": <Book className="h-5 w-5 text-white" />,
  "games": <Gamepad className="h-5 w-5 text-white" />,
  "music": <Music className="h-5 w-5 text-white" />,
  "podcasts": <FileText className="h-5 w-5 text-white" />,
};

const CategoryDisplay: React.FC<CategoryDisplayProps> = ({
  categories,
  cardsByCategory,
  colorForCategory,
  type
}) => {
  return (
    <div className="space-y-8">
      {categories.map(category => {
        const cards = cardsByCategory[category] || [];
        const bgColor = colorForCategory(category);
        const displayName = getCategoryDisplayName(category);
        const iconKey = category.toLowerCase();
        const icon = categoryIcons[iconKey] || (type === 'food' ? <Utensils className="h-5 w-5 text-white" /> : <Film className="h-5 w-5 text-white" />);
        
        return (
          <Card key={category} className="overflow-hidden border-0 shadow-md">
            <CardHeader 
              className="p-4 text-white font-bold flex items-center gap-2"
              style={{ backgroundColor: bgColor }}
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                {icon}
              </div>
              <span>{displayName} ({cards.length})</span>
            </CardHeader>
            <CardContent className="p-4">
              <CatalogCardDisplay 
                cards={cards}
                categoryName={category}
                categoryDisplayName={displayName}
                categoryColor={bgColor}
                type={type}
                compact={true}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CategoryDisplay;

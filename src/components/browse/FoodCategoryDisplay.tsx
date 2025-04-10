
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getCategoryDisplayName } from "@/utils/categoryUtils";
import CatalogCardCompact from "@/components/CatalogCardCompact";
import { Utensils, ChefHat, MapPin, Star, FileText, Heart } from "lucide-react";

interface FoodCategoryDisplayProps {
  foodCategories: string[];
  cardsByCategory: Record<string, any[]>;
  colorForCategory: (categoryName: string) => string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  "Cuisine": <ChefHat className="h-5 w-5 text-white" />,
  "Category": <Utensils className="h-5 w-5 text-white" />,
  "Location": <MapPin className="h-5 w-5 text-white" />,
  "Top Rated": <Star className="h-5 w-5 text-white" />,
  "Favorites": <Heart className="h-5 w-5 text-white" />,
  "Recently Added": <Utensils className="h-5 w-5 text-white" />,
  "Status": <FileText className="h-5 w-5 text-white" />
};

const FoodCategoryDisplay: React.FC<FoodCategoryDisplayProps> = ({
  foodCategories,
  cardsByCategory,
  colorForCategory
}) => {
  return (
    <div className="space-y-8">
      {foodCategories.map(category => {
        const cards = cardsByCategory[category] || [];
        const bgColor = colorForCategory(category);
        const displayName = getCategoryDisplayName(category);
        const icon = categoryIcons[category] || <Utensils className="h-5 w-5 text-white" />;
        
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
              {cards.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                  {cards.slice(0, 12).map(card => (
                    <Link to={`/edit/${card.id}`} key={card.id} className="block">
                      <div className="letterboxd-style-card">
                        <CatalogCardCompact card={card} compact={true} />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 col-span-full text-gray-500">
                  No items found in this category.
                </div>
              )}
              
              {cards.length > 12 && (
                <div className="text-center mt-4">
                  <Button asChild variant="outline" style={{ borderColor: bgColor, color: bgColor }}>
                    <Link to={`/bites?category=${category}`}>
                      View all {cards.length} items
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FoodCategoryDisplay;


import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getCategoryDisplayName } from "@/utils/categoryUtils";
import CatalogCardCompact from "@/components/CatalogCardCompact";

interface FoodCategoryDisplayProps {
  foodCategories: string[];
  cardsByCategory: Record<string, any[]>;
  colorForCategory: (categoryName: string) => string;
}

const FoodCategoryDisplay: React.FC<FoodCategoryDisplayProps> = ({
  foodCategories,
  cardsByCategory,
  colorForCategory
}) => {
  return (
    <div className="space-y-6">
      {foodCategories.map(category => {
        const cards = cardsByCategory[category] || [];
        const bgColor = colorForCategory(category);
        const displayName = getCategoryDisplayName(category);
        
        return (
          <Card key={category} className="overflow-hidden border-0 shadow-md">
            <CardHeader 
              className="p-4 text-white font-bold"
              style={{ backgroundColor: bgColor }}
            >
              {displayName} ({cards.length})
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {cards.length > 0 ? (
                cards.slice(0, 6).map(card => (
                  <Link to={`/edit/${card.id}`} key={card.id} className="block">
                    <CatalogCardCompact card={card} />
                  </Link>
                ))
              ) : (
                <div className="text-center py-4 col-span-full text-gray-500">
                  No items found in this category.
                </div>
              )}
              
              {cards.length > 6 && (
                <div className="col-span-full text-center mt-2">
                  <Button asChild variant="outline">
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

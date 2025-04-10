
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getCategoryDisplayName } from "@/utils/categoryUtils";
import CatalogCardCompact from "@/components/CatalogCardCompact";

interface EntertainmentCategoryDisplayProps {
  entertainmentCategories: string[];
  cardsByCategory: Record<string, any[]>;
  colorForEntertainmentCategory: (categoryName: string) => string;
}

const EntertainmentCategoryDisplay: React.FC<EntertainmentCategoryDisplayProps> = ({
  entertainmentCategories,
  cardsByCategory,
  colorForEntertainmentCategory
}) => {
  return (
    <div className="space-y-8">
      {entertainmentCategories.map(category => {
        const cards = cardsByCategory[category] || [];
        const bgColor = colorForEntertainmentCategory(category);
        const displayName = getCategoryDisplayName(category);
        
        return (
          <Card key={category} className="overflow-hidden border-0 shadow-md">
            <CardHeader 
              className="p-4 text-white font-bold"
              style={{ backgroundColor: bgColor }}
            >
              {displayName} ({cards.length})
            </CardHeader>
            <CardContent className="p-4">
              {cards.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                  {cards.slice(0, 12).map(card => (
                    <Link 
                      to={`/blockbusters?highlight=${card.id}`} 
                      key={card.id} 
                      className="block"
                    >
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
                    <Link to={`/blockbusters?category=${category}`}>
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

export default EntertainmentCategoryDisplay;

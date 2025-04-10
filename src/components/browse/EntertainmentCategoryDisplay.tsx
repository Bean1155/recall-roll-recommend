
import React from "react";
import { EntertainmentCard } from "@/lib/types";

interface EntertainmentCategoryDisplayProps {
  entertainmentCategories: string[] | { name: string; count: number; type?: string }[];
  cardsByCategory: Record<string, any[]>;
  colorForEntertainmentCategory: (categoryName: string) => string;
}

const EntertainmentCategoryDisplay: React.FC<EntertainmentCategoryDisplayProps> = ({
  entertainmentCategories,
  cardsByCategory,
  colorForEntertainmentCategory
}) => {
  // Convert simple string array to object array if needed
  const processedCategories = entertainmentCategories.map(category => 
    typeof category === 'string' 
      ? { name: category, count: cardsByCategory[category]?.length || 0 }
      : category
  );

  // Create category colors map for the EntertainmentCategoryDrawers component
  const categoryColorsMap: Record<string, string> = {};
  processedCategories.forEach(category => {
    const categoryName = typeof category === 'string' ? category : category.name;
    categoryColorsMap[categoryName] = colorForEntertainmentCategory(categoryName);
  });

  return (
    <div className="space-y-4">
      {/* EntertainmentCategoryDrawers would go here, but for now we'll show a simple message */}
      <p className="text-center py-4">Browse entertainment categories</p>
    </div>
  );
};

export default EntertainmentCategoryDisplay;

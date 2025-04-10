
import React from "react";
import EntertainmentCategoryDrawers from "@/components/blockbusters/EntertainmentCategoryDrawers";
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

  return (
    <EntertainmentCategoryDrawers
      categories={processedCategories}
      categoryColors={Object.fromEntries(
        processedCategories.map(cat => [
          typeof cat === 'string' ? cat : cat.name, 
          colorForEntertainmentCategory(typeof cat === 'string' ? cat : cat.name)
        ])
      )}
      cards={Object.values(cardsByCategory).flat()}
      hideEmptyCategories={false}
    />
  );
};

export default EntertainmentCategoryDisplay;

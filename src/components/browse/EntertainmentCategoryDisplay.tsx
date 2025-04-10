
import React from "react";
import EntertainmentCategoryDrawers from "@/components/blockbusters/EntertainmentCategoryDrawers";

interface EntertainmentCategoryDisplayProps {
  entertainmentCategories: string[] | { name: string; count: number }[];
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
      cards={cardsByCategory}
      colorForCategory={colorForEntertainmentCategory}
      showEmptyCategories={false}
    />
  );
};

export default EntertainmentCategoryDisplay;


import React from "react";
import EntertainmentCategoryDrawers from "@/components/blockbusters/EntertainmentCategoryDrawers";

interface EntertainmentCategoryDisplayProps {
  entertainmentCategories: { name: string; count: number }[];
  cardsByCategory: Record<string, any[]>;
  colorForEntertainmentCategory: (categoryName: string) => string;
}

const EntertainmentCategoryDisplay: React.FC<EntertainmentCategoryDisplayProps> = ({
  entertainmentCategories,
  cardsByCategory,
  colorForEntertainmentCategory
}) => {
  return (
    <EntertainmentCategoryDrawers
      categories={entertainmentCategories}
      cards={cardsByCategory}
      colorForCategory={colorForEntertainmentCategory}
      showEmptyCategories={false}
    />
  );
};

export default EntertainmentCategoryDisplay;

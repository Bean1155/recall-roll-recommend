
import React from "react";
import CategoryCardsDisplay from "@/components/bites/CategoryCardsDisplay";

interface FoodCategoryDisplayProps {
  foodCategories: { name: string; count: number; type?: string }[];
  cardsByCategory: Record<string, any[]>;
  colorForCategory: (categoryName: string) => string;
}

const FoodCategoryDisplay: React.FC<FoodCategoryDisplayProps> = ({
  foodCategories,
  cardsByCategory,
  colorForCategory
}) => {
  return (
    <CategoryCardsDisplay
      category={foodCategories.filter(category => category.type === 'food')}
      cards={cardsByCategory}
      colorForCategory={colorForCategory}
      showEmptyCategories={false}
    />
  );
};

export default FoodCategoryDisplay;

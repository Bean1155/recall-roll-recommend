
import { useState, useEffect } from "react";
import { FoodCard } from "@/lib/types";
import { generateCategoryColors } from "@/utils/categoryUtils";

export const useCategoryColors = (cards: FoodCard[] = []) => {
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Extract unique categories from cards
    const categories = [...new Set(cards.map(card => card.category))];
    
    // Generate colors for categories
    const colors = generateCategoryColors(categories);
    setCategoryColors(colors);
  }, [cards]);
  
  // For compatibility with the current implementation
  const colorForCategory = (categoryName: string) => {
    return categoryColors[categoryName] || '#d2b48c'; // Default to tan if no color is found
  };
  
  const colorForEntertainmentCategory = (categoryName: string) => {
    // You might want to implement a different color scheme for entertainment categories
    return categoryColors[categoryName] || '#6495ED'; // Default to cornflower blue
  };
  
  return { categoryColors, colorForCategory, colorForEntertainmentCategory };
};

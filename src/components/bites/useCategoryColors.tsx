
import { useState, useEffect } from "react";
import { FoodCard } from "@/lib/types";
import { generateCategoryColors } from "@/utils/categoryUtils";

export const useCategoryColors = (cards: FoodCard[]) => {
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Extract unique categories from cards
    const categories = [...new Set(cards.map(card => card.category))];
    
    // Generate colors for categories
    const colors = generateCategoryColors(categories);
    setCategoryColors(colors);
  }, [cards]);
  
  return categoryColors;
};

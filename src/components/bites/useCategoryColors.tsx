
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
  
  // Fun, vibrant food category colors
  const foodCategoryColorMap: Record<string, string> = {
    'Cuisine': '#FF6B6B', 
    'By Cuisine': '#FF6B6B',
    'Restaurant Type': '#4ECDC4', 
    'By Restaurant Type': '#4ECDC4',
    'Top Rated': '#FFC857',
    'Most Popular': '#E84855',
    'Recently Added': '#6A0572',
    'Location': '#6C757D',
    'Favorite': '#FF8C42',
    'Recommended': '#7B68EE',
    'Bakery': '#9D65C9',
    'Café': '#5D8233',
    'Restaurant': '#FF6B6B',
    'Bar': '#3D5A80',
    'Food Truck': '#FF9A3C',
    'Italian': '#FF6B6B',
    'Chinese': '#4ECDC4',
    'Japanese': '#7209B7',
    'Mexican': '#F72585',
    'Indian': '#3F37C9',
    'Thai': '#4CC9F0',
    'American': '#3D5A80',
    'Mediterranean': '#5D8233',
    'Korean': '#FF8C42'
  };
  
  // Entertainment category colors
  const entertainmentCategoryColorMap: Record<string, string> = {
    'Genre': '#4361EE',
    'By Genre': '#4361EE',
    'Medium': '#3A0CA3',
    'By Medium': '#3A0CA3',
    'Top Rated': '#7209B7',
    'Most Popular': '#F72585',
    'Recently Added': '#4CC9F0',
    'Featured Lists': '#4895EF',
    'Movie': '#560BAD',
    'TV Show': '#B5179E',
    'Book': '#3F37C9',
    'Music': '#4361EE',
    'Video Game': '#4CC9F0'
  };
  
  // For compatibility with the current implementation
  const colorForCategory = (categoryName: string) => {
    return foodCategoryColorMap[categoryName] || 
           categoryColors[categoryName] || 
           '#FF9F1C'; // Default to orange if no color is found
  };
  
  const colorForEntertainmentCategory = (categoryName: string) => {
    return entertainmentCategoryColorMap[categoryName] || 
           categoryColors[categoryName] || 
           '#4CC9F0'; // Default to blue if no color is found
  };
  
  return { categoryColors, colorForCategory, colorForEntertainmentCategory };
};


import { FoodCategory } from "@/lib/types";

export const defaultCategories: FoodCategory[] = [
  "cafe", "diner", "specialty", "fine dining", "take out", 
  "bakery", "bar", "food truck", "restaurant", "other"
];

export const getCategoryDisplayName = (category: string): string => {
  const customDisplayNames: Record<string, string> = {
    "cafe": "Cafés",
    "diner": "Diners",
    "specialty": "Specialty",
    "fine dining": "Fine Dining",
    "take out": "Take-Out",
    "bakery": "Bakeries",
    "bar": "Bars",
    "food truck": "Food Trucks",
    "restaurant": "Restaurants",
    "other": "Other Places"
  };

  return customDisplayNames[category] || 
    category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
};

export const getDefaultCategoryColors = (): Record<string, string> => {
  return {
    "cafe": "#f5c4d3",
    "diner": "#e0c5c1",
    "specialty": "#ddb892",
    "fine dining": "#e9b44c",
    "take out": "#c1cc99",
    "bakery": "#9de0d0",
    "bar": "#a5b1c2",
    "food truck": "#a64b2a",
    "restaurant": "#e18336",
    "other": "#da7f5d",
  };
};

export const getTextColor = (backgroundColor: string): string => {
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  return brightness > 145 ? "#603913" : "#ffffff";
};

export const generateCategoryColors = (categories: FoodCategory[]): Record<string, string> => {
  const categoryColors = getDefaultCategoryColors();
  
  // Generate colors for any custom categories not in the default map
  const extraColors = [
    "#cc7f43", "#d35843", "#4d583c", "#8c9e5e", "#358f8f",
    "#6b798e", "#2f5d60", "#1a535c", "#4a3f35", "#232e33",
  ];
  
  let colorIndex = 0;
  categories.forEach(category => {
    if (!categoryColors[category]) {
      categoryColors[category] = extraColors[colorIndex % extraColors.length];
      colorIndex++;
    }
  });
  
  return categoryColors;
};

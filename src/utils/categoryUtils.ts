
import { FoodCategory } from "@/lib/types";

export const defaultCategories: FoodCategory[] = [
  "cafe", "diner", "specialty", "fine dining", "take out", 
  "bakery", "bar", "food truck", "restaurant"
];

export const defaultEntertainmentCategories: string[] = [
  "books", "comedies", "events", "games", "live performances", 
  "movies", "podcasts", "tv shows"
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
    "books": "Books",
    "comedies": "Comedies",
    "events": "Events",
    "games": "Games",
    "live performances": "Live Performances",
    "movies": "Movies",
    "podcasts": "Podcasts",
    "tv shows": "TV Shows"
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
    "books": "#7b9e89",
    "comedies": "#f9c74f",
    "events": "#90be6d",
    "games": "#43aa8b",
    "live performances": "#f3722c",
    "movies": "#577590",
    "podcasts": "#f8961e",
    "tv shows": "#277da1"
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

// Load all categories including custom ones from localStorage
export const getAllCategories = (): FoodCategory[] => {
  const customCategories: FoodCategory[] = [];
  try {
    const savedCategories = localStorage.getItem('customFoodCategories');
    if (savedCategories) {
      const parsed = JSON.parse(savedCategories);
      customCategories.push(...parsed);
    }
  } catch (e) {
    console.error("Error loading custom categories:", e);
  }
  
  return [...defaultCategories, ...customCategories];
};

// Add a custom category and save it to localStorage
export const addCustomCategory = (category: string): void => {
  try {
    const normalizedCategory = category.trim().toLowerCase();
    if (!normalizedCategory) return;
    
    // Skip if it's already in default categories
    if (defaultCategories.includes(normalizedCategory as FoodCategory)) {
      return;
    }
    
    // Load existing custom categories
    let customCategories: string[] = [];
    const savedCategories = localStorage.getItem('customFoodCategories');
    if (savedCategories) {
      customCategories = JSON.parse(savedCategories);
    }
    
    // Add the new category if it doesn't already exist
    if (!customCategories.includes(normalizedCategory)) {
      customCategories.push(normalizedCategory);
      localStorage.setItem('customFoodCategories', JSON.stringify(customCategories));
    }
  } catch (e) {
    console.error("Error saving custom category:", e);
  }
};

// Load all entertainment categories including custom ones from localStorage
export const getAllEntertainmentCategories = (): string[] => {
  const customCategories: string[] = [];
  try {
    const savedCategories = localStorage.getItem('customEntertainmentCategories');
    if (savedCategories) {
      const parsed = JSON.parse(savedCategories);
      customCategories.push(...parsed);
    }
  } catch (e) {
    console.error("Error loading custom entertainment categories:", e);
  }
  
  return [...defaultEntertainmentCategories, ...customCategories];
};

// Add a custom entertainment category and save it to localStorage
export const addCustomEntertainmentCategory = (category: string): void => {
  try {
    const normalizedCategory = category.trim().toLowerCase();
    if (!normalizedCategory) return;
    
    // Skip if it's already in default categories
    if (defaultEntertainmentCategories.includes(normalizedCategory)) {
      return;
    }
    
    // Load existing custom categories
    let customCategories: string[] = [];
    const savedCategories = localStorage.getItem('customEntertainmentCategories');
    if (savedCategories) {
      customCategories = JSON.parse(savedCategories);
    }
    
    // Add the new category if it doesn't already exist
    if (!customCategories.includes(normalizedCategory)) {
      customCategories.push(normalizedCategory);
      localStorage.setItem('customEntertainmentCategories', JSON.stringify(customCategories));
    }
  } catch (e) {
    console.error("Error saving custom entertainment category:", e);
  }
};


import { CatalogCard } from "@/lib/types";

/**
 * Groups cards by category based on type (food or entertainment)
 */
export const groupCardsByCategory = (
  filteredCards: CatalogCard[], 
  typeFilter: 'food' | 'entertainment', 
  foodCategories: any[], 
  entertainmentCategories: any[]
) => {
  const cardsByCategory: Record<string, CatalogCard[]> = {};
  
  if (typeFilter === 'food') {
    foodCategories.forEach(category => {
      const categoryName = typeof category === 'string' ? category : category.name;
      cardsByCategory[categoryName] = filteredCards.filter(
        card => card.type === 'food' && (card as any).category === categoryName
      );
    });
  } else {
    entertainmentCategories.forEach(category => {
      const categoryName = typeof category === 'string' ? category : category.name;
      cardsByCategory[categoryName] = filteredCards.filter(
        card => card.type === 'entertainment' && (card as any).entertainmentType === categoryName
      );
    });
  }
  
  return cardsByCategory;
};

/**
 * Gets the category field name based on card type
 */
export const getCategoryFieldByType = (type: 'food' | 'entertainment') => {
  return type === 'food' ? 'category' : 'entertainmentType';
};

/**
 * Gets a category display name with proper capitalization
 */
export const formatCategoryName = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Gets the relevant category for a card based on its type
 */
export const getCardCategory = (card: CatalogCard): string => {
  if (card.type === 'food' && 'category' in card) {
    return card.category as string;
  }
  if (card.type === 'entertainment' && 'entertainmentType' in card) {
    return card.entertainmentType as string;
  }
  return '';
};

/**
 * Count cards by category
 */
export const countCardsByCategory = (
  cards: CatalogCard[],
  type: 'food' | 'entertainment',
  categories: string[]
): Record<string, number> => {
  const counts: Record<string, number> = {};
  
  categories.forEach(category => {
    counts[category] = cards.filter(card => {
      if (card.type !== type) return false;
      
      return type === 'food'
        ? (card as any).category === category
        : (card as any).entertainmentType === category;
    }).length;
  });
  
  return counts;
};


import { CatalogCard } from "@/lib/types";

// Function to group cards by category
export const groupCardsByCategory = (filteredCards: CatalogCard[], typeFilter: 'food' | 'entertainment', foodCategories: any[], entertainmentCategories: any[]) => {
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

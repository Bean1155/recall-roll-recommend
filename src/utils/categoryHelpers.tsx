
import { CatalogCard } from "@/lib/types";

// Function to group cards by category
export const groupCardsByCategory = (filteredCards: CatalogCard[], typeFilter: 'food' | 'entertainment', foodCategories: any[], entertainmentCategories: any[]) => {
  const cardsByCategory: Record<string, CatalogCard[]> = {};
  
  if (typeFilter === 'food') {
    foodCategories.forEach(category => {
      cardsByCategory[category.name] = filteredCards.filter(
        card => card.type === 'food' && card.category === category.name
      );
    });
  } else {
    entertainmentCategories.forEach(category => {
      cardsByCategory[category.name] = filteredCards.filter(
        card => card.type === 'entertainment' && (card as any).entertainmentType === category.name
      );
    });
  }
  
  return cardsByCategory;
};

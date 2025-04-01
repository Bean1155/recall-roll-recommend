
export type CardType = 'food' | 'entertainment';
export type FoodCategory = 'cafe' | 'diner' | 'specialty foods' | 'fine dining' | 'take out' | 'bakeries' | 'bars' | 'food trucks' | 'other';
export type FoodStatus = 'Visited: Tried this bite' | 'Interested: Want a bite' | 'Highly Recommend' | 'Favorite';

export interface CatalogCard {
  id: string;
  type: CardType;
  title: string;
  creator: string; // chef/restaurant or director/studio
  date: string;
  rating: number;
  notes: string;
  recommendedBy?: string;
  recommendedTo?: string[];
}

export interface FoodCard extends CatalogCard {
  type: 'food';
  cuisine: string;
  location: string;
  category: FoodCategory;
  status: FoodStatus;
  visitCount: number;
  url?: string;
  tags?: string[];
}

export interface EntertainmentCard extends CatalogCard {
  type: 'entertainment';
  genre: string;
  medium: string; // movie, tv show, book, etc.
  releaseYear: string;
}


export type CardType = 'food' | 'entertainment';

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
  dish: string;
}

export interface EntertainmentCard extends CatalogCard {
  type: 'entertainment';
  genre: string;
  medium: string; // movie, tv show, book, etc.
  releaseYear: string;
}

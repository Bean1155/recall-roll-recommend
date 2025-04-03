
export type CardType = 'food' | 'entertainment';
export type FoodCategory = 'bakery' | 'bar' | 'cafe' | 'diner' | 'event space' | 'fine dining' | 'food truck' | 'restaurant' | 'specialty food' | 'take out' | 'other';
export type FoodStatus = 'Visited: Tried this bite' | 'Interested: Want a bite';
export type EntertainmentStatus = 'Watched' | 'Want to Watch' | 'Currently Watching';
export type RecommendationBadge = 'Highly Recommend' | 'Favorite' | null;
export type AgreementStatus = 'Agree' | 'Disagree' | 'Neutral' | null;

export interface UserNote {
  userId: string;
  notes: string;
  date: string;
  userName?: string;
  userRating?: number;
  agreementStatus?: AgreementStatus;
  tags?: string[];
  url?: string;
}

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
  recommendationBadge?: RecommendationBadge;
  userNotes?: UserNote[];
  isFavorite?: boolean; // New field to track favorite status
  tags?: string[]; // Add tags to the base CatalogCard interface
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
  medium: string; // streaming platform
  entertainmentCategory: string; // movies, tv shows, etc.
  status: EntertainmentStatus;
  url?: string;
  tags?: string[];
}

import React from "react";
import { ChefHat, Utensils, MapPin, Star, Clock, Filter, Heart, FileText } from "lucide-react";

export interface BrowseOption {
  title: string;
  route: string;
  type: "food" | "entertainment";
  icon: React.ReactNode;
  subcategories?: string[];
}

export const foodBrowseOptions: BrowseOption[] = [
  { 
    title: "By Cuisine", 
    route: "/bites?filter=cuisine", 
    type: "food", 
    icon: <ChefHat className="h-5 w-5" />,
    subcategories: ["Italian", "Mexican", "Chinese", "Japanese", "Indian", "Thai", "American", "French", "Mediterranean", "Other"]
  },
  { 
    title: "By Category", 
    route: "/bites?filter=category", 
    type: "food", 
    icon: <Utensils className="h-5 w-5" />,
    subcategories: ["Restaurant", "Cafe", "Fast Food", "Dessert", "Bakery", "Food Truck", "Homemade", "Takeout", "Other"]
  },
  { 
    title: "Top Rated", 
    route: "/bites?filter=topRated", 
    type: "food", 
    icon: <Star className="h-5 w-5" />,
    subcategories: ["5 Stars", "4+ Stars", "3+ Stars"]
  },
  { 
    title: "Favorites", 
    route: "/bites?filter=favorites", 
    type: "food", 
    icon: <Heart className="h-5 w-5" /> 
  },
  { 
    title: "Recently Added", 
    route: "/bites?filter=recent", 
    type: "food", 
    icon: <Clock className="h-5 w-5" /> 
  },
  { 
    title: "Location", 
    route: "/bites?filter=location", 
    type: "food", 
    icon: <MapPin className="h-5 w-5" />,
    subcategories: ["New York", "Los Angeles", "Chicago", "San Francisco", "Miami", "Seattle", "Other"]
  },
  { 
    title: "By Status", 
    route: "/bites?filter=status", 
    type: "food", 
    icon: <FileText className="h-5 w-5" />,
    subcategories: ["Want to Try", "Tried", "Favorite", "Not Interested"]
  }
];

export const entertainmentBrowseOptions: BrowseOption[] = [
  { 
    title: "By Genre", 
    route: "/blockbusters?filter=genre", 
    type: "entertainment", 
    icon: <Filter className="h-5 w-5" />,
    subcategories: ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Fantasy", "Romance", "Thriller", "Documentary", "Other"]
  },
  { 
    title: "By Medium", 
    route: "/blockbusters?filter=medium", 
    type: "entertainment", 
    icon: <Filter className="h-5 w-5" />,
    subcategories: ["Movies", "TV Shows", "Books", "Podcasts", "Games"]
  },
  { 
    title: "Top Rated", 
    route: "/blockbusters?filter=topRated", 
    type: "entertainment", 
    icon: <Star className="h-5 w-5" /> 
  },
  { 
    title: "Favorites", 
    route: "/blockbusters?filter=favorites", 
    type: "entertainment", 
    icon: <Heart className="h-5 w-5" /> 
  },
  { 
    title: "Recently Added", 
    route: "/blockbusters?filter=recent", 
    type: "entertainment", 
    icon: <Clock className="h-5 w-5" /> 
  },
  { 
    title: "Featured Lists", 
    route: "/blockbusters?filter=lists", 
    type: "entertainment", 
    icon: <Filter className="h-5 w-5" /> 
  },
  { 
    title: "By Status", 
    route: "/blockbusters?filter=status", 
    type: "entertainment", 
    icon: <FileText className="h-5 w-5" />,
    subcategories: ["Want to Watch", "Watched", "Favorite", "Not Interested"]
  }
];

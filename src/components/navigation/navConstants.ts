
import { Home, Folder, Sparkles, Award, Utensils, Film } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavItemType {
  name: string;
  icon: LucideIcon;
  path: string;
  color: string;
}

export interface AddOptionType {
  name: string;
  icon: LucideIcon;
  path: string;
  description: string;
}

// Main navigation items
export const navItems: NavItemType[] = [
  {
    name: "Home",
    icon: Home,
    path: "/",
    color: "#FFECB3" // Soft Yellow/Gold
  },
  {
    name: "Collections",
    icon: Folder,
    path: "/collections",
    color: "#D3E4FD" // Soft Blue
  },
  {
    name: "Recommend",
    icon: Sparkles,
    path: "/recommend",
    color: "#FEF7CD" // Soft Yellow
  },
  {
    name: "Rewards",
    icon: Award,
    path: "/rewards",
    color: "#FADCD9" // Soft Coral/Pink
  }
];

// Search item configuration
export const searchItem: NavItemType = {
  name: "Search",
  icon: Home, // This will be replaced with the Search icon in the component
  path: "/search",
  color: "#E1F5FE" // Soft Light Blue
};

// Add options
export const addOptions: AddOptionType[] = [
  {
    name: "Add Bite",
    icon: Utensils,
    path: "/create/food",
    description: "Add a new food or restaurant"
  },
  {
    name: "Add Blockbuster",
    icon: Film,
    path: "/create/entertainment",
    description: "Add a new movie or show"
  }
];

// Add item configuration
export const addItem = {
  name: "Add",
  color: "#E5DEFF", // Soft Purple
  options: addOptions
};

// Profile item configuration
export const profileItem: NavItemType = {
  name: "Profile",
  icon: Home, // This will be replaced with the User icon in the component
  path: "/profile",
  color: "#D2B48C" // Darker vintage color (soft brown)
};

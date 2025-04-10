
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import GridLayout from "@/components/GridLayout";
import { Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { defaultCategories, defaultEntertainmentCategories, getCategoryDisplayName } from "@/utils/categoryUtils";
import { useBrowseState } from "@/hooks/useBrowseState";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCategoryColors } from "@/components/bites/useCategoryColors";
import { Card, CardContent } from "@/components/ui/card";
import FoodCategoryDisplay from "@/components/browse/FoodCategoryDisplay";
import EntertainmentCategoryDisplay from "@/components/browse/EntertainmentCategoryDisplay";
import { getFoodCards, getEntertainmentCards } from "@/lib/data";
import { FoodCard, EntertainmentCard } from "@/lib/types";

// List of browse options for the Letterboxd-style interface
interface BrowseOption {
  title: string;
  route: string;
  type: "food" | "entertainment";
}

const foodBrowseOptions: BrowseOption[] = [
  { title: "By Cuisine", route: "/bites?filter=cuisine", type: "food" },
  { title: "By Restaurant Type", route: "/bites?filter=category", type: "food" },
  { title: "Top Rated", route: "/bites?filter=topRated", type: "food" },
  { title: "Most Popular", route: "/bites?filter=popular", type: "food" },
  { title: "Recently Added", route: "/bites?filter=recent", type: "food" },
  { title: "Location", route: "/bites?filter=location", type: "food" }
];

const entertainmentBrowseOptions: BrowseOption[] = [
  { title: "By Genre", route: "/blockbusters?filter=genre", type: "entertainment" },
  { title: "By Medium", route: "/blockbusters?filter=medium", type: "entertainment" },
  { title: "Top Rated", route: "/blockbusters?filter=topRated", type: "entertainment" },
  { title: "Most Popular", route: "/blockbusters?filter=popular", type: "entertainment" },
  { title: "Recently Added", route: "/blockbusters?filter=recent", type: "entertainment" },
  { title: "Featured Lists", route: "/blockbusters?filter=lists", type: "entertainment" }
];

const BrowsePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const typeParam = searchParams.get('type') as 'food' | 'entertainment' | null;
  const [activeType, setActiveType] = useState<'food' | 'entertainment'>(typeParam || 'food');
  
  // For displaying cards at the bottom when category is clicked
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [foodCards, setFoodCards] = useState<FoodCard[]>([]);
  const [entertainmentCards, setEntertainmentCards] = useState<EntertainmentCard[]>([]);
  
  // Use the appropriate options list based on the active type
  const browseOptions = activeType === 'food' ? foodBrowseOptions : entertainmentBrowseOptions;
  
  // Get category colors
  const { categoryColors, colorForCategory, colorForEntertainmentCategory } = useCategoryColors([]);
  
  // Load cards for display
  useEffect(() => {
    setFoodCards(getFoodCards());
    setEntertainmentCards(getEntertainmentCards());
  }, []);
  
  const navigateToSearch = () => {
    navigate('/search');
  };
  
  const toggleType = () => {
    const newType = activeType === 'food' ? 'entertainment' : 'food';
    setActiveType(newType);
    setSelectedCategory(null); // Reset selection when toggling type
    // Update URL params when toggling
    navigate(`/browse?type=${newType}`);
  };

  const handleCategoryClick = (option: BrowseOption) => {
    // Set the selected category for display at bottom
    const categoryFromRoute = new URL(option.route, window.location.origin).searchParams.get('filter');
    setSelectedCategory(categoryFromRoute);
    
    // Optional: navigate to the route as well
    // navigate(option.route);
  };
  
  // Organize cards by category for the selected category view
  const groupCardsByCategory = () => {
    if (!selectedCategory) return {};
    
    if (activeType === 'food') {
      // Group food cards by the selected filter type
      switch (selectedCategory) {
        case 'cuisine':
          return foodCards.reduce((acc, card) => {
            const cuisine = card.cuisine || 'Other';
            if (!acc[cuisine]) acc[cuisine] = [];
            acc[cuisine].push(card);
            return acc;
          }, {} as Record<string, FoodCard[]>);
        case 'category':
          return foodCards.reduce((acc, card) => {
            const category = card.category || 'Other';
            if (!acc[category]) acc[category] = [];
            acc[category].push(card);
            return acc;
          }, {} as Record<string, FoodCard[]>);
        case 'topRated':
          return { 'Top Rated': foodCards.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10) };
        case 'popular':
          return { 'Most Popular': foodCards.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 10) };
        case 'recent':
          return { 'Recently Added': [...foodCards].sort((a, b) => 
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          ).slice(0, 10) };
        case 'location':
          return foodCards.reduce((acc, card) => {
            const location = card.location || 'Unknown';
            if (!acc[location]) acc[location] = [];
            acc[location].push(card);
            return acc;
          }, {} as Record<string, FoodCard[]>);
        default:
          return {};
      }
    } else {
      // Group entertainment cards by the selected filter type
      switch (selectedCategory) {
        case 'genre':
          return entertainmentCards.reduce((acc, card) => {
            const genre = card.genre || 'Other';
            if (!acc[genre]) acc[genre] = [];
            acc[genre].push(card);
            return acc;
          }, {} as Record<string, EntertainmentCard[]>);
        case 'medium':
          return entertainmentCards.reduce((acc, card) => {
            const medium = card.entertainmentType || 'Other';
            if (!acc[medium]) acc[medium] = [];
            acc[medium].push(card);
            return acc;
          }, {} as Record<string, EntertainmentCard[]>);
        case 'topRated':
          return { 'Top Rated': entertainmentCards.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10) };
        case 'popular':
          return { 'Most Popular': entertainmentCards.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 10) };
        case 'recent':
          return { 'Recently Added': [...entertainmentCards].sort((a, b) => 
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          ).slice(0, 10) };
        case 'lists':
          return { 'Featured Lists': entertainmentCards.filter(card => card.featured).slice(0, 10) };
        default:
          return {};
      }
    }
  };
  
  const cardsByCategory = groupCardsByCategory();
  const categories = Object.keys(cardsByCategory);

  return (
    <GridLayout title="Browse">
      <div className="flex flex-col max-w-3xl mx-auto w-full">
        {/* Search Bar */}
        <div className="px-4 py-8 flex justify-center">
          <Button 
            variant="outline" 
            className="w-full max-w-md h-12 flex justify-start gap-2 text-gray-700 border-gray-300 bg-white shadow-sm"
            onClick={navigateToSearch}
          >
            <Search className="h-5 w-5" />
            <span>Find items, tags, categories...</span>
          </Button>
        </div>
        
        {/* Type Toggle Button */}
        <div className="px-4 mb-6 flex justify-center">
          <Button
            variant="outline"
            className="bg-white text-gray-700 border-gray-300 hover:bg-gray-100 shadow-sm"
            onClick={toggleType}
          >
            {activeType === 'food' ? 'Switch to Blockbusters' : 'Switch to Bites'}
          </Button>
        </div>
        
        {/* Browse By Section */}
        <div className="px-4 pb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Browse {activeType === 'food' ? 'Bites' : 'Blockbusters'} by
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {browseOptions.map((option) => (
              <Button
                key={option.title}
                variant="outline"
                className="flex justify-between items-center py-4 h-auto text-lg bg-white hover:bg-gray-100 shadow-sm"
                onClick={() => handleCategoryClick(option)}
                style={{
                  backgroundColor: activeType === 'food' 
                    ? colorForCategory(option.title) 
                    : colorForEntertainmentCategory(option.title),
                  color: '#ffffff'
                }}
              >
                <span>{option.title}</span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            ))}
          </div>
        </div>
        
        {/* Display selected category cards */}
        {selectedCategory && categories.length > 0 && (
          <div className="px-4 pb-20">
            <h3 className="text-xl font-bold mb-4 text-gray-700">
              {getCategoryDisplayName(selectedCategory)} Results
            </h3>
            
            {activeType === 'food' ? (
              <FoodCategoryDisplay 
                foodCategories={categories}
                cardsByCategory={cardsByCategory}
                colorForCategory={colorForCategory}
              />
            ) : (
              <EntertainmentCategoryDisplay
                entertainmentCategories={categories}
                cardsByCategory={cardsByCategory}
                colorForEntertainmentCategory={colorForEntertainmentCategory}
              />
            )}
          </div>
        )}
      </div>
    </GridLayout>
  );
};

export default BrowsePage;

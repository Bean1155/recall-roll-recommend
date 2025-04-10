import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import GridLayout from "@/components/GridLayout";
import { Search, ChevronRight, ChefHat, Utensils, MapPin, Star, Clock, Filter, Heart, FileText } from "lucide-react";
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
import { FoodCard, EntertainmentCard, CatalogCard } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import CatalogCardCompact from "@/components/CatalogCardCompact";
import TypeToggle from "@/components/browse/TypeToggle";

interface BrowseOption {
  title: string;
  route: string;
  type: "food" | "entertainment";
  icon: React.ReactNode;
  subcategories?: string[];
}

const foodBrowseOptions: BrowseOption[] = [
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
  { title: "Top Rated", route: "/bites?filter=topRated", type: "food", icon: <Star className="h-5 w-5" /> },
  { title: "Favorites", route: "/bites?filter=favorites", type: "food", icon: <Heart className="h-5 w-5" /> },
  { title: "Recently Added", route: "/bites?filter=recent", type: "food", icon: <Clock className="h-5 w-5" /> },
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

const entertainmentBrowseOptions: BrowseOption[] = [
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
  { title: "Top Rated", route: "/blockbusters?filter=topRated", type: "entertainment", icon: <Star className="h-5 w-5" /> },
  { title: "Favorites", route: "/blockbusters?filter=favorites", type: "entertainment", icon: <Heart className="h-5 w-5" /> },
  { title: "Recently Added", route: "/blockbusters?filter=recent", type: "entertainment", icon: <Clock className="h-5 w-5" /> },
  { title: "Featured Lists", route: "/blockbusters?filter=lists", type: "entertainment", icon: <Filter className="h-5 w-5" /> },
  { 
    title: "By Status", 
    route: "/blockbusters?filter=status", 
    type: "entertainment", 
    icon: <FileText className="h-5 w-5" />,
    subcategories: ["Want to Watch", "Watched", "Favorite", "Not Interested"]
  }
];

const BrowsePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const typeParam = searchParams.get('type') as 'food' | 'entertainment' | null;
  const [activeType, setActiveType] = useState<'food' | 'entertainment'>(typeParam || 'food');
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [foodCards, setFoodCards] = useState<FoodCard[]>([]);
  const [entertainmentCards, setEntertainmentCards] = useState<EntertainmentCard[]>([]);
  
  const browseOptions = activeType === 'food' ? foodBrowseOptions : entertainmentBrowseOptions;
  
  const { categoryColors, colorForCategory, colorForEntertainmentCategory } = useCategoryColors([]);
  
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
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    navigate(`/browse?type=${newType}`);
  };

  const handleCategoryClick = (option: BrowseOption) => {
    const categoryFromRoute = new URL(option.route, window.location.origin).searchParams.get('filter');
    
    if (categoryFromRoute === 'topRated') {
      navigate(`/${activeType === 'food' ? 'bites' : 'blockbusters'}?filter=topRated`);
      return;
    }
    
    if (selectedCategory === categoryFromRoute) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(categoryFromRoute);
      setSelectedSubcategory(null);
    }
  };
  
  const handleSubcategoryClick = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    
    if (selectedCategory) {
      navigate(`/${activeType === 'food' ? 'bites' : 'blockbusters'}?filter=${selectedCategory}&value=${subcategory}`);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      const targetPath = activeType === 'entertainment' ? '/blockbusters' : '/bites';
      navigate(`${targetPath}?search=${searchTerm}&fromSearch=true`);
    }
  };
  
  const getFilteredCards = () => {
    if (!selectedCategory || !selectedSubcategory) return [];
    
    if (activeType === 'food') {
      switch (selectedCategory) {
        case 'cuisine':
          return foodCards.filter(card => card.cuisine?.toLowerCase() === selectedSubcategory.toLowerCase());
        case 'category':
          return foodCards.filter(card => card.category?.toLowerCase() === selectedSubcategory.toLowerCase());
        case 'location':
          return foodCards.filter(card => card.location?.toLowerCase() === selectedSubcategory.toLowerCase());
        case 'status':
          return foodCards.filter(card => card.status?.toLowerCase() === selectedSubcategory.toLowerCase());
        case 'topRated':
          return foodCards.filter(card => card.rating && (card.rating >= 4));
        default:
          return [];
      }
    } else {
      switch (selectedCategory) {
        case 'genre':
          return entertainmentCards.filter(card => card.genre?.toLowerCase() === selectedSubcategory.toLowerCase());
        case 'medium':
          return entertainmentCards.filter(card => card.entertainmentCategory?.toLowerCase() === selectedSubcategory.toLowerCase());
        case 'status':
          return entertainmentCards.filter(card => card.status?.toLowerCase() === selectedSubcategory.toLowerCase());
        case 'topRated':
          return entertainmentCards.filter(card => card.rating && (card.rating >= 4));
        default:
          return [];
      }
    }
  };
  
  const filteredCards = getFilteredCards();

  return (
    <GridLayout title="Browse">
      <div className="flex flex-col max-w-3xl mx-auto w-full">
        <div className="px-4 py-4 pb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search by Keywords"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-white border-gray-300"
            />
            <Button type="submit" variant="default" className="bg-catalog-teal hover:bg-catalog-darkTeal text-white">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>
        
        <div className="px-4 mb-6 flex justify-center">
          <TypeToggle currentType={activeType} onTypeChange={handleTypeChange} />
        </div>
        
        <div className="px-4 pb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Browse {activeType === 'food' ? 'Bites' : 'Blockbusters'} by
          </h2>
          
          <div className="space-y-3">
            {browseOptions.map((option) => {
              const bgColor = activeType === 'food' 
                ? colorForCategory(option.title) 
                : colorForEntertainmentCategory(option.title);
                
              return (
                <div key={option.title}>
                  <Button
                    variant="ghost"
                    className="w-full flex justify-between items-center py-3 h-auto text-lg hover:bg-opacity-10 border-b border-gray-100"
                    onClick={() => handleCategoryClick(option)}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: bgColor }}
                      >
                        {option.icon}
                      </div>
                      <span>{option.title}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Button>
                  
                  {option.subcategories && selectedCategory === new URL(option.route, window.location.origin).searchParams.get('filter') && (
                    <div className="ml-10 mt-2 mb-4">
                      <Accordion type="single" collapsible className="w-full" defaultValue="subcategories">
                        <AccordionItem value="subcategories" className="border-0">
                          <AccordionContent>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {option.subcategories.map(subcat => (
                                <Button
                                  key={subcat}
                                  variant={selectedSubcategory === subcat ? "default" : "outline"}
                                  size="sm"
                                  className={`text-sm justify-start ${selectedSubcategory === subcat ? 'bg-catalog-teal text-white' : 'bg-white'}`}
                                  onClick={() => handleSubcategoryClick(subcat)}
                                >
                                  {subcat}
                                </Button>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {selectedSubcategory && filteredCards.length > 0 && (
          <div className="px-4 pb-20">
            <h3 className="text-xl font-bold mb-4 text-gray-700">
              {selectedSubcategory} ({filteredCards.length} items)
            </h3>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {filteredCards.map(card => (
                <Link to={`/edit/${card.id}`} key={card.id} className="block">
                  <div className="letterboxd-style-card">
                    <CatalogCardCompact card={card} compact={true} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {selectedSubcategory && filteredCards.length === 0 && (
          <div className="px-4 pb-20 text-center">
            <p className="text-gray-500 py-8">No items found for {selectedSubcategory}</p>
            <Button asChild>
              <Link to={`/create/${activeType === 'food' ? 'food' : 'entertainment'}?${selectedCategory}=${selectedSubcategory}`}>
                Add your first {selectedSubcategory} item
              </Link>
            </Button>
          </div>
        )}
      </div>
    </GridLayout>
  );
};

export default BrowsePage;

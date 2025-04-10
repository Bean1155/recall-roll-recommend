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

interface BrowseOption {
  title: string;
  route: string;
  type: "food" | "entertainment";
  icon: React.ReactNode;
}

const foodBrowseOptions: BrowseOption[] = [
  { title: "By Cuisine", route: "/bites?filter=cuisine", type: "food", icon: <ChefHat className="h-5 w-5" /> },
  { title: "By Category", route: "/bites?filter=category", type: "food", icon: <Utensils className="h-5 w-5" /> },
  { title: "Top Rated", route: "/bites?filter=topRated", type: "food", icon: <Star className="h-5 w-5" /> },
  { title: "Favorites", route: "/bites?filter=favorites", type: "food", icon: <Heart className="h-5 w-5" /> },
  { title: "Recently Added", route: "/bites?filter=recent", type: "food", icon: <Clock className="h-5 w-5" /> },
  { title: "Location", route: "/bites?filter=location", type: "food", icon: <MapPin className="h-5 w-5" /> },
  { title: "By Status", route: "/bites?filter=status", type: "food", icon: <FileText className="h-5 w-5" /> }
];

const entertainmentBrowseOptions: BrowseOption[] = [
  { title: "By Genre", route: "/blockbusters?filter=genre", type: "entertainment", icon: <Filter className="h-5 w-5" /> },
  { title: "By Medium", route: "/blockbusters?filter=medium", type: "entertainment", icon: <Filter className="h-5 w-5" /> },
  { title: "Top Rated", route: "/blockbusters?filter=topRated", type: "entertainment", icon: <Star className="h-5 w-5" /> },
  { title: "Favorites", route: "/blockbusters?filter=favorites", type: "entertainment", icon: <Heart className="h-5 w-5" /> },
  { title: "Recently Added", route: "/blockbusters?filter=recent", type: "entertainment", icon: <Clock className="h-5 w-5" /> },
  { title: "Featured Lists", route: "/blockbusters?filter=lists", type: "entertainment", icon: <Filter className="h-5 w-5" /> },
  { title: "By Status", route: "/blockbusters?filter=status", type: "entertainment", icon: <FileText className="h-5 w-5" /> }
];

const BrowsePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const typeParam = searchParams.get('type') as 'food' | 'entertainment' | null;
  const [activeType, setActiveType] = useState<'food' | 'entertainment'>(typeParam || 'food');
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
    navigate(`/browse?type=${newType}`);
  };

  const handleCategoryClick = (option: BrowseOption) => {
    const categoryFromRoute = new URL(option.route, window.location.origin).searchParams.get('filter');
    setSelectedCategory(categoryFromRoute);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/search?term=${searchTerm}&type=${activeType}`);
    }
  };
  
  const groupCardsByCategory = () => {
    if (!selectedCategory) return {};
    
    if (activeType === 'food') {
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
        case 'favorites':
          return { 'Favorites': foodCards.filter(card => (card as any).favorite === true).slice(0, 10) };
        case 'recent':
          return { 'Recently Added': [...foodCards].sort((a, b) => {
            const dateA = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : Date.now();
            const dateB = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : Date.now();
            return dateB - dateA;
          }).slice(0, 10) };
        case 'location':
          return foodCards.reduce((acc, card) => {
            const location = card.location || 'Unknown';
            if (!acc[location]) acc[location] = [];
            acc[location].push(card);
            return acc;
          }, {} as Record<string, FoodCard[]>);
        case 'status':
          return foodCards.reduce((acc, card) => {
            const status = card.status || 'Unknown';
            if (!acc[status]) acc[status] = [];
            acc[status].push(card);
            return acc;
          }, {} as Record<string, FoodCard[]>);
        default:
          return {};
      }
    } else {
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
            const medium = card.entertainmentCategory || 'Other';
            if (!acc[medium]) acc[medium] = [];
            acc[medium].push(card);
            return acc;
          }, {} as Record<string, EntertainmentCard[]>);
        case 'topRated':
          return { 'Top Rated': entertainmentCards.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10) };
        case 'favorites':
          return { 'Favorites': entertainmentCards.filter(card => (card as any).favorite === true).slice(0, 10) };
        case 'recent':
          return { 'Recently Added': [...entertainmentCards].sort((a, b) => {
            const dateA = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : Date.now();
            const dateB = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : Date.now();
            return dateB - dateA;
          }).slice(0, 10) };
        case 'lists':
          return { 'Featured Lists': entertainmentCards.filter(card => (card as any).featured || false).slice(0, 10) };
        case 'status':
          return entertainmentCards.reduce((acc, card) => {
            const status = card.status || 'Unknown';
            if (!acc[status]) acc[status] = [];
            acc[status].push(card);
            return acc;
          }, {} as Record<string, EntertainmentCard[]>);
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
          <Button
            variant="outline"
            className="bg-white text-gray-700 border-gray-300 hover:bg-gray-100 shadow-sm"
            onClick={toggleType}
          >
            {activeType === 'food' ? 'Switch to Blockbusters' : 'Switch to Bites'}
          </Button>
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
                <Button
                  key={option.title}
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
              );
            })}
          </div>
        </div>
        
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

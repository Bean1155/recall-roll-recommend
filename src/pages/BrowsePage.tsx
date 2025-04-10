import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CatalogCard } from "@/lib/types";
import CatalogSearch from "@/components/CatalogSearch";
import CategoryCardsDisplay from "@/components/bites/CategoryCardsDisplay";
import { Badge } from "@/components/ui/badge";
import GridLayout from "@/components/GridLayout";
import { useFilteredCards } from "@/hooks/useFilteredCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllCategories, getAllEntertainmentCategories } from "@/utils/categoryUtils";
import { Utensils, Film, Music, Gamepad, Map, Book, Tv, ListFilter } from "lucide-react";
import { useCategoryColors } from "@/components/bites/useCategoryColors";
import EntertainmentCategoryDrawers from "@/components/blockbusters/EntertainmentCategoryDrawers";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

// Category type mapping object for consistent display
const categoryTypeIcons: Record<string, React.ReactNode> = {
  "Restaurant": <Utensils className="h-4 w-4" />,
  "Café": <Utensils className="h-4 w-4" />,
  "Food Truck": <Utensils className="h-4 w-4" />,
  "Bakery": <Utensils className="h-4 w-4" />,
  "Bar": <Utensils className="h-4 w-4" />,
  "Ice Cream": <Utensils className="h-4 w-4" />,
  "Movie": <Film className="h-4 w-4" />,
  "TV Show": <Tv className="h-4 w-4" />,
  "Book": <Book className="h-4 w-4" />,
  "Video Game": <Gamepad className="h-4 w-4" />,
  "Music": <Music className="h-4 w-4" />,
  "Travel": <Map className="h-4 w-4" />,
};

const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<'food' | 'entertainment'>(
    (searchParams.get('type') as 'food' | 'entertainment') || 'food'
  );
  const [categoryFilter, setCategoryFilter] = useState<string | null>(
    searchParams.get('category')
  );
  const [activeTab, setActiveTab] = useState<string>(
    searchParams.get('view') || 'search'
  );
  const { colorForCategory, colorForEntertainmentCategory } = useCategoryColors();
  const isMobile = useIsMobile();
  
  // Get all cards based on current filters
  const { filteredCards } = useFilteredCards({
    type: typeFilter,
    location: locationFilter,
    minRating: ratingFilter,
    category: categoryFilter,
  });
  
  useEffect(() => {
    // Update search params whenever the filters change
    const params = new URLSearchParams();
    if (typeFilter) params.set('type', typeFilter);
    if (locationFilter) params.set('location', locationFilter);
    if (ratingFilter) params.set('rating', ratingFilter.toString());
    if (categoryFilter) params.set('category', categoryFilter);
    params.set('view', activeTab);
    setSearchParams(params);
  }, [typeFilter, locationFilter, ratingFilter, categoryFilter, activeTab, setSearchParams]);
  
  // Get food categories with count
  const foodCategories = getAllCategories(filteredCards);
  
  // Get entertainment categories with count
  const entertainmentCategories = getAllEntertainmentCategories(filteredCards);

  // Handle category filter click
  const handleCategoryFilterClick = (categoryName: string) => {
    if (categoryFilter === categoryName) {
      setCategoryFilter(null);
    } else {
      setCategoryFilter(categoryName);
    }
  };
  
  // Handle entertainment category filter click
  const handleEntertainmentCategoryFilterClick = (categoryName: string) => {
    if (categoryFilter === categoryName) {
      setCategoryFilter(null);
    } else {
      setCategoryFilter(categoryName);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setLocationFilter(null);
    setRatingFilter(null);
    setCategoryFilter(null);
  };
  
  // Group cards by category
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
  
  // Handle type change
  const handleTypeChange = (newType: 'food' | 'entertainment') => {
    setTypeFilter(newType);
    setCategoryFilter(null); // Reset category filter when changing types
  };
  
  return (
    <GridLayout title="Browse Catalog">
      <div className="flex flex-col space-y-4 max-w-5xl mx-auto w-full">
        {/* Type toggle */}
        <div className="flex justify-center mb-2">
          <div className="bg-catalog-cream rounded-full p-1 inline-flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTypeChange('food')}
              className={`rounded-full px-4 ${
                typeFilter === 'food' 
                ? 'bg-white text-catalog-softBrown shadow-sm' 
                : 'text-catalog-softBrown/70 hover:text-catalog-softBrown'
              }`}
            >
              <Utensils className="h-4 w-4 mr-2" />
              Bites
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTypeChange('entertainment')}
              className={`rounded-full px-4 ${
                typeFilter === 'entertainment' 
                ? 'bg-white text-catalog-softBrown shadow-sm' 
                : 'text-catalog-softBrown/70 hover:text-catalog-softBrown'
              }`}
            >
              <Film className="h-4 w-4 mr-2" />
              Blockbusters
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="search">
              <ListFilter className="h-4 w-4 mr-2" />
              Browse and Filter
            </TabsTrigger>
            <TabsTrigger value="byCategory">
              {typeFilter === 'food' ? (
                <Utensils className="h-4 w-4 mr-2" />
              ) : (
                <Film className="h-4 w-4 mr-2" />
              )}
              Browse by Category
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4">
            <CatalogSearch
              items={filteredCards}
              onFilteredItemsChange={() => {}}
              type={typeFilter}
              onClose={() => {}}
            />
          </TabsContent>

          <TabsContent value="byCategory">
            {/* Conditional display based on type */}
            {typeFilter === 'food' ? (
              <div className="space-y-8">
                <div className="flex flex-wrap gap-2 justify-center">
                  {foodCategories
                    .filter(category => category.type === 'food')
                    .map(category => (
                    <Badge
                      key={category.name}
                      className={`cursor-pointer flex items-center gap-1 px-3 py-1 ${
                        categoryFilter === category.name
                          ? 'bg-catalog-teal text-white hover:bg-catalog-darkTeal'
                          : `hover:bg-catalog-softBrown/20`
                      }`}
                      style={{
                        backgroundColor: categoryFilter === category.name 
                          ? undefined
                          : colorForCategory(category.name),
                        color: categoryFilter === category.name 
                          ? undefined 
                          : '#ffffff'
                      }}
                      onClick={() => handleCategoryFilterClick(category.name)}
                    >
                      {categoryTypeIcons[category.name] || <Utensils className="h-4 w-4" />}
                      {category.name} ({
                        filteredCards.filter(card => 
                          card.type === 'food' && 
                          card.category === category.name
                        ).length
                      })
                    </Badge>
                  ))}
                </div>
                
                <CategoryCardsDisplay
                  category={foodCategories.filter(category => category.type === 'food')}
                  cards={cardsByCategory}
                  colorForCategory={colorForCategory}
                  showEmptyCategories={false}
                />
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex flex-wrap gap-2 justify-center">
                  {entertainmentCategories
                    .map(category => (
                    <Badge
                      key={category.name}
                      className={`cursor-pointer flex items-center gap-1 px-3 py-1 ${
                        categoryFilter === category.name
                          ? 'bg-catalog-teal text-white hover:bg-catalog-darkTeal'
                          : `hover:bg-catalog-softBrown/20`
                      }`}
                      style={{
                        backgroundColor: categoryFilter === category.name 
                          ? undefined
                          : colorForEntertainmentCategory(category.name),
                        color: categoryFilter === category.name 
                          ? undefined 
                          : '#ffffff'
                      }}
                      onClick={() => handleEntertainmentCategoryFilterClick(category.name)}
                    >
                      {categoryTypeIcons[category.name] || <Film className="h-4 w-4" />}
                      {category.name} ({
                        filteredCards.filter(card => 
                          card.type === 'entertainment' && 
                          (card as any).entertainmentType === category.name
                        ).length
                      })
                    </Badge>
                  ))}
                </div>
                
                <EntertainmentCategoryDrawers
                  categories={entertainmentCategories}
                  cards={cardsByCategory}
                  colorForCategory={colorForEntertainmentCategory}
                  showEmptyCategories={false}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </GridLayout>
  );
};

export default BrowsePage;

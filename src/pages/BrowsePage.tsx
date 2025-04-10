
import React from "react";
import { useNavigate } from "react-router-dom";
import CatalogSearch from "@/components/CatalogSearch";
import GridLayout from "@/components/GridLayout";
import { useBrowseState } from "@/hooks/useBrowseState";
import { getAllCategories, getAllEntertainmentCategories } from "@/utils/categoryUtils";
import { useCategoryColors } from "@/components/bites/useCategoryColors";
import { groupCardsByCategory } from "@/utils/categoryHelpers";

// Import refactored components
import TypeToggle from "@/components/browse/TypeToggle";
import BrowseTabs from "@/components/browse/BrowseTabs";
import CategoryFilters from "@/components/browse/CategoryFilters";
import FoodCategoryDisplay from "@/components/browse/FoodCategoryDisplay";
import EntertainmentCategoryDisplay from "@/components/browse/EntertainmentCategoryDisplay";
import { Button } from "@/components/ui/button";
import { Utensils, Film } from "lucide-react";

const BrowsePage = () => {
  const navigate = useNavigate();
  const {
    typeFilter,
    categoryFilter,
    activeTab,
    setActiveTab,
    filteredCards,
    handleCategoryFilterClick,
    handleTypeChange,
  } = useBrowseState();
  
  const { colorForCategory, colorForEntertainmentCategory } = useCategoryColors();
  
  // Get food categories
  const foodCategories = getAllCategories();
  
  // Get entertainment categories
  const entertainmentCategories = getAllEntertainmentCategories();

  // Group cards by category
  const cardsByCategory = groupCardsByCategory(
    filteredCards, 
    typeFilter, 
    foodCategories, 
    entertainmentCategories
  );
  
  // Navigate to dedicated pages
  const navigateToBites = () => {
    navigate('/bites');
  };
  
  const navigateToBlockbusters = () => {
    navigate('/blockbusters');
  };

  return (
    <GridLayout title="Browse Catalog">
      <div className="flex flex-col space-y-4 max-w-5xl mx-auto w-full">
        {/* Browse Options */}
        <div className="flex flex-col items-center justify-center py-6 px-4 space-y-6">
          <h2 className="text-2xl font-bold text-catalog-softBrown">Browse By Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            {/* Bites Browse Card */}
            <div className="bg-catalog-cream rounded-lg p-6 shadow-md flex flex-col items-center space-y-4 hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-white p-4">
                <Utensils className="h-10 w-10 text-catalog-softBrown" />
              </div>
              <h3 className="text-xl font-medium text-catalog-softBrown">Browse Bites</h3>
              <p className="text-center text-gray-600">Explore your food favorites by cuisine, restaurant type, and more</p>
              <Button 
                size="lg" 
                onClick={navigateToBites} 
                className="bg-catalog-softBrown text-white hover:bg-catalog-softBrown/90 w-full"
              >
                <Utensils className="mr-2 h-5 w-5" />
                Browse Bites
              </Button>
            </div>
            
            {/* Blockbusters Browse Card */}
            <div className="bg-catalog-cream rounded-lg p-6 shadow-md flex flex-col items-center space-y-4 hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-white p-4">
                <Film className="h-10 w-10 text-catalog-softBrown" />
              </div>
              <h3 className="text-xl font-medium text-catalog-softBrown">Browse Blockbusters</h3>
              <p className="text-center text-gray-600">Discover movies, shows, books and other entertainment by category</p>
              <Button 
                size="lg" 
                onClick={navigateToBlockbusters} 
                className="bg-catalog-softBrown text-white hover:bg-catalog-softBrown/90 w-full"
              >
                <Film className="mr-2 h-5 w-5" />
                Browse Blockbusters
              </Button>
            </div>
          </div>
          
          {/* Type toggle - Alternative browsing method */}
          <div className="pt-8 w-full">
            <h3 className="text-lg text-center text-gray-500 mb-4">Or quickly switch between views:</h3>
            <TypeToggle 
              currentType={typeFilter} 
              onTypeChange={handleTypeChange} 
            />
            
            <BrowseTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              typeFilter={typeFilter}
              children={{
                search: (
                  <CatalogSearch
                    items={filteredCards}
                    onFilteredItemsChange={() => {}}
                    type={typeFilter}
                    onClose={() => {}}
                  />
                ),
                byCategory: (
                  <div className="space-y-8">
                    <CategoryFilters
                      categories={typeFilter === 'food' 
                        ? foodCategories.map(cat => ({ name: cat, count: cardsByCategory[cat]?.length || 0, type: 'food' }))
                        : entertainmentCategories.map(cat => ({ name: cat, count: cardsByCategory[cat]?.length || 0 }))
                      }
                      categoryFilter={categoryFilter}
                      onCategoryFilterClick={handleCategoryFilterClick}
                      getColorForCategory={typeFilter === 'food' ? colorForCategory : colorForEntertainmentCategory}
                      filteredCards={filteredCards}
                      type={typeFilter}
                    />
                    
                    {typeFilter === 'food' ? (
                      <FoodCategoryDisplay 
                        foodCategories={foodCategories}
                        cardsByCategory={cardsByCategory}
                        colorForCategory={colorForCategory}
                      />
                    ) : (
                      <EntertainmentCategoryDisplay
                        entertainmentCategories={entertainmentCategories}
                        cardsByCategory={cardsByCategory}
                        colorForEntertainmentCategory={colorForEntertainmentCategory}
                      />
                    )}
                  </div>
                )
              }}
            />
          </div>
        </div>
      </div>
    </GridLayout>
  );
};

export default BrowsePage;

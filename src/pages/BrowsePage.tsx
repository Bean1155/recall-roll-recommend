
import React from "react";
import { CatalogCard } from "@/lib/types";
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

const BrowsePage = () => {
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
  
  return (
    <GridLayout title="Browse Catalog">
      <div className="flex flex-col space-y-4 max-w-5xl mx-auto w-full">
        {/* Type toggle */}
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
    </GridLayout>
  );
};

export default BrowsePage;

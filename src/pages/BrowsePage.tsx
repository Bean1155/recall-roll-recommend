
import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import GridLayout from "@/components/GridLayout";
import { defaultCategories, defaultEntertainmentCategories } from "@/utils/categoryUtils";
import { useBrowseState } from "@/hooks/useBrowseState";
import { useCategoryColors } from "@/components/bites/useCategoryColors";
import { getFoodCards, getEntertainmentCards } from "@/lib/data";
import { foodBrowseOptions, entertainmentBrowseOptions } from "@/utils/browseOptions";
import BrowseFilters from "@/components/browse/BrowseFilters";
import BrowseCategorySection from "@/components/browse/BrowseCategorySection";
import BrowseResults from "@/components/browse/BrowseResults";

const BrowsePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type') as 'food' | 'entertainment' | null;
  const [activeType, setActiveType] = useState<'food' | 'entertainment'>(typeParam || 'food');
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [showAllCards, setShowAllCards] = useState(false);
  
  const browseOptions = activeType === 'food' ? foodBrowseOptions : entertainmentBrowseOptions;
  const { categoryColors, colorForCategory, colorForEntertainmentCategory } = useCategoryColors([]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      const targetPath = activeType === 'entertainment' ? '/blockbusters' : '/bites';
      navigate(`${targetPath}?search=${searchTerm}&fromSearch=true`);
    }
  };
  
  const handleTypeChange = (newType: 'food' | 'entertainment') => {
    const newTypeValue = newType === 'food' ? 'food' : 'entertainment';
    setActiveType(newTypeValue);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setShowAllCards(false);
    navigate(`/browse?type=${newTypeValue}`);
  };

  const handleCategoryClick = (option: typeof browseOptions[0]) => {
    const categoryFromRoute = new URL(option.route, window.location.origin).searchParams.get('filter');
    
    if (categoryFromRoute === 'topRated') {
      navigate(`/${activeType === 'food' ? 'bites' : 'blockbusters'}?filter=topRated`);
      return;
    }
    
    if (selectedCategory === categoryFromRoute) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setShowAllCards(false);
    } else {
      setSelectedCategory(categoryFromRoute);
      setSelectedSubcategory(null);
      setShowAllCards(false);
    }
  };
  
  const handleSubcategoryClick = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setShowAllCards(true);
  };
  
  const handleCardClick = (card: CatalogCard) => {
    const targetPath = card.type === 'food' ? '/bites' : '/blockbusters';
    navigate(`${targetPath}?highlight=${card.id}`);
  };

  return (
    <GridLayout title="Browse">
      <div className="flex flex-col max-w-3xl mx-auto w-full">
        <BrowseFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeType={activeType}
          onTypeChange={handleTypeChange}
          onSearch={handleSearch}
        />
        
        <BrowseCategorySection
          browseOptions={browseOptions}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          onCategoryClick={handleCategoryClick}
          onSubcategoryClick={handleSubcategoryClick}
          colorForCategory={activeType === 'food' ? colorForCategory : colorForEntertainmentCategory}
        />
        
        <BrowseResults
          showAllCards={showAllCards}
          filteredCards={getFilteredCards()}
          selectedSubcategory={selectedSubcategory}
          onCloseAllCards={() => setShowAllCards(false)}
          onCardClick={handleCardClick}
          activeType={activeType}
        />
        
        {selectedSubcategory && getFilteredCards().length === 0 && (
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

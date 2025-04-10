
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CatalogCard } from "@/lib/types";
import { useFilteredCards } from "@/hooks/useFilteredCards";

export const useBrowseState = () => {
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

  // Handle category filter click
  const handleCategoryFilterClick = (categoryName: string) => {
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
  
  // Handle type change
  const handleTypeChange = (newType: 'food' | 'entertainment') => {
    setTypeFilter(newType);
    setCategoryFilter(null); // Reset category filter when changing types
  };

  return {
    locationFilter,
    setLocationFilter,
    ratingFilter,
    setRatingFilter,
    typeFilter,
    categoryFilter,
    activeTab,
    setActiveTab,
    filteredCards,
    handleCategoryFilterClick,
    clearFilters,
    handleTypeChange,
  };
};

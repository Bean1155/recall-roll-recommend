
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { FoodCard, EntertainmentCard, CatalogCard } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";

// Import our new components
import SearchContainer from "./search/SearchContainer";
import SearchHeader from "./search/SearchHeader";
import SearchInput from "./search/SearchInput";
import FilterSection from "./search/FilterSection";
import FilterSummary from "./search/FilterSummary";
import SearchButton from "./search/SearchButton";
import SearchResults from "./search/SearchResults";
import BackgroundDecorator from "./search/BackgroundDecorator";

interface CatalogSearchProps {
  items: CatalogCard[];
  onFilteredItemsChange: (filteredItems: CatalogCard[]) => void;
  type: 'food' | 'entertainment';
  onClose?: () => void;
  compact?: boolean;
}

const CatalogSearch: React.FC<CatalogSearchProps> = ({ 
  items, 
  onFilteredItemsChange,
  type,
  onClose,
  compact = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchResults, setSearchResults] = useState<CatalogCard[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const filterDescriptions = {
    all: "Show all items without filtering",
    favorites: "Show only items marked as favorites",
    topRated: "Show items with 4-5 star ratings",
    location: "Filter items by their location",
    byStatus: "Filter by status (visited, interested, etc.)",
    keywords: "Search by specific keywords or tags",
    topReferrals: "Show items most recommended by friends",
    newest: "Show the most recently added items"
  };

  const executeSearch = () => {
    let filteredItems = [...items];

    if (searchTerm) {
      filteredItems = filteredItems.filter(item => {
        const itemAsAny = item as any;
        const searchableProperties = [
          'title', 'creator', 'notes', 'location', 
          'cuisine', 'genre', 'medium', 'entertainmentCategory',
          'category', 'status'
        ];
        
        return searchableProperties.some(prop => {
          const value = itemAsAny[prop];
          return value && typeof value === 'string' && 
            value.toLowerCase().includes(searchTerm.toLowerCase());
        }) || 
        (item.tags && 
          item.tags.some(tag => 
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      });
    }

    if (selectedStatus !== "all") {
      filteredItems = filteredItems.filter(item => {
        if (type === 'food') {
          const itemStatus = (item as FoodCard).status;
          return itemStatus.startsWith(selectedStatus);
        } else {
          return (item as EntertainmentCard).status === selectedStatus;
        }
      });
    }

    if (activeFilter === "favorites") {
      filteredItems = filteredItems.filter(item => item.isFavorite);
    } else if (activeFilter === "topRated") {
      filteredItems = filteredItems.filter(item => item.rating >= 4);
    }

    filteredItems.sort((a, b) => {
      return sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating;
    });

    setSearchResults(filteredItems);
    
    onFilteredItemsChange(filteredItems);
    
    if (filteredItems.length === 0) {
      toast({
        title: "No results found",
        description: "Try different search terms or filters",
        variant: "destructive"
      });
    } else if (filteredItems.length === 1) {
      if (onClose) {
        onClose();
      } else {
        setIsSearchOpen(false);
      }
      handleCardClick(filteredItems[0]);
    } else {
      if (onClose) {
        onClose();
      } else {
        setIsSearchOpen(false);
      }
      
      const path = type === 'food' ? '/bites' : '/blockbusters';
      const resultIds = filteredItems.map(card => card.id).join(',');
      
      navigate(`${path}?searchResults=${resultIds}`);
      
      toast({
        title: `Found ${filteredItems.length} results`,
        description: "Showing matching items",
      });
    }
  };

  const handleCardClick = (card: CatalogCard) => {
    if (onClose) {
      onClose();
    } else {
      setIsSearchOpen(false);
    }
    
    const path = type === 'food' ? '/bites' : '/blockbusters';
    
    if (type === 'food') {
      const foodCard = card as FoodCard;
      navigate(`${path}?highlight=${card.id}&category=${foodCard.category}&fromSearch=true`);
    } else {
      const entertainmentCard = card as EntertainmentCard;
      navigate(`${path}?highlight=${card.id}&category=${entertainmentCard.entertainmentCategory?.toLowerCase() || 'etc.'}&fromSearch=true`);
    }
    
    toast({
      title: "Navigating to card",
      description: `Opening ${card.title}`,
    });
  };

  useEffect(() => {
    let filteredItems = [...items];

    if (searchTerm) {
      filteredItems = filteredItems.filter(item => {
        const itemAsAny = item as any;
        const searchableProperties = [
          'title', 'creator', 'notes', 'location', 
          'cuisine', 'genre', 'medium', 'entertainmentCategory',
          'category', 'status'
        ];
        
        return searchableProperties.some(prop => {
          const value = itemAsAny[prop];
          return value && typeof value === 'string' && 
            value.toLowerCase().includes(searchTerm.toLowerCase());
        }) || 
        (item.tags && 
          item.tags.some(tag => 
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      });
    }

    if (selectedStatus !== "all") {
      filteredItems = filteredItems.filter(item => {
        if (type === 'food') {
          const itemStatus = (item as FoodCard).status;
          return itemStatus.startsWith(selectedStatus);
        } else {
          return (item as EntertainmentCard).status === selectedStatus;
        }
      });
    }

    if (activeFilter === "favorites") {
      filteredItems = filteredItems.filter(item => item.isFavorite);
    } else if (activeFilter === "topRated") {
      filteredItems = filteredItems.filter(item => item.rating >= 4);
    }

    filteredItems.sort((a, b) => {
      return sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating;
    });

    setSearchResults(filteredItems);
  }, [searchTerm, selectedStatus, sortOrder, items, type, activeFilter]);

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === "desc" ? "asc" : "desc");
  };

  const handleTabChange = (value: string) => {
    setActiveFilter(value);
    if (value !== "byStatus") {
      setSelectedStatus("all");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSearchOpen]);

  const isStandalone = onClose === undefined;

  // Render the main content inside the appropriate container
  const renderSearchContent = () => (
    <>
      <SearchHeader type={type} />
      
      <div className="p-4 relative z-10" style={{ 
        ...(isMobile ? {} : { maxHeight: "calc(80vh - 80px)", overflowY: "auto" }) 
      }}>
        <SearchInput 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          onKeyDown={handleKeyDown} 
        />

        <FilterSection 
          isFiltersOpen={isFiltersOpen}
          setIsFiltersOpen={setIsFiltersOpen}
          activeFilter={activeFilter}
          handleTabChange={handleTabChange}
          filterDescriptions={filterDescriptions}
        />

        <FilterSummary 
          activeFilter={activeFilter}
          searchTerm={searchTerm}
          selectedStatus={selectedStatus}
        />

        <SearchButton onClick={executeSearch} />

        <SearchResults 
          searchResults={searchResults}
          searchTerm={searchTerm}
          handleCardClick={handleCardClick}
        />
      </div>
      
      <BackgroundDecorator />
    </>
  );

  return (
    <>
      {isStandalone ? (
        <Button 
          variant="outline" 
          onClick={() => setIsSearchOpen(true)}
          className="text-catalog-teal border-catalog-softBrown"
        >
          <Search size={18} className="mr-2" />
          Search
        </Button>
      ) : null}

      {isStandalone ? (
        <SearchContainer
          isOpen={isSearchOpen}
          onOpenChange={setIsSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        >
          {renderSearchContent()}
        </SearchContainer>
      ) : renderSearchContent()}
    </>
  );
};

export default CatalogSearch;


import React, { useState, useEffect, useCallback } from "react";
import GridLayout from "@/components/GridLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UtensilsCrossed, Film, Search, ChevronRight } from "lucide-react";
import { CatalogCard as CatalogCardType } from "@/lib/types";
import { getAllCards } from "@/lib/data";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation, useNavigate, Link } from "react-router-dom";
import CatalogSearch from "@/components/CatalogSearch";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import SearchContainer from "@/components/search/SearchContainer";

const SearchPage = () => {
  const [allCards, setAllCards] = useState<CatalogCardType[]>([]);
  const [filteredCards, setFilteredCards] = useState<CatalogCardType[]>([]);
  const [activeTab, setActiveTab] = useState<string>("food");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchType, setSearchType] = useState<'food' | 'entertainment'>('food');
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useUser();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get('type');
    
    const cards = getAllCards();
    const initialCards = typeParam ? 
      cards.filter(card => card.type === typeParam) : 
      cards.filter(card => card.type === 'food');
    
    setAllCards(cards);
    setFilteredCards(initialCards);
    
    if (typeParam === 'entertainment') {
      setActiveTab('entertainment');
      setSearchType('entertainment');
    } else {
      setActiveTab('food');
      setSearchType('food');
    }
    
    // Delay opening search to ensure everything is ready
    setTimeout(() => {
      setIsSearchOpen(true);
    }, 300);
  }, [location.search]);

  const getPageTitle = () => {
    return "Search Catalog";
  };

  const handleCatalogTypeChange = useCallback((value: string) => {
    setActiveTab(value);
    
    if (value === 'food') {
      setSearchType('food');
    } else if (value === 'entertainment') {
      setSearchType('entertainment');
    }
    
    setTimeout(() => setIsSearchOpen(true), 300);
  }, []);

  const handleFilteredItemsChange = useCallback((items: CatalogCardType[]) => {
    setFilteredCards(items);
  }, []);

  const foodTabBgColor = "#FDE1D3";  // Pink (Bites) from the header
  const entertainmentTabBgColor = "#D6E5F0"; // Blue (Blockbusters) from the header

  const handleSearchClose = useCallback(() => {
    setIsSearchOpen(false);
    
    if (!location.pathname.includes('/search')) {
      navigate('/');
    }
  }, [location.pathname, navigate]);

  const openSearchDrawer = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  // Browse categories for quick access
  const browseCategories = [
    { title: "Favorites", icon: "Heart", path: "/browse" },
    { title: "Highest Rated", icon: "Star", path: "/browse" },
    { title: "By Location", icon: "MapPin", path: "/browse" },
    { title: "Most Recent", icon: "Clock", path: "/browse" },
  ];

  return (
    <GridLayout title={getPageTitle()}>
      <div className="max-w-5xl mx-auto">
        <Tabs value={activeTab} onValueChange={handleCatalogTypeChange} className="mb-6">
          <TabsList className="w-full bg-transparent p-0 rounded-md mb-4 flex gap-4">
            <TabsTrigger 
              value="food" 
              className="flex items-center gap-2 flex-1 py-3 rounded-md border-2 transition-colors text-black font-medium"
              style={{
                backgroundColor: foodTabBgColor,
                borderColor: activeTab === "food" ? "#d2b48c" : "transparent",
                boxShadow: activeTab === "food" ? "0 2px 4px rgba(0,0,0,0.1)" : "none"
              }}
              onClick={() => {
                setSearchType('food');
                setTimeout(() => setIsSearchOpen(true), 300);
              }}
            >
              <UtensilsCrossed size={18} />
              Bites
            </TabsTrigger>
            <TabsTrigger 
              value="entertainment" 
              className="flex items-center gap-2 flex-1 py-3 rounded-md border-2 transition-colors text-black font-medium"
              style={{
                backgroundColor: entertainmentTabBgColor,
                borderColor: activeTab === "entertainment" ? "#d2b48c" : "transparent",
                boxShadow: activeTab === "entertainment" ? "0 2px 4px rgba(0,0,0,0.1)" : "none"
              }}
              onClick={() => {
                setSearchType('entertainment');
                setTimeout(() => setIsSearchOpen(true), 300);
              }}
            >
              <Film size={18} />
              Blockbusters
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="food" className="mt-0">
            <div className="p-4 text-center">
              <Button 
                onClick={openSearchDrawer}
                className="bg-[#1A7D76] hover:bg-[#166661] px-8 py-3 rounded-2xl font-typewriter text-white flex items-center gap-2 mx-auto"
                type="button"
              >
                <Search size={18} />
                Search Food Catalog
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="entertainment" className="mt-0">
            <div className="p-4 text-center">
              <Button 
                onClick={openSearchDrawer}
                className="bg-[#1A7D76] hover:bg-[#166661] px-8 py-3 rounded-2xl font-typewriter text-white flex items-center gap-2 mx-auto"
                type="button"
              >
                <Search size={18} />
                Search Entertainment Catalog
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* New Browse By section */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Browse by</h2>
          <div className="space-y-0.5 rounded-lg bg-gray-100 overflow-hidden">
            <Link 
              to="/browse"
              className="w-full hover:bg-gray-200 py-4 px-4 flex justify-between items-center transition-colors border-b border-gray-200 bg-white"
            >
              <span className="text-lg">All Categories</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
            {browseCategories.map((category) => (
              <Link
                key={category.title}
                to={category.path}
                className="w-full hover:bg-gray-200 py-4 px-4 flex justify-between items-center transition-colors border-b border-gray-200 last:border-0 bg-white"
              >
                <span className="text-lg">{category.title}</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <SearchContainer
        isOpen={isSearchOpen}
        onOpenChange={(open) => {
          setIsSearchOpen(open);
        }}
        onClose={handleSearchClose}
      >
        <CatalogSearch 
          items={searchType === 'food' 
            ? allCards.filter(card => card.type === 'food')
            : allCards.filter(card => card.type === 'entertainment')
          }
          onFilteredItemsChange={handleFilteredItemsChange}
          type={searchType}
          onClose={handleSearchClose}
          compact={true}
        />
      </SearchContainer>
    </GridLayout>
  );
};

export default SearchPage;

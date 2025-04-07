
import React, { useState, useEffect } from "react";
import GridLayout from "@/components/GridLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UtensilsCrossed, Film, Search } from "lucide-react";
import { CatalogCard as CatalogCardType } from "@/lib/types";
import { getAllCards } from "@/lib/data";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerOverlay } from "@/components/ui/drawer";
import CatalogSearch from "@/components/CatalogSearch";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";

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
    
    // Auto-open search when component mounts
    setTimeout(() => {
      setIsSearchOpen(true);
    }, 100);
  }, [location.search]);

  const getPageTitle = () => {
    return "Search Catalog";
  };

  const handleCatalogTypeChange = (value: string) => {
    setActiveTab(value);
    
    if (value === 'food') {
      setSearchType('food');
    } else if (value === 'entertainment') {
      setSearchType('entertainment');
    }
    
    // Ensure search reopens after changing tab
    setTimeout(() => setIsSearchOpen(true), 100);
  };

  const handleFilteredItemsChange = (items: CatalogCardType[]) => {
    setFilteredCards(items);
  };

  const foodTabBgColor = "#FDE1D3";  // Pink (Bites) from the header
  const entertainmentTabBgColor = "#D6E5F0"; // Blue (Blockbusters) from the header

  const handleSearchClose = () => {
    // Don't navigate away on the search page, just toggle the drawer
    if (location.pathname.includes('/search')) {
      // Force it to reopen after a brief moment
      setIsSearchOpen(false);
      setTimeout(() => setIsSearchOpen(true), 100);
    } else {
      setTimeout(() => navigate('/'), 300);
    }
  };

  // Function to manually trigger the search drawer
  const openSearchDrawer = () => {
    setIsSearchOpen(true);
  };

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
                setIsSearchOpen(true);
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
                setIsSearchOpen(true);
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
              >
                <Search size={18} />
                Search Entertainment Catalog
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Display search UI */}
      {isMobile ? (
        <Drawer
          open={isSearchOpen}
          onOpenChange={(open) => {
            setIsSearchOpen(open);
            // Auto-reopen on search page
            if (!open && location.pathname.includes('/search')) {
              setTimeout(() => setIsSearchOpen(true), 200);
            }
          }}
        >
          <DrawerOverlay className="bg-black/70 backdrop-blur-sm" />
          <DrawerContent className="p-0 border-t-4 border-t-[#d2b48c] border-x border-x-[#d2b48c] border-b border-b-[#d2b48c] bg-[#FAF3E3] rounded-t-xl overflow-visible shadow-lg" style={{ maxHeight: "95vh" }}>
            <div className="relative overflow-y-auto pb-6">
              {/* Decorative line connecting to the button */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-[#d2b48c] rounded-b-md"></div>
              
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
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DialogOverlay className="bg-black/70 backdrop-blur-sm" />
          <DialogContent 
            className="p-0 border-0 shadow-none bg-transparent"
            style={{ maxWidth: "90vw", width: "550px" }}
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
          </DialogContent>
        </Dialog>
      )}
    </GridLayout>
  );
};

export default SearchPage;

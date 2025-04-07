
import React, { useState, useEffect } from "react";
import GridLayout from "@/components/GridLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UtensilsCrossed, Film } from "lucide-react";
import { CatalogCard as CatalogCardType } from "@/lib/types";
import { getAllCards } from "@/lib/data";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerOverlay } from "@/components/ui/drawer";
import CatalogSearch from "@/components/CatalogSearch";
import { useUser } from "@/contexts/UserContext";

const SearchPage = () => {
  const [allCards, setAllCards] = useState<CatalogCardType[]>([]);
  const [filteredCards, setFilteredCards] = useState<CatalogCardType[]>([]);
  const [activeTab, setActiveTab] = useState<string>("food");
  const [isSearchOpen, setIsSearchOpen] = useState(true); // Auto-open search on page load
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

    // Automatically open search when page loads
    setIsSearchOpen(true);
  }, [location.search]);

  const getPageTitle = () => {
    return "Search Catalog";
  };

  const handleCatalogTypeChange = (value: string) => {
    setActiveTab(value);
    
    if (value === 'food') {
      setSearchType('food');
      setIsSearchOpen(true);
    } else if (value === 'entertainment') {
      setSearchType('entertainment');
      setIsSearchOpen(true);
    }
  };

  const handleFilteredItemsChange = (items: CatalogCardType[]) => {
    setFilteredCards(items);
  };

  const foodTabBgColor = "#FDE1D3";  // Pink (Bites) from the header
  const entertainmentTabBgColor = "#D6E5F0"; // Blue (Blockbusters) from the header

  // Modified close action - don't navigate away when coming from browse action
  const handleSearchClose = () => {
    setIsSearchOpen(false);
    
    // Only navigate back if not coming from a browse action (which would be /search path)
    if (!location.pathname.includes('/search')) {
      setTimeout(() => navigate('/'), 300);
    }
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
            >
              <Film size={18} />
              Blockbusters
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="food" className="mt-0">
            <div className="p-6 text-center">
              <p className="text-lg font-typewriter text-vintage-red">
                Click and Search and Recall
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="entertainment" className="mt-0">
            <div className="p-6 text-center">
              <p className="text-lg font-typewriter text-vintage-red">
                Click and Search and Recall
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {isMobile ? (
        <Drawer
          open={isSearchOpen}
          onOpenChange={setIsSearchOpen}
        >
          <DrawerOverlay className="bg-black/70 backdrop-blur-sm fixed inset-0" />
          <DrawerContent 
            className="p-0 border-t-2 border-catalog-softBrown bg-[#FAF3E3] rounded-t-xl w-full"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              height: "100%",
              maxHeight: "none",
              margin: 0,
            }}
          >
            <div className="flex-1 overflow-auto">
              <CatalogSearch 
                items={searchType === 'food' 
                  ? allCards.filter(card => card.type === 'food')
                  : allCards.filter(card => card.type === 'entertainment')
                }
                onFilteredItemsChange={handleFilteredItemsChange}
                type={searchType}
                onClose={handleSearchClose}
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
            />
          </DialogContent>
        </Dialog>
      )}
    </GridLayout>
  );
};

export default SearchPage;

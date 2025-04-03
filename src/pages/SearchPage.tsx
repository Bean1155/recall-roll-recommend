import React, { useState, useEffect } from "react";
import GridLayout from "@/components/GridLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UtensilsCrossed, Film } from "lucide-react";
import { CatalogCard as CatalogCardType } from "@/lib/types";
import { getAllCards } from "@/lib/data";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import CatalogSearch from "@/components/CatalogSearch";

const SearchPage = () => {
  const [allCards, setAllCards] = useState<CatalogCardType[]>([]);
  const [filteredCards, setFilteredCards] = useState<CatalogCardType[]>([]);
  const [activeTab, setActiveTab] = useState<string>("food");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchType, setSearchType] = useState<'food' | 'entertainment'>('food');
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();

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

  // Colors that match the navigation bar in the home page header
  const foodTabBgColor = "#FDE1D3";  // Pink (Bites) from the header
  const entertainmentTabBgColor = "#D6E5F0"; // Blue (Blockbusters) from the header

  return (
    <GridLayout title={getPageTitle()}>
      <div className="max-w-5xl mx-auto">
        <Tabs value={activeTab} onValueChange={handleCatalogTypeChange} className="mb-6">
          <TabsList className="w-full bg-gray-100 p-1 rounded-md mb-4">
            <TabsTrigger 
              value="food" 
              className="flex items-center gap-2 flex-1 text-catalog-softBrown hover:bg-opacity-80 transition-colors"
              style={{
                backgroundColor: activeTab === "food" ? foodTabBgColor : "transparent",
                color: activeTab === "food" ? "#5d4037" : undefined
              }}
            >
              <UtensilsCrossed size={16} />
              Bites
            </TabsTrigger>
            <TabsTrigger 
              value="entertainment" 
              className="flex items-center gap-2 flex-1 text-catalog-softBrown hover:bg-opacity-80 transition-colors"
              style={{
                backgroundColor: activeTab === "entertainment" ? entertainmentTabBgColor : "transparent",
                color: activeTab === "entertainment" ? "#5d4037" : undefined
              }}
            >
              <Film size={16} />
              Blockbusters
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="food" className="mt-0">
            <div className="p-6 text-center">
              <p className="text-lg text-catalog-softBrown">
                Click Bites or Blockbusters tab above to begin your search.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="entertainment" className="mt-0">
            <div className="p-6 text-center">
              <p className="text-lg text-catalog-softBrown">
                Click Bites or Blockbusters tab above to begin your search.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogOverlay className="bg-black/70 backdrop-blur-sm" />
        <DialogContent 
          className="p-0 border-0 shadow-none bg-transparent"
          style={{ maxWidth: "90vw", width: "500px" }}
        >
          <CatalogSearch 
            items={searchType === 'food' 
              ? allCards.filter(card => card.type === 'food')
              : allCards.filter(card => card.type === 'entertainment')
            }
            onFilteredItemsChange={handleFilteredItemsChange}
            type={searchType}
            onClose={() => setIsSearchOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </GridLayout>
  );
};

export default SearchPage;

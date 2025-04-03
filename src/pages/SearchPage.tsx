import React, { useState, useEffect } from "react";
import GridLayout from "@/components/GridLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  UtensilsCrossed,
  Film,
  Search,
  Star,
  Heart,
  MapPin,
  Tag,
  Clock,
  Share2,
  FileText
} from "lucide-react";
import { CatalogCard as CatalogCardType, FoodCard, EntertainmentCard } from "@/lib/types";
import { getAllCards } from "@/lib/data";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CatalogSearch from "@/components/CatalogSearch";

const SearchPage = () => {
  const [allCards, setAllCards] = useState<CatalogCardType[]>([]);
  const [filteredCards, setFilteredCards] = useState<CatalogCardType[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("all");
  const isMobile = useIsMobile();
  const location = useLocation();

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

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get('type');
    
    const cards = getAllCards();
    const initialCards = typeParam ? 
      cards.filter(card => card.type === typeParam) : 
      cards;
    
    setAllCards(cards);
    setFilteredCards(initialCards);
    
    if (typeParam === 'food') {
      setActiveTab('food');
    } else if (typeParam === 'entertainment') {
      setActiveTab('entertainment');
    } else {
      setActiveTab('all');
    }
  }, [location.search]);

  const getStatusOptions = () => {
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get('type');
    
    if (typeParam === 'entertainment' || activeTab === 'entertainment') {
      return ["Watched", "Want to Watch", "Currently Watching"];
    }
    
    if (typeParam === 'food' || activeTab === 'food') {
      return ["Visited", "Interested"];
    }
    
    const statusSet = new Set<string>();
    
    allCards.forEach(card => {
      if (card.type === 'food') {
        const status = (card as FoodCard).status;
        const simplifiedStatus = status.split(':')[0];
        statusSet.add(simplifiedStatus);
      } else if (card.type === 'entertainment') {
        statusSet.add((card as EntertainmentCard).status);
      }
    });
    
    return Array.from(statusSet);
  };

  const handleTabChange = (value: string) => {
    setActiveFilter(value);
    if (value !== "byStatus") {
      setSelectedStatus("all");
    }
  };

  const getPageTitle = () => {
    return "Search Catalog";
  };

  const handleFilteredItemsChange = (items: CatalogCardType[]) => {
    setFilteredCards(items);
  };

  const getCardType = () => {
    if (activeTab === 'food') {
      return 'food';
    } else if (activeTab === 'entertainment') {
      return 'entertainment';
    }
    
    return 'all';
  };

  const handleCatalogTypeChange = (value: string) => {
    setActiveTab(value);
    
    if (value === 'all') {
      setFilteredCards(allCards);
    } else {
      setFilteredCards(allCards.filter(card => card.type === value));
    }
  };

  const getCurrentCards = () => {
    if (activeTab === 'all') return filteredCards;
    return filteredCards.filter(card => card.type === activeTab);
  };

  return (
    <GridLayout title={getPageTitle()}>
      <div className="max-w-5xl mx-auto">
        <Tabs value={activeTab} onValueChange={handleCatalogTypeChange} className="mb-6">
          <TabsList className="w-full bg-gray-100 p-1 rounded-md mb-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Search size={16} />
              All Catalog
            </TabsTrigger>
            <TabsTrigger value="food" className="flex items-center gap-2">
              <UtensilsCrossed size={16} />
              Bites
            </TabsTrigger>
            <TabsTrigger value="entertainment" className="flex items-center gap-2">
              <Film size={16} />
              Blockbusters
            </TabsTrigger>
          </TabsList>
          
          <div className="flex justify-end mb-6">
            <CatalogSearch 
              items={activeTab === 'all' ? allCards : allCards.filter(card => card.type === activeTab)}
              onFilteredItemsChange={handleFilteredItemsChange}
              type={activeTab === 'entertainment' ? 'entertainment' : activeTab === 'food' ? 'food' : 'food'}
            />
          </div>

          <Tabs defaultValue="all" className="mb-6" onValueChange={handleTabChange}>
            <TabsList className="w-full bg-gray-100 p-1 rounded-md mb-4 h-14">
              <div className="grid grid-cols-4 md:grid-cols-8 gap-1 w-full">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger 
                        value="all" 
                        className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                      >
                        <Search size={18} />
                        <span className="sr-only md:not-sr-only md:ml-1">All</span>
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-catalog-softBrown">
                      {filterDescriptions.all}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger 
                        value="favorites" 
                        className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                      >
                        <Heart size={18} />
                        <span className="sr-only md:not-sr-only md:ml-1">Favorites</span>
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-catalog-softBrown">
                      {filterDescriptions.favorites}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger 
                        value="topRated" 
                        className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                      >
                        <Star size={18} />
                        <span className="sr-only md:not-sr-only md:ml-1">Top Rated</span>
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-catalog-softBrown">
                      {filterDescriptions.topRated}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger 
                        value="newest" 
                        className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                      >
                        <Clock size={18} />
                        <span className="sr-only md:not-sr-only md:ml-1">Newest</span>
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-catalog-softBrown">
                      {filterDescriptions.newest}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger 
                        value="location" 
                        className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                      >
                        <MapPin size={18} />
                        <span className="sr-only md:not-sr-only md:ml-1">Location</span>
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-catalog-softBrown">
                      {filterDescriptions.location}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger 
                        value="byStatus" 
                        className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                      >
                        <FileText size={18} />
                        <span className="sr-only md:not-sr-only md:ml-1">By Status</span>
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-catalog-softBrown">
                      {filterDescriptions.byStatus}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger 
                        value="keywords" 
                        className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                      >
                        <Tag size={18} />
                        <span className="sr-only md:not-sr-only md:ml-1">Keywords</span>
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-catalog-softBrown">
                      {filterDescriptions.keywords}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger 
                        value="topReferrals" 
                        className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                      >
                        <Share2 size={18} />
                        <span className="sr-only md:not-sr-only md:ml-1">Most Referred</span>
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-catalog-softBrown">
                      {filterDescriptions.topReferrals}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TabsList>

            {isMobile && (
              <div className="text-sm font-medium mb-4 p-3 bg-gray-50 rounded-md text-catalog-teal">
                {activeFilter === "all" && "All Items"}
                {activeFilter === "favorites" && "Favorites"}
                {activeFilter === "topRated" && "Top Rated Items (4-5 Stars)"}
                {activeFilter === "location" && "By Location"}
                {activeFilter === "byStatus" && "By Status"}
                {activeFilter === "keywords" && "By Keywords"}
                {activeFilter === "topReferrals" && "Most Recommended Items"}
                {activeFilter === "newest" && "Most Recent Items"}
              </div>
            )}

            <TabsContent value="all" className="mt-0">
              {!isMobile && <h2 className="text-xl font-bold mb-4">All Items</h2>}
            </TabsContent>
            <TabsContent value="favorites" className="mt-0">
              {!isMobile && <h2 className="text-xl font-bold mb-4">Favorite Items</h2>}
            </TabsContent>
            <TabsContent value="topRated" className="mt-0">
              {!isMobile && <h2 className="text-xl font-bold mb-4">Top Rated Items (4-5 Stars)</h2>}
            </TabsContent>
            <TabsContent value="newest" className="mt-0">
              {!isMobile && <h2 className="text-xl font-bold mb-4">Most Recent Items</h2>}
            </TabsContent>
            <TabsContent value="location" className="mt-0">
              {!isMobile && <h2 className="text-xl font-bold mb-4">Browse by Location</h2>}
            </TabsContent>
            <TabsContent value="keywords" className="mt-0">
              {!isMobile && <h2 className="text-xl font-bold mb-4">Search by Keywords</h2>}
            </TabsContent>
            <TabsContent value="topReferrals" className="mt-0">
              {!isMobile && <h2 className="text-xl font-bold mb-4">Most Recommended Items</h2>}
            </TabsContent>
            <TabsContent value="byStatus" className="mt-0">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                {!isMobile && <h2 className="text-xl font-bold">Browse by Status</h2>}
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {getStatusOptions().map((status) => (
                      <SelectItem key={status} value={status || "unknown"}>
                        {status || "Unknown Status"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {getCurrentCards().length === 0 ? (
              <div className="catalog-card p-6 bg-white text-center">
                <p className="text-catalog-softBrown">
                  {activeFilter !== "all"
                    ? "No results found. Try different search terms or filters."
                    : "Your catalog is empty. Add some items to start browsing!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCurrentCards().map(card => (
                  <Envelope 
                    key={card.id} 
                    label={card.title}
                  >
                    <CatalogCard card={card} />
                  </Envelope>
                ))}
              </div>
            )}
          </Tabs>
        </Tabs>
      </div>
    </GridLayout>
  );
};

export default SearchPage;

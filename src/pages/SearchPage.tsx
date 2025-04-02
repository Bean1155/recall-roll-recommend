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
  Heart, 
  Star, 
  MapPin, 
  TrendingUp,
  Clock,
  Search,
  Calendar
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
    
    setAllCards(initialCards);
    setFilteredCards(initialCards);
  }, [location.search]);

  const getStatusOptions = () => {
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get('type');
    
    if (typeParam === 'entertainment') {
      return ["Watched", "Want to Watch", "Currently Watching"];
    }
    
    if (typeParam === 'food') {
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
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get('type');
    
    if (typeParam === 'food') {
      return "Browse Bites";
    } else if (typeParam === 'entertainment') {
      return "Browse Blockbusters";
    }
    return "Browse Catalog";
  };

  const handleFilteredItemsChange = (items: CatalogCardType[]) => {
    setFilteredCards(items);
  };

  const getCardType = () => {
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get('type');
    
    if (typeParam === 'food') {
      return 'food';
    } else if (typeParam === 'entertainment') {
      return 'entertainment';
    }
    
    return 'food';
  };

  return (
    <GridLayout title={getPageTitle()}>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-end mb-6">
          <CatalogSearch 
            items={allCards} 
            onFilteredItemsChange={handleFilteredItemsChange}
            type={getCardType() as 'food' | 'entertainment'}
          />
        </div>

        <Tabs defaultValue="all" className="mb-6" onValueChange={handleTabChange}>
          <TabsList className="w-full bg-gray-100 p-1 rounded-md mb-4 h-14">
            <div className={`${isMobile ? 'grid grid-cols-4 gap-1' : 'grid grid-cols-8'} w-full`}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger 
                      value="all" 
                      className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                    >
                      All
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
                      className="flex items-center justify-center gap-1 text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                    >
                      <Heart size={14} className="text-pink-500" /> 
                      {!isMobile && <span>Favorites</span>}
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
                      className="flex items-center justify-center gap-1 text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                    >
                      <Star size={14} className="text-amber-500" /> 
                      {!isMobile && <span>Top Rated</span>}
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
                      className="flex items-center justify-center gap-1 text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                    >
                      <Calendar size={14} className="text-green-600" /> 
                      {!isMobile && <span>Newest</span>}
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white text-catalog-softBrown">
                    {filterDescriptions.newest}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {isMobile && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger 
                        value="location" 
                        className="flex items-center justify-center gap-1 text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                      >
                        <MapPin size={14} className="text-blue-500" />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-catalog-softBrown">
                      {filterDescriptions.location}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {isMobile && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger 
                        value="byStatus" 
                        className="flex items-center justify-center gap-1 text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                      >
                        <Clock size={14} className="text-purple-500" />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-catalog-softBrown">
                      {filterDescriptions.byStatus}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {isMobile && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger 
                        value="keywords" 
                        className="flex items-center justify-center gap-1 text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                      >
                        <Search size={14} className="text-gray-500" />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-catalog-softBrown">
                      {filterDescriptions.keywords}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {isMobile && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger 
                        value="topReferrals" 
                        className="flex items-center justify-center gap-1 text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                      >
                        <TrendingUp size={14} className="text-green-500" />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-catalog-softBrown">
                      {filterDescriptions.topReferrals}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {!isMobile && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger 
                        value="location" 
                        className="flex items-center justify-center gap-1 text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                      >
                        <MapPin size={14} className="text-blue-500" /> Location
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-catalog-softBrown">
                      {filterDescriptions.location}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {!isMobile && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger 
                        value="byStatus" 
                        className="flex items-center justify-center gap-1 text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                      >
                        <Clock size={14} className="text-purple-500" /> By Status
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-catalog-softBrown">
                      {filterDescriptions.byStatus}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {!isMobile && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger 
                        value="keywords" 
                        className="flex items-center justify-center gap-1 text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                      >
                        <Search size={14} className="text-gray-500" /> Keywords
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-catalog-softBrown">
                      {filterDescriptions.keywords}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {!isMobile && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger 
                        value="topReferrals" 
                        className="flex items-center justify-center gap-1 text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                      >
                        <TrendingUp size={14} className="text-green-500" /> Most Referred
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-catalog-softBrown">
                      {filterDescriptions.topReferrals}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
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

          {filteredCards.length === 0 ? (
            <div className="catalog-card p-6 bg-white text-center">
              <p className="text-catalog-softBrown">
                {activeFilter !== "all"
                  ? "No results found. Try different search terms or filters."
                  : "Your catalog is empty. Add some items to start browsing!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map(card => (
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
      </div>
    </GridLayout>
  );
};

export default SearchPage;

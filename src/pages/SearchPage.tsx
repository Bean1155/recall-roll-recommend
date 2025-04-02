
import React, { useState, useEffect } from "react";
import GridLayout from "@/components/GridLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Star, 
  MapPin, 
  TrendingUp,
  Clock,
  Search
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

  // Handle filter changes from CatalogSearch
  const handleFilteredItemsChange = (items: CatalogCardType[]) => {
    setFilteredCards(items);
  };

  // Determine the type for CatalogSearch
  const getCardType = () => {
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get('type');
    
    if (typeParam === 'food') {
      return 'food';
    } else if (typeParam === 'entertainment') {
      return 'entertainment';
    }
    
    // Default to 'food' if no type specified
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
          <TabsList className={`${isMobile ? 'grid grid-cols-4 gap-1 mb-4' : 'grid grid-cols-8 mb-4'}`}>
            <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-1 text-sm">
              <Heart size={14} /> {!isMobile && "Favorites"}
            </TabsTrigger>
            <TabsTrigger value="topRated" className="flex items-center gap-1 text-sm">
              <Star size={14} /> {!isMobile && "Top Rated"}
            </TabsTrigger>
            {isMobile && (
              <TabsTrigger value="location" className="flex items-center gap-1 text-sm">
                <MapPin size={14} />
              </TabsTrigger>
            )}
            {isMobile && (
              <TabsTrigger value="byStatus" className="flex items-center gap-1 text-sm">
                <Clock size={14} />
              </TabsTrigger>
            )}
            {isMobile && (
              <TabsTrigger value="keywords" className="text-sm">
                <Search size={14} />
              </TabsTrigger>
            )}
            {isMobile && (
              <TabsTrigger value="topReferrals" className="flex items-center gap-1 text-sm">
                <TrendingUp size={14} />
              </TabsTrigger>
            )}
            {!isMobile && (
              <TabsTrigger value="location" className="flex items-center gap-1">
                <MapPin size={14} /> Location
              </TabsTrigger>
            )}
            {!isMobile && (
              <TabsTrigger value="byStatus" className="flex items-center gap-1">
                <Clock size={14} /> By Status
              </TabsTrigger>
            )}
            {!isMobile && (
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
            )}
            {!isMobile && (
              <TabsTrigger value="topReferrals" className="flex items-center gap-1">
                <TrendingUp size={14} /> Most Referred
              </TabsTrigger>
            )}
          </TabsList>

          {isMobile && (
            <div className="text-sm font-medium mb-2 text-catalog-teal">
              {activeFilter === "all" && "All Items"}
              {activeFilter === "favorites" && "Favorites"}
              {activeFilter === "topRated" && "Top Rated Items (4-5 Stars)"}
              {activeFilter === "location" && "By Location"}
              {activeFilter === "byStatus" && "By Status"}
              {activeFilter === "keywords" && "By Keywords"}
              {activeFilter === "topReferrals" && "Most Recommended Items"}
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

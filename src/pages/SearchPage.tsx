
import React, { useState, useEffect } from "react";
import GridLayout from "@/components/GridLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Star, 
  Heart, 
  MapPin, 
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Clock,
  Check,
  Utensils,
  Clapperboard
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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useUser } from "@/contexts/UserContext";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [allCards, setAllCards] = useState<CatalogCardType[]>([]);
  const [filteredCards, setFilteredCards] = useState<CatalogCardType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [drawerCards, setDrawerCards] = useState<CatalogCardType[]>([]);
  const [activeDrawerType, setActiveDrawerType] = useState<"food" | "entertainment" | null>(null);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { userName } = useUser();

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

  useEffect(() => {
    let results = allCards;

    if (searchTerm) {
      results = results.filter(card => 
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.type === 'food' && (card as FoodCard).cuisine.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (card.type === 'entertainment' && (card as EntertainmentCard).genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (card.type === 'food' && (card as FoodCard).status.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (card.type === 'entertainment' && (card as EntertainmentCard).status.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (activeFilter === "favorites") {
      results = results.filter(card => card.recommendationBadge === "Favorite");
    } else if (activeFilter === "topRated") {
      results = results.filter(card => card.rating >= 4);
    } else if (activeFilter === "location") {
      if (searchTerm) {
        results = results.filter(card => 
          card.type === 'food' && (card as FoodCard).location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    } else if (activeFilter === "topReferrals") {
      results = results.filter(card => card.recommendedTo && card.recommendedTo.length > 0)
        .sort((a, b) => {
          const aCount = a.recommendedTo?.length || 0;
          const bCount = b.recommendedTo?.length || 0;
          return sortOrder === "desc" ? bCount - aCount : aCount - bCount;
        });
    } else if (activeFilter === "byStatus") {
      if (selectedStatus !== "all") {
        results = results.filter(card => {
          if (card.type === 'food') {
            return (card as FoodCard).status === selectedStatus;
          } else if (card.type === 'entertainment') {
            return (card as EntertainmentCard).status === selectedStatus;
          }
          return false;
        });
      } else if (searchTerm) {
        results = results.filter(card => {
          if (card.type === 'food') {
            return (card as FoodCard).status.toLowerCase().includes(searchTerm.toLowerCase());
          } else if (card.type === 'entertainment') {
            return (card as EntertainmentCard).status.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return false;
        });
      }
    }

    if (activeFilter !== "topReferrals") {
      results = results.sort((a, b) => {
        return sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating;
      });
    }

    setFilteredCards(results);
  }, [searchTerm, activeFilter, sortOrder, allCards, selectedStatus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === "desc" ? "asc" : "desc");
  };

  const getStatusOptions = () => {
    const statusSet = new Set<string>();
    
    allCards.forEach(card => {
      if (card.type === 'food') {
        statusSet.add((card as FoodCard).status);
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

  const getSearchPlaceholder = () => {
    if (activeFilter === "location") {
      return "Search by location...";
    } else if (activeFilter === "keywords") {
      return "Search by keywords...";
    } else if (activeFilter === "byStatus") {
      return "Search by status...";
    } else {
      return "Search by title, creator...";
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

  const handleDrawerOpen = (type: "food" | "entertainment") => {
    setActiveDrawerType(type);
    // Filter cards based on the drawer type
    const cards = allCards.filter(card => card.type === type);
    setDrawerCards(cards);
  };

  const showFoodDrawer = !location.search || location.search.includes('type=food');
  const showEntertainmentDrawer = !location.search || location.search.includes('type=entertainment');

  return (
    <GridLayout title={getPageTitle()}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 mb-10">
          {showFoodDrawer && (
            <Drawer onOpenChange={(open) => {
              if (open) handleDrawerOpen("food");
            }}>
              <DrawerTrigger asChild>
                <div
                  className="relative flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
                  style={{ width: "200px" }}
                >
                  <div className="bg-[#d4a76a] rounded-lg h-16 w-full flex items-center justify-center shadow-md border border-[#b38c50]">
                    <Utensils className="text-[#5c4a2a] h-8 w-8" />
                  </div>
                  <div className="bg-[#e0b77e] rounded-md h-10 w-full mt-1 flex items-center justify-center shadow-md border border-[#b38c50]">
                    <div className="h-1 w-16 bg-[#8a6c3c] rounded-full" />
                  </div>
                  <p className="mt-2 font-typewriter text-lg font-semibold text-[#5c4a2a]">
                    BITES
                  </p>
                </div>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-6xl">
                  <DrawerHeader>
                    <DrawerTitle className="text-2xl font-typewriter text-catalog-softBrown">
                      Your Bites Collection
                    </DrawerTitle>
                    <DrawerDescription>
                      {userName}'s food experiences catalog
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 pb-10">
                    {drawerCards.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-lg text-catalog-softBrown">
                          Your food catalog is empty.
                        </p>
                      </div>
                    ) : (
                      <Carousel className="w-full">
                        <CarouselContent>
                          {drawerCards.map((card) => (
                            <CarouselItem key={card.id} className={isMobile ? "basis-full" : "md:basis-1/2 lg:basis-1/3"}>
                              <div className="p-1">
                                <Envelope label={card.title}>
                                  <CatalogCard card={card} />
                                </Envelope>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <div className="flex justify-end gap-2 mt-4">
                          <CarouselPrevious className="relative static left-0 right-0 translate-y-0 bg-catalog-teal text-white hover:bg-catalog-darkTeal" />
                          <CarouselNext className="relative static left-0 right-0 translate-y-0 bg-catalog-teal text-white hover:bg-catalog-darkTeal" />
                        </div>
                      </Carousel>
                    )}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          )}

          {showEntertainmentDrawer && (
            <Drawer onOpenChange={(open) => {
              if (open) handleDrawerOpen("entertainment");
            }}>
              <DrawerTrigger asChild>
                <div
                  className="relative flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
                  style={{ width: "200px" }}
                >
                  <div className="bg-[#d4a76a] rounded-lg h-16 w-full flex items-center justify-center shadow-md border border-[#b38c50]">
                    <Clapperboard className="text-[#5c4a2a] h-8 w-8" />
                  </div>
                  <div className="bg-[#e0b77e] rounded-md h-10 w-full mt-1 flex items-center justify-center shadow-md border border-[#b38c50]">
                    <div className="h-1 w-16 bg-[#8a6c3c] rounded-full" />
                  </div>
                  <p className="mt-2 font-typewriter text-lg font-semibold text-[#5c4a2a]">
                    BLOCKBUSTERS
                  </p>
                </div>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-6xl">
                  <DrawerHeader>
                    <DrawerTitle className="text-2xl font-typewriter text-catalog-softBrown">
                      Your Blockbusters Collection
                    </DrawerTitle>
                    <DrawerDescription>
                      {userName}'s entertainment experiences catalog
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 pb-10">
                    {drawerCards.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-lg text-catalog-softBrown">
                          Your entertainment catalog is empty.
                        </p>
                      </div>
                    ) : (
                      <Carousel className="w-full">
                        <CarouselContent>
                          {drawerCards.map((card) => (
                            <CarouselItem key={card.id} className={isMobile ? "basis-full" : "md:basis-1/2 lg:basis-1/3"}>
                              <div className="p-1">
                                <Envelope label={card.title}>
                                  <CatalogCard card={card} />
                                </Envelope>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <div className="flex justify-end gap-2 mt-4">
                          <CarouselPrevious className="relative static left-0 right-0 translate-y-0 bg-catalog-teal text-white hover:bg-catalog-darkTeal" />
                          <CarouselNext className="relative static left-0 right-0 translate-y-0 bg-catalog-teal text-white hover:bg-catalog-darkTeal" />
                        </div>
                      </Carousel>
                    )}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          )}
        </div>

        <form 
          onSubmit={handleSearch} 
          className={`flex flex-col md:flex-row mb-6 ${isMobile ? 'gap-2' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={`flex-1 relative ${isMobile ? 'mb-2' : ''}`}>
            <Input
              type="text"
              placeholder={getSearchPlaceholder()}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full border-catalog-softBrown transition-all duration-300 ${isHovered ? 'border-catalog-teal shadow-sm' : ''}`}
            />
            {searchTerm && (
              <Button 
                type="button" 
                variant="ghost" 
                className="absolute right-10 top-0 h-full p-2"
                onClick={() => setSearchTerm("")}
              >
                ×
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className={`transition-all duration-300 ${isHovered ? 'bg-catalog-darkTeal scale-105' : 'bg-catalog-teal'}`}
            >
              <Search size={18} />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={toggleSortOrder}
              className="border-catalog-softBrown"
              title={sortOrder === "desc" ? "Highest to Lowest" : "Lowest to Highest"}
            >
              {sortOrder === "desc" ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
            </Button>
          </div>
        </form>

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
                {searchTerm || activeFilter !== "all"
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

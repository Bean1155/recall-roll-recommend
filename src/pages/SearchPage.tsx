
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
  ArrowDown
} from "lucide-react";
import { CatalogCard as CatalogCardType, FoodCard, EntertainmentCard } from "@/lib/types";
import { getAllCards } from "@/lib/data";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { useIsMobile } from "@/hooks/use-mobile";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [allCards, setAllCards] = useState<CatalogCardType[]>([]);
  const [filteredCards, setFilteredCards] = useState<CatalogCardType[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Load all cards
    const cards = getAllCards();
    setAllCards(cards);
    setFilteredCards(cards);
  }, []);

  useEffect(() => {
    // Apply filters and search whenever the filter, sort order or search term changes
    let results = allCards;

    // Apply search term filtering
    if (searchTerm) {
      results = results.filter(card => 
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.type === 'food' && (card as FoodCard).cuisine.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (card.type === 'entertainment' && (card as EntertainmentCard).genre.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filters
    if (activeFilter === "favorites") {
      results = results.filter(card => card.recommendationBadge === "Favorite");
    } else if (activeFilter === "topRated") {
      results = results.filter(card => card.rating >= 4);
    } else if (activeFilter === "location") {
      // Filter by location for food cards
      if (searchTerm) {
        results = results.filter(card => 
          card.type === 'food' && (card as FoodCard).location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    } else if (activeFilter === "topReferrals") {
      // Cards with the most recommendations
      results = results.filter(card => card.recommendedTo && card.recommendedTo.length > 0)
        .sort((a, b) => {
          const aCount = a.recommendedTo?.length || 0;
          const bCount = b.recommendedTo?.length || 0;
          return sortOrder === "desc" ? bCount - aCount : aCount - bCount;
        });
    }

    // Apply sorting if not already sorted by referrals
    if (activeFilter !== "topReferrals") {
      results = results.sort((a, b) => {
        return sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating;
      });
    }

    setFilteredCards(results);
  }, [searchTerm, activeFilter, sortOrder, allCards]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is applied in the useEffect
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === "desc" ? "asc" : "desc");
  };

  return (
    <GridLayout title="Browse Catalog">
      <div className="max-w-5xl mx-auto">
        <form 
          onSubmit={handleSearch} 
          className="flex mb-6"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Input
            type="text"
            placeholder={activeFilter === "location" 
              ? "Search by location..." 
              : "Search by title, creator, or keywords..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`border-catalog-softBrown transition-all duration-300 ${isHovered ? 'border-catalog-teal shadow-sm' : ''}`}
          />
          <Button 
            type="submit" 
            className={`ml-2 transition-all duration-300 ${isHovered ? 'bg-catalog-darkTeal scale-105' : 'bg-catalog-teal'}`}
          >
            <Search size={18} />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={toggleSortOrder}
            className="ml-2 border-catalog-softBrown"
            title={sortOrder === "desc" ? "Highest to Lowest" : "Lowest to Highest"}
          >
            {sortOrder === "desc" ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
          </Button>
        </form>

        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveFilter}>
          <TabsList className={`${isMobile ? 'grid grid-cols-3 gap-1 mb-4' : 'grid grid-cols-6 mb-4'}`}>
            <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-1 text-sm">
              <Heart size={14} /> {!isMobile && "Favorites"}
            </TabsTrigger>
            <TabsTrigger value="topRated" className="flex items-center gap-1 text-sm">
              <Star size={14} /> {!isMobile && "Top Rated"}
            </TabsTrigger>
            {isMobile && (
              <TabsTrigger value="location" className="flex items-center gap-1 text-sm col-span-1">
                <MapPin size={14} />
              </TabsTrigger>
            )}
            {isMobile && (
              <TabsTrigger value="keywords" className="text-sm col-span-1">Keywords</TabsTrigger>
            )}
            {isMobile && (
              <TabsTrigger value="topReferrals" className="flex items-center gap-1 text-sm col-span-1">
                <TrendingUp size={14} />
              </TabsTrigger>
            )}
            {!isMobile && (
              <TabsTrigger value="location" className="flex items-center gap-1">
                <MapPin size={14} /> Location
              </TabsTrigger>
            )}
            {!isMobile && (
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
            )}
            {!isMobile && (
              <TabsTrigger value="topReferrals" className="flex items-center gap-1">
                <TrendingUp size={14} /> Top Referrals
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <h2 className="text-xl font-bold mb-4">All Items</h2>
          </TabsContent>
          <TabsContent value="favorites" className="mt-0">
            <h2 className="text-xl font-bold mb-4">Favorite Items</h2>
          </TabsContent>
          <TabsContent value="topRated" className="mt-0">
            <h2 className="text-xl font-bold mb-4">Top Rated Items (4-5 Stars)</h2>
          </TabsContent>
          <TabsContent value="location" className="mt-0">
            <h2 className="text-xl font-bold mb-4">Browse by Location</h2>
          </TabsContent>
          <TabsContent value="keywords" className="mt-0">
            <h2 className="text-xl font-bold mb-4">Search by Keywords</h2>
          </TabsContent>
          <TabsContent value="topReferrals" className="mt-0">
            <h2 className="text-xl font-bold mb-4">Most Recommended Items</h2>
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
                  label={card.type === 'food' 
                    ? (card as FoodCard).cuisine 
                    : (card as EntertainmentCard).medium
                  }
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

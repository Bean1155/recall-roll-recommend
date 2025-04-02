import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  X,
  Heart,
  Star,
  MapPin,
  TrendingUp,
  Clock,
  ChevronDown
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogClose,
  DialogPortal,
  DialogTitle,
  DialogDescription,
  DialogOverlay
} from "@/components/ui/dialog";
import { 
  Sheet,
  SheetContent,
  SheetClose,
  SheetPortal,
  SheetOverlay
} from "@/components/ui/sheet";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FoodCard, EntertainmentCard, CatalogCard } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface CatalogSearchProps {
  items: CatalogCard[];
  onFilteredItemsChange: (filteredItems: CatalogCard[]) => void;
  type: 'food' | 'entertainment';
}

const CatalogSearch: React.FC<CatalogSearchProps> = ({ 
  items, 
  onFilteredItemsChange,
  type
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
    topReferrals: "Show items most recommended by friends"
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
      setIsSearchOpen(false);
      const path = type === 'food' ? '/bites' : '/blockbusters';
      navigate(`${path}?highlight=${filteredItems[0].id}`);
      toast({
        title: "Found a match!",
        description: `Navigating to ${filteredItems[0].title}`,
      });
    } else {
      setIsSearchOpen(false);
      toast({
        title: `Found ${filteredItems.length} results`,
        description: "Showing matching items",
      });
    }
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

  const getStatusOptions = () => {
    if (type === 'entertainment') {
      return ["Watched", "Want to Watch", "Currently Watching"];
    }
    
    if (type === 'food') {
      return ["Visited", "Interested"];
    }
    
    const statusSet = new Set<string>();
    
    items.forEach(item => {
      if (type === 'food') {
        const status = (item as FoodCard).status;
        const simplifiedStatus = status.split(':')[0];
        statusSet.add(simplifiedStatus);
      } else if (type === 'entertainment') {
        statusSet.add((item as EntertainmentCard).status);
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

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsSearchOpen(true)}
        className="text-catalog-teal border-catalog-softBrown"
      >
        <Search size={18} className="mr-2" />
        Search
      </Button>

      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <DialogContent 
            className="fixed z-50 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-11/12 md:w-3/5 lg:w-2/5 max-w-md p-0 border-2 border-[#8B7D6B] shadow-lg rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "#F9F5E7",
              backgroundImage: "linear-gradient(rgba(139, 125, 107, 0.1) 1px, transparent 1px)",
              backgroundSize: "100% 28px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              maxHeight: "80vh",
              position: "relative"
            }}
          >
            <div className="bg-[#8B7D6B] w-full py-3 px-4 flex flex-col items-center justify-center">
              <div className="text-[#F9F5E7] font-serif text-lg font-bold tracking-wide">
                CATALOG CARD
              </div>
              <div className="text-[#F9F5E7] font-serif text-sm">
                {type === 'food' ? 'BITES' : 'BLOCKBUSTERS'}
              </div>
            </div>
            
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{
              background: "linear-gradient(90deg, rgba(139,125,107,0.05) 0%, rgba(139,125,107,0) 20%, rgba(139,125,107,0) 80%, rgba(139,125,107,0.05) 100%)",
              zIndex: 1
            }}></div>
            
            <div className="p-4 overflow-y-auto relative z-10" style={{ maxHeight: "calc(80vh - 80px)" }}>
              <div className="mb-4">
                <label htmlFor="search-input" className="block text-xl font-medium text-[#5d4037] mb-1 font-handwritten">
                  Search Terms
                </label>
                <div className="relative">
                  <Input
                    id="search-input"
                    type="text"
                    placeholder="Search by Title, Creator, Tags, Location, Genre, Cuisine..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full border-[#8B7D6B] pl-10 bg-[#F9F5E7] focus:ring-[#8B7D6B] focus:border-[#8B7D6B]"
                    autoFocus
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B7D6B]" size={16} />
                  {searchTerm && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => setSearchTerm("")}
                    >
                      <X size={14} />
                    </Button>
                  )}
                </div>
              </div>

              <div className="mb-4 mt-4 border-t border-[#8B7D6B]/20 pt-4">
                <Collapsible
                  open={isFiltersOpen}
                  onOpenChange={setIsFiltersOpen}
                  className="w-full"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-[#5d4037] font-handwritten">
                      Quick Filters
                    </h4>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-7 w-7 ml-2">
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform duration-200 ${isFiltersOpen ? 'rotate-180' : ''}`} 
                        />
                        <span className="sr-only">Toggle filters</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  
                  <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <Tabs defaultValue="all" className="w-full mt-2" onValueChange={handleTabChange}>
                      <TabsList className="w-full bg-[#F9F5E7] p-1 rounded-md h-14 border border-[#8B7D6B]/20 relative z-20">
                        <div className={`${isMobile ? 'grid grid-cols-4 gap-1' : 'grid grid-cols-7'} w-full`}>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <TabsTrigger 
                                  value="all" 
                                  className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm font-typewriter"
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
                                  value="location" 
                                  className="flex items-center justify-center gap-1 text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                                >
                                  <MapPin size={14} className="text-blue-500" /> 
                                  {!isMobile && <span>Location</span>}
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
                                  className="flex items-center justify-center gap-1 text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                                >
                                  <Clock size={14} className="text-purple-500" /> 
                                  {!isMobile && <span>By Status</span>}
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
                                  className="flex items-center justify-center gap-1 text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                                >
                                  <Search size={14} className="text-gray-500" /> 
                                  {!isMobile && <span>Keywords</span>}
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
                                  className="flex items-center justify-center gap-1 text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-catalog-teal data-[state=active]:shadow-sm"
                                >
                                  <TrendingUp size={14} className="text-green-500" /> 
                                  {!isMobile && <span>Most Referred</span>}
                                </TabsTrigger>
                              </TooltipTrigger>
                              <TooltipContent className="bg-white text-catalog-softBrown">
                                {filterDescriptions.topReferrals}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TabsList>
                    </Tabs>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <div className="bg-[#F9F5E7] border border-[#8B7D6B]/20 p-3 rounded-md mb-4 text-sm">
                <span className="font-medium text-[#5d4037] font-handwritten text-lg">Current Filter: </span>
                <span className="text-[#5d4037] font-handwritten text-lg">
                  {activeFilter === "all" && "All Items"}
                  {activeFilter === "favorites" && "Favorites"}
                  {activeFilter === "topRated" && "Top Rated Items (4-5 Stars)"}
                  {activeFilter === "location" && "By Location"}
                  {activeFilter === "byStatus" && "By Status"}
                  {activeFilter === "keywords" && "By Keywords"}
                  {activeFilter === "topReferrals" && "Most Recommended Items"}
                </span>
              </div>

              <div className="flex items-center text-lg text-[#5d4037] border-t border-[#8B7D6B]/20 pt-3 mt-2 font-handwritten">
                <span>
                  {searchTerm && `Searching for "${searchTerm}"`}
                  {selectedStatus !== "all" && (searchTerm ? " with " : "") + `status "${selectedStatus}"`}
                  {activeFilter !== "all" && (searchTerm || selectedStatus !== "all" ? " and " : "") + `filter: ${activeFilter}`}
                  {!searchTerm && selectedStatus === "all" && activeFilter === "all" && "No filters applied"}
                </span>
              </div>

              <div className="mt-3 flex justify-center">
                <Button 
                  onClick={executeSearch}
                  className="bg-[#8B7D6B] hover:bg-[#6B5D4B] px-8 rounded-full font-typewriter text-[#F9F5E7]"
                >
                  Search Catalog
                </Button>
              </div>

              {searchResults.length > 0 && searchTerm && (
                <div className="mt-6 border-t border-[#8B7D6B]/40 pt-4">
                  <h4 className="text-sm font-medium text-[#5d4037] mb-3 font-typewriter">Search Preview (top 3 results)</h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {searchResults.slice(0, 3).map((item) => (
                      <Card key={item.id} className="bg-catalog-cream hover:bg-vintage-tan cursor-pointer border border-catalog-softBrown/40">
                        <CardContent className="p-3" onClick={() => {
                          setIsSearchOpen(false);
                          const path = type === 'food' ? '/bites' : '/blockbusters';
                          navigate(`${path}?highlight=${item.id}`);
                        }}>
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <h5 className="font-medium font-typewriter">{item.title}</h5>
                              <p className="text-xs text-[#5d4037] font-typewriter">{item.creator}</p>
                            </div>
                            <div className="flex items-center">
                              <span className="text-amber-500">{"★".repeat(item.rating)}</span>
                              <span className="text-gray-300">{"★".repeat(5 - item.rating)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};

export default CatalogSearch;

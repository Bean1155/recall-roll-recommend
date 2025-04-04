import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  X,
  ChevronDown,
  Star,
  Heart,
  MapPin,
  Tag,
  Clock,
  Share2,
  FileText,
  ArrowDown,
  ArrowUp
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
  DialogOverlay,
  DialogHeader
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
import { useNavigate, useLocation } from "react-router-dom";

const vintageGreen = "#1A7D76";

interface CatalogSearchProps {
  items: CatalogCard[];
  onFilteredItemsChange: (filteredItems: CatalogCard[]) => void;
  type: 'food' | 'entertainment';
  onClose?: () => void;
}

const CatalogSearch: React.FC<CatalogSearchProps> = ({ 
  items, 
  onFilteredItemsChange,
  type,
  onClose
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
      if (onClose) {
        onClose();
      } else {
        setIsSearchOpen(false);
      }
      handleCardClick(filteredItems[0]);
    } else {
      if (onClose) {
        onClose();
      } else {
        setIsSearchOpen(false);
      }
      
      const path = type === 'food' ? '/bites' : '/blockbusters';
      const resultIds = filteredItems.map(card => card.id).join(',');
      
      navigate(`${path}?searchResults=${resultIds}`);
      
      toast({
        title: `Found ${filteredItems.length} results`,
        description: "Showing matching items",
      });
    }
  };

  const handleCardClick = (card: CatalogCard) => {
    if (onClose) {
      onClose();
    } else {
      setIsSearchOpen(false);
    }
    
    const path = type === 'food' ? '/bites' : '/blockbusters';
    
    if (type === 'food') {
      const foodCard = card as FoodCard;
      navigate(`${path}?highlight=${card.id}&category=${foodCard.category}&fromSearch=true`);
    } else {
      const entertainmentCard = card as EntertainmentCard;
      navigate(`${path}?highlight=${card.id}&category=${entertainmentCard.entertainmentCategory?.toLowerCase() || 'etc.'}&fromSearch=true`);
    }
    
    toast({
      title: "Navigating to card",
      description: `Opening ${card.title}`,
    });
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

  const isStandalone = onClose === undefined;

  return (
    <>
      {isStandalone ? (
        <Button 
          variant="outline" 
          onClick={() => setIsSearchOpen(true)}
          className="text-catalog-teal border-catalog-softBrown"
        >
          <Search size={18} className="mr-2" />
          Search
        </Button>
      ) : null}

      {isStandalone && isMobile ? (
        <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <SheetPortal>
            <SheetOverlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
            <SheetContent 
              side="bottom"
              className="w-full p-0 border-t-2 border-[#8B7D6B] rounded-t-xl"
              style={{
                backgroundColor: "#FAF3E3",
                backgroundImage: "linear-gradient(rgba(139, 125, 107, 0.03) 1px, transparent 1px)",
                backgroundSize: "100% 28px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                height: "85vh",
                maxHeight: "85vh",
                position: "relative",
                overflowY: "auto"
              }}
            >
              <div className="bg-[#1A7D76] w-full py-3 px-4 flex flex-col items-center justify-center sticky top-0 z-10">
                <div className="text-white font-serif text-xl font-bold tracking-wide">
                  CATALOG CARD
                </div>
                <div className="text-white/90 font-serif text-sm">
                  {type === 'food' ? 'BITES' : 'BLOCKBUSTERS'}
                </div>
              </div>
              
              <SheetClose className="absolute right-4 top-3 z-20 text-white rounded-full hover:bg-white/20">
                <X size={24} />
                <span className="sr-only">Close</span>
              </SheetClose>
              
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{
                background: "linear-gradient(90deg, rgba(139,125,107,0.02) 0%, rgba(139,125,107,0) 20%, rgba(139,125,107,0) 80%, rgba(139,125,107,0.02) 100%)",
                zIndex: 1
              }}></div>
              
              <div className="p-4 relative z-10 pb-20">
                <div className="mb-4">
                  <label htmlFor="search-input" className="block text-xl font-medium text-vintage-red mb-1 font-typewriter">
                    SEARCH TERMS
                  </label>
                  <div className="relative">
                    <Input
                      id="search-input"
                      type="text"
                      placeholder="Search by Keywords"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full border-[#8B7D6B] pl-10 bg-[#FAF3E3] focus:ring-[#8B7D6B] focus:border-[#8B7D6B]"
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
                      <h4 className="text-lg font-medium text-vintage-red font-typewriter hover:opacity-80 transition-opacity cursor-pointer"
                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
                        QUICK FILTERS
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
                        <TabsList className="w-full bg-[#FAEBD7] p-1 rounded-md h-14 border border-[#8B7D6B]/20 relative z-20">
                          <div className="grid grid-cols-4 gap-1 w-full">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <TabsTrigger 
                                    value="all" 
                                    className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                                  >
                                    <Search size={18} />
                                    <span className="sr-only">All</span>
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
                                    className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                                  >
                                    <Heart size={18} />
                                    <span className="sr-only">Favorites</span>
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
                                    className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                                  >
                                    <Star size={18} />
                                    <span className="sr-only">Top Rated</span>
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
                                    className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                                  >
                                    <MapPin size={18} />
                                    <span className="sr-only">Location</span>
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
                                    className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                                  >
                                    <FileText size={18} />
                                    <span className="sr-only">Status</span>
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
                                    value="newest" 
                                    className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                                  >
                                    <Clock size={18} />
                                    <span className="sr-only">Newest</span>
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
                                    value="keywords" 
                                    className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                                  >
                                    <Tag size={18} />
                                    <span className="sr-only">Keywords</span>
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
                                    className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                                  >
                                    <Share2 size={18} />
                                    <span className="sr-only">Most Referred</span>
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

                <div className="bg-[#FAEBD7] border border-[#8B7D6B]/20 p-3 rounded-md mb-4 text-sm">
                  <span className="font-medium text-vintage-red font-typewriter text-lg">CURRENT FILTER: </span>
                  <span className="text-[#5d4037] font-typewriter text-lg">
                    {activeFilter === "all" && "All Items"}
                    {activeFilter === "favorites" && "Favorites"}
                    {activeFilter === "topRated" && "Top Rated Items (4-5 Stars)"}
                    {activeFilter === "location" && "By Location"}
                    {activeFilter === "byStatus" && "By Status"}
                    {activeFilter === "keywords" && "By Keywords"}
                    {activeFilter === "topReferrals" && "Most Recommended Items"}
                    {activeFilter === "newest" && "Most Recent Items"}
                  </span>
                </div>

                <div className="flex items-center text-lg text-[#5d4037] border-t border-[#8B7D6B]/20 pt-3 mt-2 font-typewriter">
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
                    className="bg-[#1A7D76] hover:bg-[#166661] px-8 rounded-2xl font-typewriter text-white"
                  >
                    SEARCH CATALOG
                  </Button>
                </div>

                {searchResults.length > 0 && searchTerm && (
                  <div className="mt-6 border-t border-[#8B7D6B]/40 pt-4">
                    <h4 className="text-lg font-medium text-vintage-red mb-3 font-typewriter">SEARCH PREVIEW</h4>
                    <div className="space-y-2 overflow-y-auto">
                      {searchResults.slice(0, 3).map((item) => (
                        <Card 
                          key={item.id} 
                          className="bg-catalog-cream hover:bg-vintage-tan cursor-pointer border border-catalog-softBrown/40 transition-colors duration-150"
                          onClick={() => handleCardClick(item)}
                        >
                          <CardContent className="p-3">
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
            </SheetContent>
          </SheetPortal>
        </Sheet>
      ) : isStandalone ? (
        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DialogPortal>
            <DialogOverlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
            <DialogContent 
              className="fixed z-50 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-11/12 md:w-3/5 lg:w-2/5 max-w-md p-0 border-2 border-[#8B7D6B] shadow-lg rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "#FAF3E3",
                backgroundImage: "linear-gradient(rgba(139, 125, 107, 0.03) 1px, transparent 1px)",
                backgroundSize: "100% 28px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                maxHeight: "80vh",
                position: "relative"
              }}
            >
              <DialogHeader>
                <DialogTitle className="sr-only">Search Catalog</DialogTitle>
                <DialogDescription className="sr-only">
                  Search for items in your catalog
                </DialogDescription>
              </DialogHeader>
              
              <div className="bg-[#1A7D76] w-full py-3 px-4 flex flex-col items-center justify-center">
                <div className="text-white font-serif text-xl font-bold tracking-wide">
                  CATALOG CARD
                </div>
                <div className="text-white/90 font-serif text-sm">
                  {type === 'food' ? 'BITES' : 'BLOCKBUSTERS'}
                </div>
              </div>
              
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{
                background: "linear-gradient(90deg, rgba(139,125,107,0.02) 0%, rgba(139,125,107,0) 20%, rgba(139,125,107,0) 80%, rgba(139,125,107,0.02) 100%)",
                zIndex: 1
              }}></div>
              
              <div className="p-4 overflow-y-auto relative z-10" style={{ maxHeight: "calc(80vh - 80px)" }}>
                <div className="mb-4">
                  <label htmlFor="search-input" className="block text-xl font-medium text-vintage-red mb-1 font-typewriter">
                    SEARCH TERMS
                  </label>
                  <div className="relative">
                    <Input
                      id="search-input"
                      type="text"
                      placeholder="Search by Keywords"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                      className="w-full border-[#8B7D6B] pl-10 bg-[#FAF3E3] focus:ring-[#8B7D6B] focus:border-[#8B7D6B]"
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
                      <h4 className="text-lg font-medium text-vintage-red font-typewriter hover:opacity-80 transition-opacity cursor-pointer"
                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
                        QUICK FILTERS
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
                        <TabsList className="w-full bg-[#FAEBD7] p-1 rounded-md h-14 border border-[#8B7D6B]/20 relative z-20">
                          <div className="grid grid-cols-4 gap-1 w-full">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <TabsTrigger 
                                    value="all" 
                                    className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                                  >
                                    <Search size={18} />
                                    <span className="sr-only">All</span>
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
                                    className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                                  >
                                    <Heart size={18} />
                                    <span className="sr-only">Favorites</span>
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
                                    className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                                  >
                                    <Star size={18} />
                                    <span className="sr-only">Top Rated</span>
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
                                    className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                                  >
                                    <MapPin size={18} />
                                    <span className="sr-only">Location</span>
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
                                    className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                                  >
                                    <FileText size={18} />
                                    <span className="sr-only">Status</span>
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
                                    value="newest" 
                                    className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                                  >
                                    <Clock size={18} />
                                    <span className="sr-only">Newest</span>
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
                                    value="keywords" 
                                    className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                                  >
                                    <Tag size={18} />
                                    <span className="sr-only">Keywords</span>
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
                                    className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                                  >
                                    <Share2 size={18} />
                                    <span className="sr-only">Most Referred</span>
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

                <div className="bg-[#FAEBD7] border border-[#8B7D6B]/20 p-3 rounded-md mb-4 text-sm">
                  <span className="font-medium text-vintage-red font-typewriter text-lg">CURRENT FILTER: </span>
                  <span className="text-[#5d4037] font-typewriter text-lg">
                    {activeFilter === "all" && "All Items"}
                    {activeFilter === "favorites" && "Favorites"}
                    {activeFilter === "topRated" && "Top Rated Items (4-5 Stars)"}
                    {activeFilter === "location" && "By Location"}
                    {activeFilter === "byStatus" && "By Status"}
                    {activeFilter === "keywords" && "By Keywords"}
                    {activeFilter === "topReferrals" && "Most Recommended Items"}
                    {activeFilter === "newest" && "Most Recent Items"}
                  </span>
                </div>

                <div className="flex items-center text-lg text-[#5d4037] border-t border-[#8B7D6B]/20 pt-3 mt-2 font-typewriter">
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
                    className="bg-[#1A7D76] hover:bg-[#166661] px-8 rounded-2xl font-typewriter text-white"
                  >
                    SEARCH CATALOG
                  </Button>
                </div>

                {searchResults.length > 0 && searchTerm && (
                  <div className="mt-6 border-t border-[#8B7D6B]/40 pt-4">
                    <h4 className="text-lg font-medium text-vintage-red mb-3 font-typewriter">SEARCH PREVIEW</h4>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                      {searchResults.slice(0, 3).map((item) => (
                        <Card 
                          key={item.id} 
                          className="bg-catalog-cream hover:bg-vintage-tan cursor-pointer border border-catalog-softBrown/40 transition-colors duration-150"
                          onClick={() => handleCardClick(item)}
                        >
                          <CardContent className="p-3">
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
      ) : (
        <div 
          className="w-full p-0 border-2 border-[#8B7D6B] shadow-lg rounded-2xl overflow-hidden"
          style={{
            backgroundColor: "#FAF3E3",
            backgroundImage: "linear-gradient(rgba(139, 125, 107, 0.03) 1px, transparent 1px)",
            backgroundSize: "100% 28px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            maxHeight: "80vh",
            position: "relative"
          }}
        >
          <div className="bg-[#1A7D76] w-full py-3 px-4 flex flex-col items-center justify-center">
            <div className="text-white font-serif text-xl font-bold tracking-wide">
              CATALOG CARD
            </div>
            <div className="text-white/90 font-serif text-sm">
              {type === 'food' ? 'BITES' : 'BLOCKBUSTERS'}
            </div>
          </div>
          
          <div className="absolute top-0 right-0 p-2 z-10">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white rounded-full hover:bg-white/20"
              onClick={onClose}
            >
              <X size={18} />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{
            background: "linear-gradient(90deg, rgba(139,125,107,0.02) 0%, rgba(139,125,107,0) 20%, rgba(139,125,107,0) 80%, rgba(139,125,107,0.02) 100%)",
            zIndex: 1
          }}></div>
          
          <div className="p-4 overflow-y-auto relative z-10" style={{ maxHeight: "calc(80vh - 80px)" }}>
            <div className="mb-4">
              <label htmlFor="search-input" className="block text-xl font-medium text-vintage-red mb-1 font-typewriter">
                SEARCH TERMS
              </label>
              <div className="relative">
                <Input
                  id="search-input"
                  type="text"
                  placeholder="Search by Keywords"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                  className="w-full border-[#8B7D6B] pl-10 bg-[#FAF3E3] focus:ring-[#8B7D6B] focus:border-[#8B7D6B]"
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
                  <h4 className="text-lg font-medium text-vintage-red font-typewriter hover:opacity-80 transition-opacity cursor-pointer"
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
                    QUICK FILTERS
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
                    <TabsList className="w-full bg-[#FAEBD7] p-1 rounded-md h-14 border border-[#8B7D6B]/20 relative z-20">
                      <div className="grid grid-cols-4 gap-1 w-full">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <TabsTrigger 
                                value="all" 
                                className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                              >
                                <Search size={18} />
                                <span className="sr-only">All</span>
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
                                className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                              >
                                <Heart size={18} />
                                <span className="sr-only">Favorites</span>
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
                                className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                              >
                                <Star size={18} />
                                <span className="sr-only">Top Rated</span>
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
                                className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                              >
                                <MapPin size={18} />
                                <span className="sr-only">Location</span>
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
                                className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                              >
                                <FileText size={18} />
                                <span className="sr-only">Status</span>
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
                                value="newest" 
                                className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                              >
                                <Clock size={18} />
                                <span className="sr-only">Newest</span>
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
                                value="keywords" 
                                className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                              >
                                <Tag size={18} />
                                <span className="sr-only">Keywords</span>
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
                                className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
                              >
                                <Share2 size={18} />
                                <span className="sr-only">Most Referred</span>
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

            <div className="bg-[#FAEBD7] border border-[#8B7D6B]/20 p-3 rounded-md mb-4 text-sm">
              <span className="font-medium text-vintage-red font-typewriter text-lg">CURRENT FILTER: </span>
              <span className="text-[#5d4037] font-typewriter text-lg">
                {activeFilter === "all" && "All Items"}
                {activeFilter === "favorites" && "Favorites"}
                {activeFilter === "topRated" && "Top Rated Items (4-5 Stars)"}
                {activeFilter === "location" && "By Location"}
                {activeFilter === "byStatus" && "By Status"}
                {activeFilter === "keywords" && "By Keywords"}
                {activeFilter === "topReferrals" && "Most Recommended Items"}
                {activeFilter === "newest" && "Most Recent Items"}
              </span>
            </div>

            <div className="flex items-center text-lg text-[#5d4037] border-t border-[#8B7D6B]/20 pt-3 mt-2 font-typewriter">
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
                className="bg-[#1A7D76] hover:bg-[#166661] px-8 rounded-2xl font-typewriter text-white"
              >
                SEARCH CATALOG
              </Button>
            </div>

            {searchResults.length > 0 && searchTerm && (
              <div className="mt-6 border-t border-[#8B7D6B]/40 pt-4">
                <h4 className="text-lg font-medium text-vintage-red mb-3 font-typewriter">SEARCH PREVIEW</h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {searchResults.slice(0, 3).map((item) => (
                    <Card 
                      key={item.id} 
                      className="bg-catalog-cream hover:bg-vintage-tan cursor-pointer border border-catalog-softBrown/40 transition-colors duration-150"
                      onClick={() => handleCardClick(item)}
                    >
                      <CardContent className="p-3">
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
        </div>
      )}
    </>
  );
};

export default CatalogSearch;

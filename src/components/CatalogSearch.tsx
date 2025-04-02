
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
  Clock
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
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Search function that can be executed on button click
  const executeSearch = () => {
    let filteredItems = [...items];

    // Apply search filter if searchTerm exists
    if (searchTerm) {
      filteredItems = filteredItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (type === 'food' && (item as FoodCard).cuisine?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (type === 'entertainment' && (item as EntertainmentCard).genre?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter if a specific status is selected
    if (selectedStatus !== "all") {
      filteredItems = filteredItems.filter(item => {
        if (type === 'food') {
          // Match on the simplified status (first word before colon)
          const itemStatus = (item as FoodCard).status;
          return itemStatus.startsWith(selectedStatus);
        } else {
          return (item as EntertainmentCard).status === selectedStatus;
        }
      });
    }

    // Apply tab filters
    if (activeFilter === "favorites") {
      filteredItems = filteredItems.filter(item => item.isFavorite);
    } else if (activeFilter === "topRated") {
      filteredItems = filteredItems.filter(item => item.rating >= 4);
    }

    // Apply sorting
    filteredItems.sort((a, b) => {
      return sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating;
    });

    // Set internal search results
    setSearchResults(filteredItems);
    
    // Update parent component with filtered items
    onFilteredItemsChange(filteredItems);
    
    if (filteredItems.length === 0) {
      toast({
        title: "No results found",
        description: "Try different search terms or filters",
        variant: "destructive"
      });
    } else if (filteredItems.length === 1) {
      // If exactly one result, navigate directly to that card
      setIsSearchOpen(false);
      const path = type === 'food' ? '/bites' : '/blockbusters';
      // Scroll to the specific card (we'll need to implement this on the receiving page)
      navigate(`${path}?highlight=${filteredItems[0].id}`);
      toast({
        title: "Found a match!",
        description: `Navigating to ${filteredItems[0].title}`,
      });
    } else {
      // If multiple results, close dialog and show results
      setIsSearchOpen(false);
      toast({
        title: `Found ${filteredItems.length} results`,
        description: "Showing matching items",
      });
    }
  };

  // Monitor changes and update search results
  useEffect(() => {
    let filteredItems = [...items];

    // Apply search filter if searchTerm exists
    if (searchTerm) {
      filteredItems = filteredItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (type === 'food' && (item as FoodCard).cuisine?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (type === 'entertainment' && (item as EntertainmentCard).genre?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter if a specific status is selected
    if (selectedStatus !== "all") {
      filteredItems = filteredItems.filter(item => {
        if (type === 'food') {
          // Match on the simplified status (first word before colon)
          const itemStatus = (item as FoodCard).status;
          return itemStatus.startsWith(selectedStatus);
        } else {
          return (item as EntertainmentCard).status === selectedStatus;
        }
      });
    }

    // Apply tab filters
    if (activeFilter === "favorites") {
      filteredItems = filteredItems.filter(item => item.isFavorite);
    } else if (activeFilter === "topRated") {
      filteredItems = filteredItems.filter(item => item.rating >= 4);
    }

    // Apply sorting
    filteredItems.sort((a, b) => {
      return sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating;
    });

    // Set internal search results
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

  // Handle keyboard events for search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  // Prevent body scrolling when dialog is open
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
    <div className="mb-6 relative">
      <div className="flex justify-end mb-2">
        <Button 
          variant="outline" 
          onClick={() => setIsSearchOpen(true)}
          className="text-catalog-teal border-catalog-softBrown"
        >
          <Search size={18} className="mr-2" />
          Search
        </Button>
      </div>

      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <DialogContent className="fixed z-50 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-11/12 md:w-4/5 lg:w-3/5 max-w-5xl p-0 border border-[#D3E4FD] bg-white shadow-lg rounded-md">
            <DialogTitle className="sr-only">Search Options</DialogTitle>
            <DialogDescription className="sr-only">
              Search for items in your catalog
            </DialogDescription>
            
            <div className="bg-[#F1F1F1] p-3 flex justify-between items-center border-b border-[#D3E4FD]">
              <h3 className="text-catalog-teal font-medium">Search Options</h3>
              <DialogClose className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <X size={18} />
              </DialogClose>
            </div>
            
            <div className="p-5">
              <div className="mb-4">
                <label htmlFor="search-input" className="block text-sm font-medium text-catalog-softBrown mb-1">Search Terms</label>
                <div className="relative">
                  <Input
                    id="search-input"
                    type="text"
                    placeholder="Search by title, creator, description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full border-catalog-softBrown pl-10"
                    autoFocus
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-catalog-softBrown" size={16} />
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

              {/* Tab filters in the dialog overlay */}
              <div className="mb-4 mt-6 border-t border-[#D3E4FD] pt-4">
                <h4 className="text-sm font-medium text-catalog-softBrown mb-3">Quick Filters</h4>
                <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
                  <TabsList className={`${isMobile ? 'grid grid-cols-4 gap-1' : 'grid grid-cols-8'} w-full`}>
                    <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
                    <TabsTrigger value="favorites" className="flex items-center gap-1 text-sm">
                      <Heart size={14} /> {!isMobile && "Favorites"}
                    </TabsTrigger>
                    <TabsTrigger value="topRated" className="flex items-center gap-1 text-sm">
                      <Star size={14} /> {!isMobile && "Top Rated"}
                    </TabsTrigger>
                    <TabsTrigger value="location" className="flex items-center gap-1 text-sm">
                      <MapPin size={14} /> {!isMobile && "Location"}
                    </TabsTrigger>
                    <TabsTrigger value="byStatus" className="flex items-center gap-1 text-sm">
                      <Clock size={14} /> {!isMobile && "By Status"}
                    </TabsTrigger>
                    <TabsTrigger value="keywords" className="text-sm flex items-center gap-1">
                      <Search size={14} /> {!isMobile && "Keywords"}
                    </TabsTrigger>
                    <TabsTrigger value="topReferrals" className="flex items-center gap-1 text-sm">
                      <TrendingUp size={14} /> {!isMobile && "Most Referred"}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex items-center text-sm text-catalog-softBrown border-t border-[#D3E4FD] pt-3 mt-3">
                <span>
                  {searchTerm && `Searching for "${searchTerm}"`}
                  {selectedStatus !== "all" && (searchTerm ? " with " : "") + `status "${selectedStatus}"`}
                  {activeFilter !== "all" && (searchTerm || selectedStatus !== "all" ? " and " : "") + `filter: ${activeFilter}`}
                  {!searchTerm && selectedStatus === "all" && activeFilter === "all" && "No filters applied"}
                </span>
              </div>

              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={executeSearch}
                  className="bg-catalog-teal hover:bg-catalog-darkTeal px-8"
                >
                  Search Catalog
                </Button>
              </div>

              {searchResults.length > 0 && searchTerm && (
                <div className="mt-6 border-t border-[#D3E4FD] pt-4">
                  <h4 className="text-sm font-medium text-catalog-softBrown mb-3">Search Preview (top 3 results)</h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {searchResults.slice(0, 3).map((item) => (
                      <Card key={item.id} className="bg-gray-50 hover:bg-gray-100 cursor-pointer">
                        <CardContent className="p-3" onClick={() => {
                          setIsSearchOpen(false);
                          const path = type === 'food' ? '/bites' : '/blockbusters';
                          navigate(`${path}?highlight=${item.id}`);
                        }}>
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <h5 className="font-medium">{item.title}</h5>
                              <p className="text-xs text-gray-600">{item.creator}</p>
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
    </div>
  );
};

export default CatalogSearch;

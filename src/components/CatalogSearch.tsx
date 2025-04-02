
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter,
  ArrowUp,
  ArrowDown,
  X
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
} from "@/components/ui/dialog";
import { FoodCard, EntertainmentCard, CatalogCard } from "@/lib/types";

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

    // Apply sorting
    filteredItems.sort((a, b) => {
      return sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating;
    });

    onFilteredItemsChange(filteredItems);
  }, [searchTerm, selectedStatus, sortOrder, items, type, onFilteredItemsChange]);

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
            <div className="bg-[#F1F1F1] p-3 flex justify-between items-center border-b border-[#D3E4FD]">
              <h3 className="text-catalog-teal font-medium">Search Options</h3>
              <DialogClose className="text-gray-500 hover:text-gray-700">
                <X size={18} />
              </DialogClose>
            </div>
            
            <div className="p-5">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <label htmlFor="search-input" className="block text-sm font-medium text-catalog-softBrown mb-1">Search Terms</label>
                  <div className="relative">
                    <Input
                      id="search-input"
                      type="text"
                      placeholder="Search by title, creator, description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full border-catalog-softBrown pl-10"
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

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-catalog-softBrown">Filters</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={toggleSortOrder}
                      className="border-catalog-softBrown flex items-center"
                      title={sortOrder === "desc" ? "Highest to Lowest Rating" : "Lowest to Highest Rating"}
                    >
                      Rating {sortOrder === "desc" ? <ArrowDown size={18} className="ml-1" /> : <ArrowUp size={18} className="ml-1" />}
                    </Button>

                    <div>
                      <Select
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                      >
                        <SelectTrigger className="w-[180px] border-catalog-softBrown">
                          <SelectValue placeholder="Filter by status" />
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
                  </div>
                </div>
              </div>

              <div className="flex items-center text-sm text-catalog-softBrown border-t border-[#D3E4FD] pt-3 mt-3">
                <Filter size={14} className="mr-1" />
                <span>
                  {searchTerm && `Searching for "${searchTerm}"`}
                  {selectedStatus !== "all" && (searchTerm ? " with " : "") + `status "${selectedStatus}"`}
                  {!searchTerm && selectedStatus === "all" && "No filters applied"}
                </span>
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
};

export default CatalogSearch;

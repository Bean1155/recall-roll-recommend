
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearchVisibility = () => {
    setIsSearchVisible(!isSearchVisible);
  };

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
          return (item as FoodCard).status === selectedStatus;
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
    const statusSet = new Set<string>();
    
    items.forEach(item => {
      if (type === 'food') {
        statusSet.add((item as FoodCard).status);
      } else if (type === 'entertainment') {
        statusSet.add((item as EntertainmentCard).status);
      }
    });
    
    return Array.from(statusSet);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-end mb-2">
        <Button 
          variant="outline" 
          onClick={toggleSearchVisibility}
          className="text-catalog-teal border-catalog-softBrown"
        >
          <Search size={18} className="mr-2" />
          {isSearchVisible ? 'Hide Search' : 'Search'}
        </Button>
      </div>

      {isSearchVisible && (
        <div className="bg-white border border-catalog-softBrown rounded-md p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search by title, creator, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-catalog-softBrown"
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
                type="button"
                variant="outline"
                onClick={toggleSortOrder}
                className="border-catalog-softBrown"
                title={sortOrder === "desc" ? "Highest to Lowest Rating" : "Lowest to Highest Rating"}
              >
                Rating {sortOrder === "desc" ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
              </Button>

              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger className="w-[200px] border-catalog-softBrown">
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

          <div className="flex items-center text-sm text-catalog-softBrown">
            <Filter size={14} className="mr-1" />
            <span>
              {searchTerm && `Searching for "${searchTerm}"`}
              {selectedStatus !== "all" && (searchTerm ? " with " : "") + `status "${selectedStatus}"`}
              {!searchTerm && selectedStatus === "all" && "No filters applied"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogSearch;

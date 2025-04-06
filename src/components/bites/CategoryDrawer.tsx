
import { CatalogCollapsible } from "@/components/ui/collapsible";
import { FoodCard, FoodCategory } from "@/lib/types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface CategoryDrawerProps {
  category?: FoodCategory;
  cards?: FoodCard[];
  backgroundColor?: string;
  textColor?: string;
  categoryDisplayName?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onApplyFilters?: (filterConfig: {
    status: string[];
    rating: number[];
    tags: string[];
  }) => void;
  currentFilters?: {
    status: string[];
    rating: number[];
    tags: string[];
  };
}

const CategoryDrawer = ({
  category,
  cards = [],
  backgroundColor,
  textColor,
  categoryDisplayName,
  isOpen,
  onOpenChange,
  onApplyFilters,
  currentFilters,
}: CategoryDrawerProps) => {
  const [localFilters, setLocalFilters] = useState({
    status: [] as string[],
    rating: [] as number[],
    tags: [] as string[]
  });
  
  // Set local filters from props when drawer opens
  useEffect(() => {
    if (isOpen && currentFilters) {
      setLocalFilters({
        status: [...currentFilters.status],
        rating: [...currentFilters.rating],
        tags: [...currentFilters.tags]
      });
    }
  }, [isOpen, currentFilters]);
  
  // Extract all available options from cards
  const statusOptions = [...new Set(cards.map(card => card.status))].filter(Boolean);
  const ratingOptions = [...new Set(cards.map(card => card.rating))].filter(Boolean);
  
  // Get all unique tags from all cards
  const allTags = cards.reduce((acc, card) => {
    if (card.tags && card.tags.length) {
      card.tags.forEach(tag => {
        if (!acc.includes(tag)) {
          acc.push(tag);
        }
      });
    }
    return acc;
  }, [] as string[]);
  
  // Toggle a filter value
  const toggleFilter = (filterType: string, value: any) => {
    setLocalFilters(prev => {
      const current = [...prev[filterType as keyof typeof prev]] as any[];
      
      if (current.includes(value)) {
        return {
          ...prev,
          [filterType]: current.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [filterType]: [...current, value]
        };
      }
    });
  };
  
  // Apply filters and close drawer
  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters(localFilters);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setLocalFilters({
      status: [],
      rating: [],
      tags: []
    });
  };

  return (
    <div className="w-full">
      <CatalogCollapsible
        label={categoryDisplayName || "Filters"}
        backgroundColor={backgroundColor || "#f5f5f5"}
        textColor={textColor || "#333"}
        open={isOpen}
        onOpenChange={onOpenChange}
      >
        <div className="p-4 space-y-6">
          {/* Status Filters */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Status</h3>
            <div className="space-y-1">
              {statusOptions.map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`status-${status}`}
                    checked={localFilters.status.includes(status)}
                    onCheckedChange={() => toggleFilter('status', status)}
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm">{status}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Rating Filters */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Rating</h3>
            <div className="space-y-1">
              {ratingOptions.sort().map(rating => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`rating-${rating}`}
                    checked={localFilters.rating.includes(rating)}
                    onCheckedChange={() => toggleFilter('rating', rating)}
                  />
                  <Label htmlFor={`rating-${rating}`} className="text-sm">
                    {"★".repeat(rating)}{"☆".repeat(5 - rating)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Tags Filters */}
          {allTags.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Tags</h3>
              <div className="space-y-1">
                {allTags.map(tag => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`tag-${tag}`}
                      checked={localFilters.tags.includes(tag)}
                      onCheckedChange={() => toggleFilter('tags', tag)}
                    />
                    <Label htmlFor={`tag-${tag}`} className="text-sm">{tag}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Filter Actions */}
          <div className="flex space-x-2 pt-4">
            <Button 
              onClick={handleApplyFilters} 
              className="flex-1"
              variant="default"
            >
              <Check size={16} className="mr-1" />
              Apply Filters
            </Button>
            <Button 
              onClick={clearFilters} 
              variant="outline" 
              className="flex-1"
            >
              <X size={16} className="mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </CatalogCollapsible>
    </div>
  );
};

export default CategoryDrawer;

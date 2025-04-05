
import React from "react";
import { UtensilsCrossed, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BitesFilter from "./BitesFilter";

interface BitesHeaderProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onOpenFilters: () => void;
}

const BitesHeader = ({ hasActiveFilters, onClearFilters, onOpenFilters }: BitesHeaderProps) => {
  const navigate = useNavigate();
  
  return {
    title: "Bites",
    icon: <UtensilsCrossed className="h-5 w-5" />,
    headerContent: (
      <div className="flex space-x-2">
        <BitesFilter 
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
          onOpenFilters={onOpenFilters}
        />
        <Button 
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => navigate('/search?type=food')}
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </Button>
        <Button 
          size="sm"
          variant="default"
          className="flex items-center gap-1"
          onClick={() => navigate('/create/food')}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Bite</span>
        </Button>
      </div>
    )
  };
};

export default BitesHeader;

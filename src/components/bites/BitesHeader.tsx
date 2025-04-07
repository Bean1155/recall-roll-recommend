
import React from "react";
import { Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface BitesHeaderProps {
  onClearFilters: () => void;
  hasActiveFilters?: boolean;
}

const BitesHeader = ({
  onClearFilters,
  hasActiveFilters = false
}: BitesHeaderProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleBrowseClick = () => {
    navigate('/browse?type=food');
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleBrowseClick} 
        className={`flex items-center gap-1 ${isMobile ? 'flex-1 justify-center' : ''}`}
      >
        <Search className="h-4 w-4" />
        <span className={isMobile ? 'inline' : 'hidden sm:inline'}>
          {isMobile ? 'Browse & Filter' : 'Browse'}
        </span>
      </Button>
      
      {hasActiveFilters && (
        <Button 
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={onClearFilters}
        >
          <span className="hidden sm:inline">Clear Filters</span>
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        className={`flex items-center gap-1 bg-teal-700 text-white hover:bg-teal-800 ${isMobile ? 'flex-1 justify-center' : ''}`}
        asChild
      >
        <Link to="/create/food">
          <PlusCircle className="h-4 w-4" />
          <span className={isMobile ? 'inline' : 'hidden sm:inline'}>Add</span>
        </Link>
      </Button>
    </div>
  );
};

export default BitesHeader;

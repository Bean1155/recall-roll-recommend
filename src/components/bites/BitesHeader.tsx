
import React from "react";
import { Search, PlusCircle, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface BitesHeaderProps {
  onClearFilters: () => void;
  hasActiveFilters?: boolean;
  type?: 'food' | 'entertainment';
}

const BitesHeader = ({
  onClearFilters,
  hasActiveFilters = false,
  type = 'food'
}: BitesHeaderProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine if we're on the blockbusters page
  const isBlockbustersPage = location.pathname.includes('blockbusters');
  // If type is not explicitly set, infer it from the current page
  const cardType = type || (isBlockbustersPage ? 'entertainment' : 'food');
  
  // Text to display based on card type
  const addButtonText = cardType === 'entertainment' ? 'Add' : 'Add';
  const browseButtonText = 'Browse';

  const handleBrowseClick = () => {
    navigate(`/browse?type=${cardType}`);
  };

  return (
    <div className="flex items-center justify-center gap-2 w-full max-w-md mx-auto">
      {hasActiveFilters && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearFilters}
          className={`flex items-center gap-1 ${isMobile ? 'px-2' : ''}`}
        >
          <FilterX className="h-4 w-4" />
          <span className={isMobile ? 'sr-only' : 'hidden sm:inline'}>Clear Filters</span>
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleBrowseClick} 
        className="flex items-center gap-1 flex-1 justify-center"
      >
        <Search className="h-4 w-4" />
        <span>
          {browseButtonText}
        </span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1 bg-teal-700 text-white hover:bg-teal-800 flex-1 justify-center"
        asChild
      >
        <Link to={`/create/${cardType}`}>
          <PlusCircle className="h-4 w-4" />
          <span>
            {addButtonText}
          </span>
        </Link>
      </Button>
    </div>
  );
};

export default BitesHeader;

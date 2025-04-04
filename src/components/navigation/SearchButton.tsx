
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface SearchButtonProps {
  path: string;
  color: string;
  onClick?: () => void;
}

const SearchButton: React.FC<SearchButtonProps> = ({ path, color, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link 
            to={path}
            className="flex flex-col items-center order-first group"
            onClick={onClick}
          >
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all duration-200 ${
                isActive ? "shadow-md" : ""
              } hover:scale-125 hover:shadow-lg`}
              style={{ backgroundColor: color }}
            >
              <Search 
                size={22} 
                className={`transition-colors ${
                  isActive ? "text-catalog-teal" : "text-catalog-softBrown"
                }`}
              />
            </div>
            <span className={`text-xs font-medium ${
              isActive ? "text-catalog-teal" : "text-catalog-softBrown"
            } transition-all duration-200 group-hover:font-bold`}>
              Search
            </span>
          </Link>
        </TooltipTrigger>
        <TooltipContent className="bg-white text-catalog-softBrown">
          Search across all catalog items
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SearchButton;

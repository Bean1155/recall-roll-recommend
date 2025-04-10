
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TooltipProvider, 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent 
} from "@/components/ui/tooltip";
import { 
  Search, 
  Heart, 
  Star, 
  MapPin, 
  FileText, 
  Clock, 
  Tag, 
  Share2,
  List,
  ShoppingBag,
  Film,
  BookOpen,
  Music,
  Tv,
  Gamepad2
} from "lucide-react";
import { defaultEntertainmentCategories } from "@/utils/categoryUtils";

interface FilterTabsProps {
  activeFilter: string;
  handleTabChange: (value: string) => void;
  filterDescriptions: Record<string, string>;
  type?: 'food' | 'entertainment';
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  activeFilter,
  handleTabChange,
  filterDescriptions,
  type = 'food'
}) => {
  // Get the appropriate icon for entertainment categories
  const getEntertainmentCategoryIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'movies': return <Film size={18} />;
      case 'tv shows': return <Tv size={18} />;
      case 'books': return <BookOpen size={18} />;
      case 'podcasts': return <Music size={18} />;
      case 'games': return <Gamepad2 size={18} />;
      default: return <Film size={18} />;
    }
  };

  // Determine if we should show entertainment categories
  const showEntertainmentCategories = type === 'entertainment' && activeFilter === 'byCategory';

  return (
    <Tabs defaultValue={activeFilter} className="w-full mt-2" onValueChange={handleTabChange}>
      <TabsList className="w-full bg-[#FAEBD7] p-1 rounded-md h-14 border border-[#8B7D6B]/20 relative z-20">
        <div className="grid grid-cols-5 gap-1 w-full">
          <FilterTabItem 
            value="all" 
            icon={<Search size={18} />} 
            description={filterDescriptions.all || "Show all items without filtering"} 
          />
          
          <FilterTabItem 
            value="favorites" 
            icon={<Heart size={18} />} 
            description={filterDescriptions.favorites || "Show only items marked as favorites"} 
          />
          
          <FilterTabItem 
            value="topRated" 
            icon={<Star size={18} />} 
            description={filterDescriptions.topRated || "Show items with 4-5 star ratings"} 
          />
          
          <FilterTabItem 
            value="location" 
            icon={<MapPin size={18} />} 
            description={filterDescriptions.location || "Filter items by their location"} 
          />
          
          <FilterTabItem 
            value="byCategory" 
            icon={<ShoppingBag size={18} />} 
            description={filterDescriptions.byCategory || "Browse by category"} 
          />
          
          <FilterTabItem 
            value="byStatus" 
            icon={<FileText size={18} />} 
            description={filterDescriptions.byStatus || "Filter by status"} 
          />
          
          <FilterTabItem 
            value="newest" 
            icon={<Clock size={18} />} 
            description={filterDescriptions.newest || "Show the most recently added items"} 
          />
          
          <FilterTabItem 
            value="keywords" 
            icon={<Tag size={18} />} 
            description={filterDescriptions.keywords || "Search by specific keywords or tags"} 
          />
          
          <FilterTabItem 
            value="topReferrals" 
            icon={<Share2 size={18} />} 
            description={filterDescriptions.topReferrals || "Show items most recommended by friends"} 
          />
          
          <FilterTabItem 
            value="allItems" 
            icon={<List size={18} />} 
            description={filterDescriptions.allItems || "View all items"} 
          />
        </div>
      </TabsList>
      
      {/* Display entertainment category filters when byCategory is selected */}
      {showEntertainmentCategories && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {defaultEntertainmentCategories.map((category) => (
            <TooltipProvider key={category}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => handleTabChange(`category_${category}`)}
                    className={`p-2 rounded-md flex flex-col items-center text-xs ${
                      activeFilter === `category_${category}` 
                        ? 'bg-white shadow-md text-[#1A7D76]' 
                        : 'bg-[#FAEBD7]/50 text-gray-700'
                    }`}
                  >
                    {getEntertainmentCategoryIcon(category)}
                    <span className="mt-1 truncate w-full text-center">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-white text-catalog-softBrown">
                  Browse {category}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      )}
    </Tabs>
  );
};

interface FilterTabItemProps {
  value: string;
  icon: React.ReactNode;
  description: string;
}

const FilterTabItem: React.FC<FilterTabItemProps> = ({ value, icon, description }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <TabsTrigger 
            value={value} 
            className="text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-[#1A7D76] data-[state=active]:shadow-sm"
          >
            {icon}
            <span className="sr-only">{value}</span>
          </TabsTrigger>
        </TooltipTrigger>
        <TooltipContent className="bg-white text-catalog-softBrown">
          {description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FilterTabs;

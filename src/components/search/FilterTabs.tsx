
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
  Share2 
} from "lucide-react";

interface FilterTabsProps {
  activeFilter: string;
  handleTabChange: (value: string) => void;
  filterDescriptions: Record<string, string>;
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  activeFilter,
  handleTabChange,
  filterDescriptions
}) => {
  return (
    <Tabs defaultValue={activeFilter} className="w-full mt-2" onValueChange={handleTabChange}>
      <TabsList className="w-full bg-[#FAEBD7] p-1 rounded-md h-14 border border-[#8B7D6B]/20 relative z-20">
        <div className="grid grid-cols-4 gap-1 w-full">
          <FilterTabItem 
            value="all" 
            icon={<Search size={18} />} 
            description={filterDescriptions.all} 
          />
          
          <FilterTabItem 
            value="favorites" 
            icon={<Heart size={18} />} 
            description={filterDescriptions.favorites} 
          />
          
          <FilterTabItem 
            value="topRated" 
            icon={<Star size={18} />} 
            description={filterDescriptions.topRated} 
          />
          
          <FilterTabItem 
            value="location" 
            icon={<MapPin size={18} />} 
            description={filterDescriptions.location} 
          />
          
          <FilterTabItem 
            value="byStatus" 
            icon={<FileText size={18} />} 
            description={filterDescriptions.byStatus} 
          />
          
          <FilterTabItem 
            value="newest" 
            icon={<Clock size={18} />} 
            description={filterDescriptions.newest} 
          />
          
          <FilterTabItem 
            value="keywords" 
            icon={<Tag size={18} />} 
            description={filterDescriptions.keywords} 
          />
          
          <FilterTabItem 
            value="topReferrals" 
            icon={<Share2 size={18} />} 
            description={filterDescriptions.topReferrals} 
          />
        </div>
      </TabsList>
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


import React from "react";
import { MapPin } from "lucide-react";
import { 
  DropdownMenuLabel, 
  DropdownMenuSub,
  DropdownMenuSubTrigger, 
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface LocationFiltersProps {
  activeLocations: string[];
  uniqueLocations: string[];
  onSelect: (filterType: string, value: string) => void;
}

const LocationFilters = ({ activeLocations, uniqueLocations, onSelect }: LocationFiltersProps) => {
  return (
    <>
      <DropdownMenuLabel className="text-xs text-gray-500">Location</DropdownMenuLabel>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          <span>By Location</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent 
            className="w-56 max-h-80 overflow-y-auto" 
            sideOffset={2} 
            alignOffset={-5}
            style={{ backgroundColor: "white", zIndex: 50 }}
          >
            {uniqueLocations.length > 0 ? (
              uniqueLocations.map((location) => (
                <DropdownMenuCheckboxItem
                  key={location}
                  checked={activeLocations.includes(location)}
                  onSelect={() => onSelect("location", location)}
                >
                  {location}
                </DropdownMenuCheckboxItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No locations available</DropdownMenuItem>
            )}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
    </>
  );
};

export default LocationFilters;

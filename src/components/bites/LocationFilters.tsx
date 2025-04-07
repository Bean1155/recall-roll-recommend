
import React, { useState } from "react";
import { MapPin, Target } from "lucide-react";
import { 
  DropdownMenuLabel, 
  DropdownMenuSub,
  DropdownMenuSubTrigger, 
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MapVisualization from "@/components/map/MapVisualization";

interface LocationFiltersProps {
  activeLocations: string[];
  uniqueLocations: string[];
  onSelect: (filterType: string, value: string) => void;
  onProximitySearch?: (options: { location: string; distance: number }) => void;
}

const LocationFilters = ({ 
  activeLocations, 
  uniqueLocations, 
  onSelect,
  onProximitySearch
}: LocationFiltersProps) => {
  const [showProximitySearch, setShowProximitySearch] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDistance, setSearchDistance] = useState(5);
  const [customLocation, setCustomLocation] = useState("");
  const [showMap, setShowMap] = useState(false);

  const handleProximitySearch = () => {
    if (onProximitySearch) {
      const location = searchLocation === "custom" ? customLocation : searchLocation;
      onProximitySearch({ location, distance: searchDistance });
    }
  };

  const handleLocationSelect = (location: string) => {
    setSearchLocation(location);
    setShowMap(true);
  };

  // Determine which location to use for the map
  const mapLocation = searchLocation === "custom" ? 
    (customLocation || "United States") : 
    (searchLocation || "United States");

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

      <DropdownMenuItem onSelect={() => setShowProximitySearch(!showProximitySearch)}>
        <Target className="h-4 w-4 mr-2" />
        <span>Proximity Search</span>
      </DropdownMenuItem>

      {showProximitySearch && (
        <DropdownMenuGroup className="px-2 py-1.5">
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Search near:</Label>
              <Select 
                value={searchLocation} 
                onValueChange={(value) => {
                  setSearchLocation(value);
                  // Show map when a location is selected
                  setShowMap(!!value);
                }}
              >
                <SelectTrigger className="w-full h-8 text-sm">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueLocations.length > 0 ? (
                    uniqueLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))
                  ) : null}
                  <SelectItem value="custom">Custom location</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {searchLocation === "custom" && (
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Enter location:</Label>
                <Input 
                  value={customLocation}
                  onChange={(e) => {
                    setCustomLocation(e.target.value);
                    if (e.target.value) {
                      setShowMap(true);
                    }
                  }}
                  className="h-8 text-sm"
                  placeholder="Enter city, address, etc."
                />
              </div>
            )}
            
            <div>
              <div className="flex justify-between mb-1">
                <Label className="text-xs text-gray-500">Distance (miles):</Label>
                <span className="text-xs font-medium">{searchDistance} mi</span>
              </div>
              <Slider
                value={[searchDistance]}
                onValueChange={(val) => setSearchDistance(val[0])}
                min={1}
                max={50}
                step={1}
                className="my-2"
              />
            </div>

            {/* Map visualization */}
            {showMap && (searchLocation || (searchLocation === "custom" && customLocation)) && (
              <div className="mt-2 mb-3">
                <MapVisualization 
                  location={mapLocation}
                  distance={searchDistance}
                  uniqueLocations={uniqueLocations}
                  onLocationSelect={handleLocationSelect}
                />
              </div>
            )}
            
            <Button 
              onClick={handleProximitySearch}
              className="w-full h-8 mt-2 text-sm bg-[#1A7D76] hover:bg-[#166661] text-white"
            >
              Search Nearby
            </Button>
          </div>
        </DropdownMenuGroup>
      )}

      <DropdownMenuSeparator />
    </>
  );
};

export default LocationFilters;

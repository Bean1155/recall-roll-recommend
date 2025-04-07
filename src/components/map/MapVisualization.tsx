
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Loader2 } from "lucide-react";

// Use a temporary token - in production, this should be environment variable
// You should replace this with your own Mapbox token
const MAPBOX_TOKEN = "pk.eyJ1IjoiZGVtby1hY2NvdW50IiwiYSI6ImNrZHp0bHN4bTB6eHgycXA4Y3lzNWptYjkifQ.MNwUWiQcKvftXQQhPfpgEQ";
mapboxgl.accessToken = MAPBOX_TOKEN;

interface MapVisualizationProps {
  location: string;
  distance: number;
  uniqueLocations?: string[];
  onLocationSelect?: (location: string) => void;
}

const MapVisualization: React.FC<MapVisualizationProps> = ({
  location,
  distance,
  uniqueLocations = [],
  onLocationSelect
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const circleRef = useRef<mapboxgl.GeoJSONSource | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const getGeocodedLocation = async (locationName: string): Promise<[number, number] | null> => {
    try {
      // In a real app, this would call a geocoding service like Mapbox Geocoding API
      // For demo purposes, we'll fake it with some hardcoded coordinates for common locations
      const mockLocations: Record<string, [number, number]> = {
        "New York": [-73.9857, 40.7484],
        "Los Angeles": [-118.2437, 34.0522],
        "Chicago": [-87.6298, 41.8781],
        "San Francisco": [-122.4194, 37.7749],
        "Miami": [-80.1918, 25.7617],
        "Seattle": [-122.3321, 47.6062],
        "Boston": [-71.0589, 42.3601],
        "Austin": [-97.7431, 30.2672],
        "Portland": [-122.6784, 45.5152],
        "Philadelphia": [-75.1652, 39.9526],
        "Savannah": [-81.0998, 32.0809],
        "Denver": [-104.9903, 39.7392],
        "Nashville": [-86.7844, 36.1627],
        "New Orleans": [-90.0715, 29.9511],
      };
      
      // Check if the location matches any of our mock locations
      const exactMatch = mockLocations[locationName];
      if (exactMatch) return exactMatch;
      
      // If no exact match, check for partial matches
      const locationLower = locationName.toLowerCase();
      for (const [key, coords] of Object.entries(mockLocations)) {
        if (key.toLowerCase().includes(locationLower) || locationLower.includes(key.toLowerCase())) {
          return coords;
        }
      }
      
      // If no match found, return default coordinates (center of USA)
      console.log(`No coordinates found for ${locationName}, using default`);
      return [-98.5795, 39.8283];
    } catch (error) {
      console.error("Error geocoding location:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!mapContainer.current) return;
    
    const initializeMap = async () => {
      setLoading(true);
      
      try {
        // Get coordinates for the selected location
        const coordinates = await getGeocodedLocation(location);
        if (!coordinates) {
          setMapError("Could not find coordinates for the selected location");
          setLoading(false);
          return;
        }
        
        // Initialize map if it doesn't exist yet
        if (!map.current) {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: coordinates,
            zoom: 10
          });
          
          // Add navigation controls
          map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
          
          // Add event listener for when the map has loaded
          map.current.on("load", () => {
            // Add circle source and layer
            map.current?.addSource("radius-circle", {
              type: "geojson",
              data: {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: coordinates
                },
                properties: {}
              }
            });
            
            map.current?.addLayer({
              id: "radius-circle-fill",
              type: "circle",
              source: "radius-circle",
              paint: {
                "circle-radius": {
                  stops: [
                    [0, 0],
                    [20, 1000 * distance]
                  ],
                  base: 2
                },
                "circle-color": "#1A7D76",
                "circle-opacity": 0.2
              }
            });
            
            map.current?.addLayer({
              id: "radius-circle-outline",
              type: "circle",
              source: "radius-circle",
              paint: {
                "circle-radius": {
                  stops: [
                    [0, 0],
                    [20, 1000 * distance]
                  ],
                  base: 2
                },
                "circle-color": "#1A7D76",
                "circle-opacity": 0,
                "circle-stroke-width": 2,
                "circle-stroke-color": "#1A7D76"
              }
            });
            
            // Save reference to the circle source
            circleRef.current = map.current?.getSource("radius-circle") as mapboxgl.GeoJSONSource;
            
            // Add markers for unique locations
            addLocationMarkers();
            
            setLoading(false);
          });
        } else {
          // Map already exists, update center and circle
          map.current.flyTo({
            center: coordinates,
            zoom: Math.max(9 - Math.log2(distance / 5), 6) // Adjust zoom based on distance
          });
          
          // Update circle radius if source exists
          if (circleRef.current) {
            circleRef.current.setData({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: coordinates
              },
              properties: {}
            });
            
            // Update circle radius layers
            map.current.setPaintProperty("radius-circle-fill", "circle-radius", {
              stops: [
                [0, 0],
                [20, 1000 * distance]
              ],
              base: 2
            });
            
            map.current.setPaintProperty("radius-circle-outline", "circle-radius", {
              stops: [
                [0, 0],
                [20, 1000 * distance]
              ],
              base: 2
            });
          }
          
          // Update markers
          clearMarkers();
          addLocationMarkers();
          
          setLoading(false);
        }
      } catch (err) {
        console.error("Error initializing map:", err);
        setMapError(`Error initializing map: ${err instanceof Error ? err.message : "Unknown error"}`);
        setLoading(false);
      }
    };
    
    initializeMap();
    
    return () => {
      // Clean up markers on unmount
      clearMarkers();
    };
  }, [location, distance]);

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  };

  const addLocationMarkers = async () => {
    if (!map.current) return;
    
    for (const loc of uniqueLocations) {
      try {
        const coordinates = await getGeocodedLocation(loc);
        if (coordinates) {
          // Create a custom marker element
          const el = document.createElement("div");
          el.className = "location-marker";
          el.innerHTML = `
            <div class="w-6 h-6 rounded-full bg-white border-2 border-[#1A7D76] flex items-center justify-center shadow-md cursor-pointer"
                 style="transform: translate(-50%, -50%)">
              <div class="w-3 h-3 rounded-full bg-[#1A7D76]"></div>
            </div>
          `;
          
          // Add a tooltip with the location name
          const tooltip = document.createElement("div");
          tooltip.className = "location-tooltip";
          tooltip.textContent = loc;
          tooltip.style.cssText = `
            position: absolute; 
            background: white; 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 12px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            pointer-events: none;
            transform: translate(-50%, -100%);
            margin-top: -8px;
            opacity: 0;
            transition: opacity 0.2s;
            z-index: 10;
          `;
          el.appendChild(tooltip);
          
          // Show tooltip on hover
          el.addEventListener("mouseenter", () => {
            tooltip.style.opacity = "1";
          });
          
          el.addEventListener("mouseleave", () => {
            tooltip.style.opacity = "0";
          });
          
          // Handle click event to select location
          el.addEventListener("click", () => {
            if (onLocationSelect) {
              onLocationSelect(loc);
            }
          });
          
          const marker = new mapboxgl.Marker({
            element: el,
            anchor: "center",
          })
            .setLngLat(coordinates)
            .addTo(map.current);
          
          markersRef.current.push(marker);
        }
      } catch (error) {
        console.error(`Error adding marker for ${loc}:`, error);
      }
    }
  };
  
  if (mapError) {
    return (
      <div className="rounded-md p-4 bg-red-50 border border-red-200 text-sm text-red-600">
        {mapError}
      </div>
    );
  }

  return (
    <div className="relative h-48 w-full rounded-md overflow-hidden border border-gray-200">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
          <Loader2 className="h-6 w-6 text-[#1A7D76] animate-spin" />
        </div>
      )}
      <div ref={mapContainer} className="h-full w-full" />
      <div className="absolute bottom-2 right-2 text-xs bg-white px-2 py-1 rounded-sm shadow-sm">
        {distance} mile{distance !== 1 ? 's' : ''} radius
      </div>
    </div>
  );
};

export default MapVisualization;

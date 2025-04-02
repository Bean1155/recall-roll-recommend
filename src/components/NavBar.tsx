import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Folder, Sparkles, PlusCircle, Menu, Home, Search, Settings } from "lucide-react";
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "@/components/ui/hover-card";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const NavBar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  // Reordering navigation items
  const navItems = [
    {
      name: "Home",
      icon: Home,
      path: "/",
      color: "#FFECB3" // Soft Yellow/Gold
    },
    {
      name: "Collections",
      icon: Folder,
      path: "/collections",
      color: "#D3E4FD" // Soft Blue
    },
    {
      name: "Add",
      icon: PlusCircle,
      path: "/create/food",
      color: "#E5DEFF" // Soft Purple
    },
    {
      name: "Recommend",
      icon: Sparkles,
      path: "/recommend",
      color: "#FEF7CD" // Soft Yellow
    }
  ];

  // Special handling for search to add hover card
  const searchItem = {
    name: "Search",
    icon: Search,
    path: "/search",
    color: "#E1F5FE" // Soft Light Blue
  };

  // Profile with settings popover - updated with darker vintage color
  const profileItem = {
    name: "Profile",
    icon: User,
    path: "/profile",
    color: "#D2B48C" // Darker vintage color (soft brown)
  };

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm border-t border-catalog-softBrown">
      <div className="container mx-auto max-w-md">
        {isExpanded ? (
          <div className="flex justify-around items-center py-2 animate-fade-in">
            {/* Regular navigation items with hover effect */}
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const isMiddle = index === Math.floor(navItems.length / 2);
              
              return (
                <Link 
                  key={item.name} 
                  to={item.path}
                  className={`flex flex-col items-center ${isMiddle ? 'order-0' : ''}`}
                  onClick={() => setIsExpanded(false)}
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all ${
                      isActive ? "shadow-md" : ""
                    } hover:scale-110 hover:shadow-md`}
                    style={{ backgroundColor: item.color }}
                  >
                    <item.icon 
                      size={22} 
                      className={`transition-colors ${
                        isActive ? "text-catalog-teal" : "text-catalog-softBrown"
                      }`}
                    />
                  </div>
                  <span className={`text-xs font-medium ${
                    isActive ? "text-catalog-teal" : "text-catalog-softBrown"
                  }`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}

            {/* Search with tooltip and hover effect */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to={searchItem.path}
                    className="flex flex-col items-center order-first"
                    onClick={() => setIsExpanded(false)}
                  >
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all ${
                        location.pathname === searchItem.path ? "shadow-md" : ""
                      } hover:scale-110 hover:shadow-md`}
                      style={{ backgroundColor: searchItem.color }}
                    >
                      <searchItem.icon 
                        size={22} 
                        className={`transition-colors ${
                          location.pathname === searchItem.path ? "text-catalog-teal" : "text-catalog-softBrown"
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      location.pathname === searchItem.path ? "text-catalog-teal" : "text-catalog-softBrown"
                    }`}>
                      {searchItem.name}
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="bg-white text-catalog-softBrown">
                  Quick search your catalog items
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Profile with settings popover and hover effect */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex flex-col items-center order-last cursor-pointer">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all ${
                      location.pathname === profileItem.path ? "shadow-md" : ""
                    } hover:scale-110 hover:shadow-md`}
                    style={{ backgroundColor: profileItem.color }}
                  >
                    <profileItem.icon 
                      size={22} 
                      className={`transition-colors ${
                        location.pathname === profileItem.path ? "text-catalog-teal" : "text-white"
                      }`}
                    />
                  </div>
                  <span className={`text-xs font-medium ${
                    location.pathname === profileItem.path ? "text-catalog-teal" : "text-catalog-softBrown"
                  }`}>
                    {profileItem.name}
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0 bg-white shadow-lg rounded-lg border border-catalog-softBrown/20">
                <div className="flex flex-col">
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 p-3 hover:bg-gray-50"
                    onClick={() => setIsExpanded(false)}
                  >
                    <User size={18} className="text-catalog-softBrown" />
                    <span className="text-sm">Profile</span>
                  </Link>
                  <Link 
                    to="/settings" 
                    className="flex items-center gap-2 p-3 hover:bg-gray-50 border-t border-catalog-softBrown/10"
                    onClick={() => setIsExpanded(false)}
                  >
                    <Settings size={18} className="text-catalog-softBrown" />
                    <span className="text-sm">Settings</span>
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <button
              onClick={toggleNavbar}
              className="w-12 h-12 rounded-full bg-catalog-teal flex items-center justify-center shadow-md text-white hover:bg-catalog-darkTeal transition-colors duration-200"
            >
              <Menu size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;

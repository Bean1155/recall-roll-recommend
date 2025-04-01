
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Folder, Sparkles, PlusCircle, Menu } from "lucide-react";

const NavBar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    {
      name: "Profile",
      icon: User,
      path: "/profile",
      color: "#FDE1D3" // Soft Peach
    },
    {
      name: "Collections",
      icon: Folder,
      path: "/collections",
      color: "#D3E4FD" // Soft Blue
    },
    {
      name: "Recommend",
      icon: Sparkles,
      path: "/recommend",
      color: "#FEF7CD" // Soft Yellow
    },
    {
      name: "Add",
      icon: PlusCircle,
      path: "/create/food",
      color: "#E5DEFF" // Soft Purple
    }
  ];

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm border-t border-catalog-softBrown">
      <div className="container mx-auto max-w-md">
        {isExpanded ? (
          <div className="flex justify-around items-center py-2 animate-fade-in">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.name} 
                  to={item.path}
                  className="flex flex-col items-center"
                  onClick={() => setIsExpanded(false)}
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all ${
                      isActive ? "shadow-md" : ""
                    }`}
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
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <button
              onClick={toggleNavbar}
              className="w-12 h-12 rounded-full bg-catalog-teal flex items-center justify-center shadow-md text-white"
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

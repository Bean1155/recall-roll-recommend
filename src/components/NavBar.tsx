
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, CollectionIcon, Sparkles, PlusCircle } from "lucide-react";

const NavBar = () => {
  const location = useLocation();

  const navItems = [
    {
      name: "Profile",
      icon: User,
      path: "/profile",
      color: "#FDE1D3" // Soft Peach
    },
    {
      name: "Collections",
      icon: CollectionIcon,
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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm border-t border-catalog-softBrown py-2">
      <div className="container mx-auto max-w-md">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className="flex flex-col items-center"
              >
                <div 
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-1 transition-all ${
                    isActive ? "shadow-md" : ""
                  }`}
                  style={{ backgroundColor: item.color }}
                >
                  <item.icon 
                    size={30} 
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
      </div>
    </div>
  );
};

export default NavBar;

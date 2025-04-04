
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
  name: string;
  icon: LucideIcon;
  path: string;
  color: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ name, icon: Icon, path, color, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link 
      to={path}
      className="flex flex-col items-center"
      onClick={onClick}
    >
      <div 
        className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all duration-200 ${
          isActive ? "shadow-md" : ""
        } hover:scale-125 hover:shadow-lg`}
        style={{ backgroundColor: color }}
      >
        <Icon 
          size={22} 
          className={`transition-colors ${
            isActive ? "text-catalog-teal" : "text-catalog-softBrown"
          }`}
        />
      </div>
      <span className={`text-xs font-medium ${
        isActive ? "text-catalog-teal" : "text-catalog-softBrown"
      } transition-all duration-200 group-hover:font-bold`}>
        {name}
      </span>
    </Link>
  );
};

export default NavItem;

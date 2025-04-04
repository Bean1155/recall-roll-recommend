
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Settings } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ProfilePopoverProps {
  path: string;
  color: string;
  onClick?: () => void;
}

const ProfilePopover: React.FC<ProfilePopoverProps> = ({ path, color, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex flex-col items-center order-last cursor-pointer group">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all duration-200 ${
              isActive ? "shadow-md" : ""
            } hover:scale-125 hover:shadow-lg`}
            style={{ backgroundColor: color }}
          >
            <User 
              size={22} 
              className={`transition-colors ${
                isActive ? "text-catalog-teal" : "text-white"
              }`}
            />
          </div>
          <span className={`text-xs font-medium ${
            isActive ? "text-catalog-teal" : "text-catalog-softBrown"
          } transition-all duration-200 group-hover:font-bold`}>
            Profile
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0 bg-white shadow-lg rounded-lg border border-catalog-softBrown/20">
        <div className="flex flex-col">
          <Link 
            to="/profile" 
            className="flex items-center gap-2 p-3 hover:bg-gray-50"
            onClick={onClick}
          >
            <User size={18} className="text-catalog-softBrown" />
            <span className="text-sm">Profile</span>
          </Link>
          <Link 
            to="/settings" 
            className="flex items-center gap-2 p-3 hover:bg-gray-50 border-t border-catalog-softBrown/10"
            onClick={onClick}
          >
            <Settings size={18} className="text-catalog-softBrown" />
            <span className="text-sm">Settings</span>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopover;

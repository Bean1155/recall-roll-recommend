
import React from "react";
import { Menu } from "lucide-react";

interface NavBarToggleProps {
  onClick: () => void;
}

const NavBarToggle: React.FC<NavBarToggleProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-full bg-catalog-teal flex items-center justify-center shadow-md text-white hover:bg-catalog-darkTeal transition-colors duration-200 hover:scale-110 hover:shadow-lg"
    >
      <Menu size={24} />
    </button>
  );
};

export default NavBarToggle;

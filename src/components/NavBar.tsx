
import React, { useState } from "react";
import NavItem from "./navigation/NavItem";
import SearchButton from "./navigation/SearchButton";
import AddItemPopover from "./navigation/AddItemPopover";
import ProfilePopover from "./navigation/ProfilePopover";
import NavBarToggle from "./navigation/NavBarToggle";
import { navItems, searchItem, addItem, profileItem } from "./navigation/navConstants";

const NavBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleItemClick = () => {
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm border-t border-catalog-softBrown">
      <div className="container mx-auto max-w-md">
        {isExpanded ? (
          <div className="flex justify-around items-center py-2 animate-fade-in">
            {/* Regular navigation items */}
            {navItems.map((item) => (
              <NavItem
                key={item.name}
                name={item.name}
                icon={item.icon}
                path={item.path}
                color={item.color}
                onClick={handleItemClick}
              />
            ))}

            {/* Add button with popover */}
            <AddItemPopover 
              options={addItem.options} 
              color={addItem.color} 
              onClick={handleItemClick}
            />

            {/* Search button */}
            <SearchButton
              path={searchItem.path}
              color={searchItem.color}
              onClick={handleItemClick}
            />

            {/* Profile popover */}
            <ProfilePopover
              path={profileItem.path}
              color={profileItem.color}
              onClick={handleItemClick}
            />
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <NavBarToggle onClick={toggleNavbar} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;

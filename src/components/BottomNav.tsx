
import React from "react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.includes(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-catalog-manila border-t border-catalog-softBrown py-2 px-4 z-50">
      <div className="flex justify-around items-center">
        <Link to="/" className="flex flex-col items-center">
          <div className={`rounded-full ${isActive('/') ? 'bg-catalog-manila' : 'bg-white'} p-1 relative`}>
            <img 
              src="/lovable-uploads/21bccf52-613c-4ab1-8e40-872111e3d8ef.png" 
              alt="Profile" 
              className="w-9 h-9" 
            />
          </div>
          <span className={`text-xs mt-1 ${isActive('/') ? 'font-semibold' : 'text-gray-600'}`}>Profile</span>
        </Link>
        
        <Link to="/recommend" className="flex flex-col items-center">
          <div className={`rounded-full ${isActive('/recommend') ? 'bg-catalog-manila' : 'bg-white'} p-1 relative`}>
            <img 
              src="/lovable-uploads/1e31ed17-f4c9-477a-88f9-42fd2290b7f4.png" 
              alt="Recommendations" 
              className="w-9 h-9"
            />
          </div>
          <span className={`text-xs mt-1 ${isActive('/recommend') ? 'font-semibold' : 'text-gray-600'}`}>Recommend</span>
        </Link>
        
        <Link to="/collections" className="flex flex-col items-center">
          <div className={`rounded-full ${isActive('/collections') ? 'bg-catalog-manila' : 'bg-white'} p-1 relative`}>
            <img 
              src="/lovable-uploads/328c0014-5ba7-42f1-a57d-91628ab0cd09.png" 
              alt="Collections" 
              className="w-9 h-9" 
            />
          </div>
          <span className={`text-xs mt-1 ${isActive('/collections') ? 'font-semibold' : 'text-gray-600'}`}>Collections</span>
        </Link>
        
        <Link to="/create/food" className="flex flex-col items-center">
          <div className={`rounded-full ${isActive('/create') ? 'bg-catalog-manila' : 'bg-white'} p-1 relative`}>
            <img 
              src="/lovable-uploads/7fb0b78f-1a67-4fae-8211-8416211d5728.png" 
              alt="Add" 
              className="w-9 h-9" 
            />
          </div>
          <span className={`text-xs mt-1 ${isActive('/create') ? 'font-semibold' : 'text-gray-600'}`}>Add</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;

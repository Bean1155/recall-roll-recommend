
import React, { useEffect } from "react";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import { forceRewardsRefresh } from "@/utils/rewardUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface GridLayoutProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  headerContent?: React.ReactNode;
  className?: string;
}

const GridLayout: React.FC<GridLayoutProps> = ({ 
  children, 
  title, 
  icon, 
  headerContent,
  className
}) => {
  const isMobile = useIsMobile();
  
  // Force a rewards refresh when any page using GridLayout is loaded
  useEffect(() => {
    console.log("GridLayout: Component mounted, forcing rewards refresh");
    forceRewardsRefresh();
    
    // Set up a regular refresh interval
    const intervalId = setInterval(() => {
      forceRewardsRefresh();
    }, 5000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  return (
    <div 
      className={`min-h-screen flex flex-col font-typewriter w-full ${className || ''}`}
      style={{
        backgroundImage: `
          linear-gradient(to bottom, rgba(173, 200, 229, 0.5) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        backgroundColor: '#F5F1E6',
        overflowX: 'hidden'
      }}
    >
      <Header />
      
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-4 sm:py-6 mb-16 max-w-full sm:max-w-3xl lg:max-w-5xl">
        {title && (
          <div className="catalog-title text-xl sm:text-3xl mb-4 sm:mb-6 text-center flex items-center justify-center">
            {icon && <span className="mr-2">{icon}</span>}
            {title}
          </div>
        )}
        {headerContent && (
          <div className="flex justify-end mb-4">{headerContent}</div>
        )}
        {children}
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 z-40 w-full">
        <NavBar />
        
        {/* Copyright moved directly below the NavBar component */}
        <div className="text-center text-xs sm:text-sm text-catalog-softBrown py-2 border-t border-catalog-softBrown/20 bg-catalog-manila/50 w-full">
          <p>© {new Date().getFullYear()} TOTAL RECALL CATALOG • Tracking Every Bite and Blockbuster™</p>
        </div>
      </div>
    </div>
  );
};

export default GridLayout;

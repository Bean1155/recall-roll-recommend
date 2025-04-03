
import React from "react";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";

interface GridLayoutProps {
  children: React.ReactNode;
  title?: React.ReactNode;
}

const GridLayout: React.FC<GridLayoutProps> = ({ children, title }) => {
  return (
    <div 
      className="min-h-screen flex flex-col font-typewriter"
      style={{
        backgroundImage: `
          linear-gradient(to bottom, rgba(173, 200, 229, 0.5) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        backgroundColor: '#F5F1E6'
      }}
    >
      <Header />
      
      <main className="flex-1 container mx-auto px-3 py-4 sm:px-4 sm:py-8">
        {title && <h1 className="catalog-title text-xl sm:text-3xl mb-4 sm:mb-8 text-center">{title}</h1>}
        {children}
      </main>
      
      <div className="pb-20">
        <NavBar />
        
        {/* Copyright moved directly below the NavBar component */}
        <div className="text-center text-xs sm:text-sm text-catalog-softBrown py-2 border-t border-catalog-softBrown/20 bg-catalog-manila/50">
          <p>© {new Date().getFullYear()} TOTAL RECALL CATALOG • Tracking Every Bite and Blockbuster™</p>
        </div>
      </div>
    </div>
  );
};

export default GridLayout;

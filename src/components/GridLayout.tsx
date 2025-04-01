
import React from "react";
import Header from "@/components/Header";

interface GridLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const GridLayout: React.FC<GridLayoutProps> = ({ children, title }) => {
  return (
    <div 
      className="min-h-screen flex flex-col font-typewriter"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(173, 200, 229, 0.3) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(173, 200, 229, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        backgroundColor: '#F5F1E6'
      }}
    >
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {title && <h1 className="catalog-title text-3xl mb-8 text-center">{title}</h1>}
        {children}
      </main>
      
      <footer className="bg-catalog-manila border-t border-catalog-softBrown py-4 text-center text-sm text-catalog-softBrown">
        <p>© {new Date().getFullYear()} TOTAL RECALL CATALOG • Tracking Every Bite and Blockbuster™</p>
      </footer>
    </div>
  );
};

export default GridLayout;

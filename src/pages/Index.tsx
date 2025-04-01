
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Envelope from "@/components/Envelope";
import { Utensils, Clapperboard, PlusCircle, Search } from "lucide-react";
import { useState } from "react";
import GridLayout from "@/components/GridLayout";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  
  const handleMouseEnter = (cardId: string) => {
    setActiveCard(cardId);
  };

  const handleMouseLeave = () => {
    setActiveCard(null);
  };

  return (
    <GridLayout>
      <div className="text-center mb-10">
        <h1 className="catalog-title text-4xl md:text-6xl mb-4 text-[#3B3B3B]">TOTAL RECALL CATALOG</h1>
        <p className="catalog-subtitle text-lg md:text-xl text-[#A52A2A]">
          Tracking Every Bite and Blockbuster
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div>
          <Envelope label="BITES" className="h-auto transform hover:scale-[1.02] transition-transform duration-300">
            <div className="p-4 flex flex-col items-center justify-center min-h-[200px]">
              <Utensils 
                size={48} 
                className="mb-4 text-catalog-teal" 
              />
              
              <div className="grid grid-cols-2 gap-4 w-full mt-6 mb-8">
                <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal flex items-center justify-center">
                  <Link to="/bites">
                    <Search size={18} className="mr-2" />
                    Browse
                  </Link>
                </Button>
                
                <Button asChild className="bg-[#F97316] hover:bg-[#EA580C] text-white flex items-center justify-center">
                  <Link to="/create/food">
                    <PlusCircle size={18} className="mr-2" />
                    Add New
                  </Link>
                </Button>
              </div>
              
              <div className="border-t border-dashed border-catalog-softBrown w-full pt-3">
                <p className="text-catalog-softBrown text-sm text-center">
                  {new Date().toLocaleDateString()} • Your Food Memories
                </p>
              </div>
            </div>
          </Envelope>
        </div>
        
        <div>
          <Envelope label="BLOCKBUSTERS" className="h-auto transform hover:scale-[1.02] transition-transform duration-300">
            <div className="p-4 flex flex-col items-center justify-center min-h-[200px]">
              <Clapperboard 
                size={48} 
                className="mb-4 text-catalog-teal"
              />
              
              <div className="grid grid-cols-2 gap-4 w-full mt-6 mb-8">
                <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal flex items-center justify-center">
                  <Link to="/blockbusters">
                    <Search size={18} className="mr-2" />
                    Browse
                  </Link>
                </Button>
                
                <Button asChild className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white flex items-center justify-center">
                  <Link to="/create/entertainment">
                    <PlusCircle size={18} className="mr-2" />
                    Add New
                  </Link>
                </Button>
              </div>
              
              <div className="border-t border-dashed border-catalog-softBrown w-full pt-3">
                <p className="text-catalog-softBrown text-sm text-center">
                  {new Date().toLocaleDateString()} • Your Entertainment Memories
                </p>
              </div>
            </div>
          </Envelope>
        </div>
      </div>
      
      <div className="mt-16 max-w-2xl mx-auto text-center">
        <div className="catalog-card bg-white p-6">
          <h2 className="catalog-subtitle mb-4">How It Works</h2>
          <ol className="text-left space-y-4 font-typewriter">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>Create catalog cards for your favorite foods and entertainment.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>Browse your personal collection to recall experiences.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              <span>Recommend items to friends by sharing your cards.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">4.</span>
              <span>Track who recommended what to you and who you've shared with.</span>
            </li>
          </ol>
        </div>
      </div>
    </GridLayout>
  );
};

export default Index;

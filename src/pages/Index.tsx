
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Envelope from "@/components/Envelope";
import { Utensils, Clapperboard, PlusCircle, Search } from "lucide-react";
import { useState, useEffect } from "react";
import GridLayout from "@/components/GridLayout";
import { Card, CardContent } from "@/components/ui/card";
import { getCardsByType } from "@/lib/data";

const Index = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [foodLastUpdated, setFoodLastUpdated] = useState<{ label: string, date: string }>({ label: "Last updated:", date: "No entries yet" });
  const [entertainmentLastUpdated, setEntertainmentLastUpdated] = useState<{ label: string, date: string }>({ label: "Last updated:", date: "No entries yet" });
  
  useEffect(() => {
    // Get food cards and find the most recent date
    const foodCards = getCardsByType('food');
    if (foodCards.length > 0) {
      const sortedFoodCards = [...foodCards].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const latestFoodDate = new Date(sortedFoodCards[0].date);
      setFoodLastUpdated({ 
        label: "Last updated:", 
        date: latestFoodDate.toLocaleDateString() 
      });
    }
    
    // Get entertainment cards and find the most recent date
    const entertainmentCards = getCardsByType('entertainment');
    if (entertainmentCards.length > 0) {
      const sortedEntCards = [...entertainmentCards].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const latestEntDate = new Date(sortedEntCards[0].date);
      setEntertainmentLastUpdated({ 
        label: "Last updated:", 
        date: latestEntDate.toLocaleDateString() 
      });
    }
  }, []);
  
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
          <Envelope label="BITES" className="h-auto transform hover:scale-[1.02] transition-transform duration-300" backgroundColor="#FDE1D3">
            <div className="p-4 flex flex-col items-center justify-center min-h-[200px]">
              <Utensils 
                size={48} 
                className="mb-4 text-black" 
              />
              
              <div className="flex flex-col gap-4 w-full items-center mt-2">
                <div className="flex items-center justify-center p-1 relative">
                  <Button asChild variant="ghost" className="flex items-center justify-center h-full w-full hover:bg-transparent">
                    <Link to="/bites" className="flex items-center justify-center relative">
                      <Search size={22} className="text-[#A52A2A] absolute -left-5 top-1/2 -translate-y-1/2" />
                      <span className="font-script text-4xl text-[#A52A2A]">
                        Browse
                      </span>
                    </Link>
                  </Button>
                </div>
                
                <div className="flex items-center justify-center p-1">
                  <Button asChild variant="ghost" className="flex items-center justify-center h-full w-full hover:bg-transparent">
                    <Link to="/create/food" className="flex items-center justify-center relative">
                      <PlusCircle size={22} className="text-[#617B64] absolute -left-5 top-1/2 -translate-y-1/2" />
                      <span className="font-script text-4xl text-[#617B64]">
                        Add New
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="text-[#555555] text-sm text-center mt-6 flex flex-col">
                <span className="mb-1">{foodLastUpdated.label}</span>
                <span>{foodLastUpdated.date}</span>
              </div>
            </div>
          </Envelope>
        </div>
        
        <div>
          <Envelope label="BLOCKBUSTERS" className="h-auto transform hover:scale-[1.02] transition-transform duration-300" backgroundColor="#D6E5F0">
            <div className="p-4 flex flex-col items-center justify-center min-h-[200px]">
              <Clapperboard 
                size={48} 
                className="mb-4 text-black"
              />
              
              <div className="flex flex-col gap-4 w-full items-center mt-2">
                <div className="flex items-center justify-center p-1 relative">
                  <Button asChild variant="ghost" className="flex items-center justify-center h-full w-full hover:bg-transparent">
                    <Link to="/blockbusters" className="flex items-center justify-center relative">
                      <Search size={22} className="text-[#A52A2A] absolute -left-5 top-1/2 -translate-y-1/2" />
                      <span className="font-script text-4xl text-[#A52A2A]">
                        Browse
                      </span>
                    </Link>
                  </Button>
                </div>
                
                <div className="flex items-center justify-center p-1">
                  <Button asChild variant="ghost" className="flex items-center justify-center h-full w-full hover:bg-transparent">
                    <Link to="/create/entertainment" className="flex items-center justify-center relative">
                      <PlusCircle size={22} className="text-[#617B64] absolute -left-5 top-1/2 -translate-y-1/2" />
                      <span className="font-script text-4xl text-[#617B64]">
                        Add New
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="text-[#555555] text-sm text-center mt-6 flex flex-col">
                <span className="mb-1">{entertainmentLastUpdated.label}</span>
                <span>{entertainmentLastUpdated.date}</span>
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

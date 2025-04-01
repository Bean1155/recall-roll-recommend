import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Envelope from "@/components/Envelope";
import { FileText, Utensils, Clapperboard } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const handleMouseEnter = (cardId: string) => {
    setActiveCard(cardId);
  };

  const handleMouseLeave = () => {
    setActiveCard(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="catalog-title text-4xl md:text-6xl mb-4 text-[#3B3B3B]">TOTAL RECALL CATALOG</h1>
          <p className="catalog-subtitle text-lg md:text-xl text-catalog-softBrown">
            Tracking Every Bite and Blockbuster
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <Envelope label="FOOD EXPERIENCES" className="h-64">
              <div 
                className={`catalog-card catalog-card-food h-48 flex flex-col items-center justify-center transition-all duration-300 ${activeCard === 'bites' ? 'transform scale-105 shadow-lg' : ''}`}
                onMouseEnter={() => handleMouseEnter('bites')}
                onMouseLeave={handleMouseLeave}
                style={{ 
                  background: activeCard === 'bites' ? 'linear-gradient(135deg, #FDE1D3 0%, #FFBCA4 100%)' : '', 
                  boxShadow: activeCard === 'bites' ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : ''
                }}
              >
                <Utensils 
                  size={48} 
                  className={`mb-4 transition-all duration-300 ${activeCard === 'bites' ? 'text-catalog-teal scale-110' : 'text-catalog-softBrown'}`} 
                />
                <h2 className="catalog-subtitle mb-4">Bites</h2>
                <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal">
                  <Link to="/bites">View Collection</Link>
                </Button>
                <Button asChild variant="link" className="mt-2 text-catalog-softBrown">
                  <Link to="/create/food">+ Add New</Link>
                </Button>
              </div>
            </Envelope>
          </div>
          
          <div>
            <Envelope label="ENTERTAINMENT EXPERIENCES" className="h-64">
              <div 
                className={`catalog-card catalog-card-entertainment h-48 flex flex-col items-center justify-center transition-all duration-300 ${activeCard === 'blockbusters' ? 'transform scale-105 shadow-lg' : ''}`}
                onMouseEnter={() => handleMouseEnter('blockbusters')}
                onMouseLeave={handleMouseLeave}
                style={{ 
                  background: activeCard === 'blockbusters' ? 'linear-gradient(135deg, #D6E5F0 0%, #A7C7E7 100%)' : '', 
                  boxShadow: activeCard === 'blockbusters' ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : ''
                }}
              >
                <Clapperboard 
                  size={48} 
                  className={`mb-4 transition-all duration-300 ${activeCard === 'blockbusters' ? 'text-catalog-teal scale-110' : 'text-catalog-softBrown'}`}
                />
                <h2 className="catalog-subtitle mb-4">Blockbusters</h2>
                <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal">
                  <Link to="/blockbusters">View Collection</Link>
                </Button>
                <Button asChild variant="link" className="mt-2 text-catalog-softBrown">
                  <Link to="/create/entertainment">+ Add New</Link>
                </Button>
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
      </main>
      
      <footer className="bg-catalog-manila border-t border-catalog-softBrown py-4 text-center text-sm text-catalog-softBrown">
        <p>© {new Date().getFullYear()} TOTAL RECALL CATALOG • Tracking Every Bite and Blockbuster™</p>
      </footer>
    </div>
  );
};

export default Index;

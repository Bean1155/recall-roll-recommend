
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Envelope from "@/components/Envelope";
import { Book, Utensils, Clapperboard } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="catalog-title text-4xl md:text-6xl mb-4">TOTAL RECALL CATALOG</h1>
          <p className="catalog-subtitle text-lg md:text-xl text-catalog-softBrown">
            Tracking Every Bite and Blockbuster
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <Envelope label="FOOD EXPERIENCES" className="h-64">
              <div className="catalog-card catalog-card-food h-48 flex flex-col items-center justify-center">
                <Utensils size={48} className="mb-4 text-catalog-softBrown" />
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
              <div className="catalog-card catalog-card-entertainment h-48 flex flex-col items-center justify-center">
                <Clapperboard size={48} className="mb-4 text-catalog-softBrown" />
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

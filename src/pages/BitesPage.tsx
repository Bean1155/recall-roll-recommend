
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { Button } from "@/components/ui/button";
import { FoodCard } from "@/lib/types";
import { getCardsByType } from "@/lib/data";
import { useUser } from "@/contexts/UserContext";
import { PlusCircle } from "lucide-react";

const BitesPage = () => {
  const [foodCards, setFoodCards] = useState<FoodCard[]>([]);
  const { userName } = useUser();
  
  useEffect(() => {
    const cards = getCardsByType('food') as FoodCard[];
    setFoodCards(cards);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="catalog-title text-3xl">
            From the Library of <span className="font-typewriter font-bold text-black">{userName}</span>
          </h1>
          <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal">
            <Link to="/create/food">
              <PlusCircle size={18} className="mr-2" />
              Add New Bite
            </Link>
          </Button>
        </div>
        
        {foodCards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-catalog-softBrown mb-4">Your food catalog is empty.</p>
            <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal">
              <Link to="/create/food">
                <PlusCircle size={18} className="mr-2" />
                Add Your First Food Experience
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {foodCards.map((card) => (
              <Envelope key={card.id} label={card.cuisine}>
                <CatalogCard card={card} />
              </Envelope>
            ))}
          </div>
        )}
      </main>
      
      <footer className="bg-catalog-manila border-t border-catalog-softBrown py-4 text-center text-sm text-catalog-softBrown">
        <p>© {new Date().getFullYear()} TOTAL RECALL CATALOG • Tracking Every Bite and Blockbuster™</p>
      </footer>
    </div>
  );
};

export default BitesPage;

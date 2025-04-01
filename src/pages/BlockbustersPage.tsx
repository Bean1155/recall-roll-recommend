
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { Button } from "@/components/ui/button";
import { EntertainmentCard } from "@/lib/types";
import { getCardsByType } from "@/lib/data";
import { PlusCircle } from "lucide-react";
import GridLayout from "@/components/GridLayout";

const BlockbustersPage = () => {
  const [entertainmentCards, setEntertainmentCards] = useState<EntertainmentCard[]>([]);
  
  useEffect(() => {
    const cards = getCardsByType('entertainment') as EntertainmentCard[];
    setEntertainmentCards(cards);
  }, []);
  
  return (
    <GridLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="catalog-title text-3xl">Entertainment Experiences</h1>
        <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal">
          <Link to="/create/entertainment">
            <PlusCircle size={18} className="mr-2" />
            Add New Blockbuster
          </Link>
        </Button>
      </div>
      
      {entertainmentCards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-catalog-softBrown mb-4">Your entertainment catalog is empty.</p>
          <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal">
            <Link to="/create/entertainment">
              <PlusCircle size={18} className="mr-2" />
              Add Your First Entertainment Experience
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {entertainmentCards.map((card) => (
            <Envelope key={card.id} label={card.medium}>
              <CatalogCard card={card} />
            </Envelope>
          ))}
        </div>
      )}
    </GridLayout>
  );
};

export default BlockbustersPage;

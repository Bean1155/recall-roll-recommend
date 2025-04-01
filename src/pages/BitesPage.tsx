
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { Button } from "@/components/ui/button";
import { FoodCard } from "@/lib/types";
import { getCardsByType } from "@/lib/data";
import { useUser } from "@/contexts/UserContext";
import { PlusCircle } from "lucide-react";
import GridLayout from "@/components/GridLayout";

const BitesPage = () => {
  const [foodCards, setFoodCards] = useState<FoodCard[]>([]);
  const { userName } = useUser();
  
  useEffect(() => {
    const cards = getCardsByType('food') as FoodCard[];
    setFoodCards(cards);
  }, []);

  // Group food cards by category
  const groupedFoodCards = foodCards.reduce<Record<string, FoodCard[]>>((acc, card) => {
    const category = card.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(card);
    return acc;
  }, {});
  
  // Convert category names to title case
  const formatCategoryName = (category: string): string => {
    return category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Sort categories alphabetically
  const sortedCategories = Object.keys(groupedFoodCards).sort();
  
  return (
    <GridLayout>
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
        <div className="space-y-10">
          {sortedCategories.map((category) => (
            <div key={category} className="space-y-4">
              <h2 className="text-2xl font-bold text-catalog-teal border-b border-catalog-softBrown pb-2">
                {formatCategoryName(category)}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedFoodCards[category].map((card) => (
                  <Envelope key={card.id} label={card.cuisine}>
                    <CatalogCard card={card} />
                  </Envelope>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </GridLayout>
  );
};

export default BitesPage;

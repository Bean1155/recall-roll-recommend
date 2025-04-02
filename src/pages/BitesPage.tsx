
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { Button } from "@/components/ui/button";
import { FoodCard } from "@/lib/types";
import { getCardsByType } from "@/lib/data";
import { useUser } from "@/contexts/UserContext";
import { PlusCircle, Search } from "lucide-react";
import GridLayout from "@/components/GridLayout";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

const BitesPage = () => {
  const [foodCards, setFoodCards] = useState<FoodCard[]>([]);
  const { userName } = useUser();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const cards = getCardsByType("food") as FoodCard[];
    setFoodCards(cards);
  }, []);

  return (
    <GridLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="catalog-title text-3xl">
          From the Library of <span className="font-typewriter font-bold text-black">{userName}</span>
        </h1>
        <div className="flex gap-2">
          <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal">
            <Link to="/search?type=food">
              <Search size={18} className="mr-2" />
              Browse Bites
            </Link>
          </Button>
          <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal">
            <Link to="/create/food">
              <PlusCircle size={18} className="mr-2" />
              Add New Bite
            </Link>
          </Button>
        </div>
      </div>

      {foodCards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-catalog-softBrown mb-4">
            Your food catalog is empty.
          </p>
          <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal">
            <Link to="/create/food">
              <PlusCircle size={18} className="mr-2" />
              Add Your First Food Experience
            </Link>
          </Button>
        </div>
      ) : (
        <div className="border border-catalog-softBrown/30 rounded-lg p-4 bg-white shadow-md">
          <Carousel className="w-full">
            <CarouselContent>
              {foodCards.map((card) => (
                <CarouselItem key={card.id} className={isMobile ? "basis-full" : "md:basis-1/2 lg:basis-1/3"}>
                  <div className="p-1">
                    <Envelope label={card.title}>
                      <CatalogCard card={card} />
                    </Envelope>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-4">
              <CarouselPrevious className="relative static left-0 right-0 translate-y-0 bg-catalog-teal text-white hover:bg-catalog-darkTeal" />
              <CarouselNext className="relative static left-0 right-0 translate-y-0 bg-catalog-teal text-white hover:bg-catalog-darkTeal" />
            </div>
          </Carousel>
        </div>
      )}
    </GridLayout>
  );
};

export default BitesPage;

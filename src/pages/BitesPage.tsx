
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { Button } from "@/components/ui/button";
import { FoodCard, FoodCategory } from "@/lib/types";
import { getCardsByType } from "@/lib/data";
import { useUser } from "@/contexts/UserContext";
import { PlusCircle, Search, ChevronDown, ChevronUp } from "lucide-react";
import GridLayout from "@/components/GridLayout";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// Define the category colors
const categoryColors: Record<FoodCategory, string> = {
  "cafe": "#e6d7b8", // Light beige
  "diner": "#d2b48c", // Tan
  "specialty foods": "#8b7355", // Coffee brown
  "fine dining": "#b8860b", // Dark goldenrod
  "take out": "#d3b683", // Light brown
  "bakeries": "#f5deb3", // Wheat
  "bars": "#cd853f", // Peru
  "food trucks": "#deb887", // Burlywood
  "large event space": "#bc8f8f", // Rosy brown
  "restaurant": "#a0522d", // Sienna
  "etc.": "#d2b48c", // Tan
};

// Helper function to get category display name
const getCategoryDisplayName = (category: string): string => {
  return category
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const BitesPage = () => {
  const [foodCards, setFoodCards] = useState<FoodCard[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const { userName } = useUser();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const cards = getCardsByType("food") as FoodCard[];
    setFoodCards(cards);
    
    // Extract unique categories
    const uniqueCategories = Array.from(new Set(cards.map(card => card.category)));
    setCategories(uniqueCategories);
  }, []);

  // Group cards by category
  const cardsByCategory: Record<string, FoodCard[]> = {};
  foodCards.forEach(card => {
    if (!cardsByCategory[card.category]) {
      cardsByCategory[card.category] = [];
    }
    cardsByCategory[card.category].push(card);
  });

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
        <div className="space-y-4">
          <Accordion type="multiple" defaultValue={[categories[0]]} className="w-full">
            {categories.map((category) => {
              const categoryColor = categoryColors[category as FoodCategory] || "#d2b48c";
              const textColor = "#603913"; // Dark brown text for contrast
              
              return (
                <AccordionItem 
                  key={category} 
                  value={category}
                  className="mb-4 rounded-lg overflow-hidden border-none shadow-md"
                >
                  <div 
                    className="rounded-t-lg"
                    style={{ backgroundColor: categoryColor }}
                  >
                    <AccordionTrigger 
                      className="px-4 py-6 font-typewriter font-semibold text-lg flex hover:no-underline"
                      style={{ color: textColor }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <span>{getCategoryDisplayName(category)}</span>
                        </div>
                        <div className="flex items-center">
                          <ChevronDown className="h-5 w-5 transition-transform duration-200 shrink-0 accordion-icon" />
                        </div>
                      </div>
                    </AccordionTrigger>
                  </div>
                  
                  <AccordionContent className="bg-white px-4 py-4 border border-t-0 border-catalog-softBrown/30 rounded-b-lg">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {cardsByCategory[category]?.map((card) => (
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
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}
    </GridLayout>
  );
};

export default BitesPage;

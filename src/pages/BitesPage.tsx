
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const BitesPage = () => {
  const [foodCards, setFoodCards] = useState<FoodCard[]>([]);
  const { userName } = useUser();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const cards = getCardsByType("food") as FoodCard[];
    setFoodCards(cards);
  }, []);

  // Group food cards by category
  const groupedFoodCards = foodCards.reduce<Record<string, FoodCard[]>>((acc, card) => {
    const category = card.category || "other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(card);
    return acc;
  }, {});
  
  // Convert category names to title case
  const formatCategoryName = (category: string): string => {
    return category
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Sort categories alphabetically
  const sortedCategories = Object.keys(groupedFoodCards).sort();
  
  // Color mapping for categories
  const categoryColors: Record<string, string> = {
    "cafe": "bg-[#D6E5F0] text-gray-800", // Soft blue
    "diner": "bg-[#FFE29F] text-gray-800", // Soft yellow
    "specialty foods": "bg-[#FDE1D3] text-gray-800", // Soft peach
    "fine dining": "bg-[#E5DEFF] text-gray-800", // Soft purple
    "take out": "bg-[#FFDEE2] text-gray-800", // Soft pink
    "bakeries": "bg-[#F2FCE2] text-gray-800", // Soft green
    "bars": "bg-[#FFCCA1] text-gray-800", // Soft orange
    "food trucks": "bg-[#D8E4C8] text-gray-800", // Soft green
    "restaurant": "bg-[#F5F1E6] text-gray-800", // Manila
    "other": "bg-[#F1F0FB] text-gray-800", // Soft gray
  };

  // Get default color if category not in mapping
  const getCategoryColor = (category: string): string => {
    return categoryColors[category.toLowerCase()] || "bg-[#F1F0FB] text-gray-800";
  };
  
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
        <Tabs defaultValue={sortedCategories[0]}>
          <TabsList className="flex flex-wrap mb-6 bg-transparent space-x-1 space-y-1 h-auto">
            {sortedCategories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className={`${getCategoryColor(category)} rounded-md border border-catalog-softBrown/30 shadow-sm px-4 py-2 transition-all`}
              >
                {formatCategoryName(category)} ({groupedFoodCards[category].length})
              </TabsTrigger>
            ))}
          </TabsList>
          
          {sortedCategories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-4 py-4">
              <div className={`border-t-4 ${getCategoryColor(category).split(' ')[0]} border-catalog-softBrown/30 pt-4`}>
                <Carousel className="w-full">
                  <CarouselContent>
                    {groupedFoodCards[category].map((card) => (
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
            </TabsContent>
          ))}
        </Tabs>
      )}
    </GridLayout>
  );
};

export default BitesPage;

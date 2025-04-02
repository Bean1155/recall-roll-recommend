
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { Button } from "@/components/ui/button";
import { FoodCard, FoodCategory } from "@/lib/types";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
  const [activeCategory, setActiveCategory] = useState<string>("");
  const { userName } = useUser();
  const isMobile = useIsMobile();
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  useEffect(() => {
    const cards = getCardsByType("food") as FoodCard[];
    setFoodCards(cards);
    
    // Extract unique categories
    const uniqueCategories = Array.from(new Set(cards.map(card => card.category)));
    setCategories(uniqueCategories);
    
    // Set initial active category
    if (uniqueCategories.length > 0) {
      setActiveCategory(uniqueCategories[0]);
    }
  }, []);

  // Group cards by category
  const cardsByCategory: Record<string, FoodCard[]> = {};
  foodCards.forEach(card => {
    if (!cardsByCategory[card.category]) {
      cardsByCategory[card.category] = [];
    }
    cardsByCategory[card.category].push(card);
  });

  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    categoryRefs.current[category]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

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
        <div className="space-y-6">
          <div className="overflow-x-auto pb-2">
            <Tabs 
              value={activeCategory} 
              onValueChange={scrollToCategory}
              className="w-full"
            >
              <TabsList className="bg-catalog-cream h-auto p-1 w-full flex overflow-x-auto">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="font-typewriter"
                    style={{
                      backgroundColor: categoryColors[category as FoodCategory] || "#d2b48c",
                      borderBottom: activeCategory === category ? "3px solid #8b7355" : "none",
                      color: "#603913"
                    }}
                  >
                    {getCategoryDisplayName(category)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-8">
            {categories.map((category) => (
              <div 
                key={category}
                ref={el => categoryRefs.current[category] = el}
                className="border border-catalog-softBrown/30 rounded-lg p-4 bg-white shadow-md"
              >
                <Separator 
                  className={cn(
                    "my-2 h-1 rounded-full", 
                    activeCategory === category ? "bg-catalog-softBrown" : "bg-catalog-softBrown/50"
                  )}
                  style={{
                    backgroundColor: categoryColors[category as FoodCategory] || "#d2b48c"
                  }}
                />
                
                <div className="flex items-center gap-3 mb-4">
                  <h2 
                    className="text-xl font-typewriter font-semibold text-catalog-softBrown"
                    style={{
                      color: categoryColors[category as FoodCategory] 
                        ? "#603913" // Dark brown text for contrast
                        : "#8b7355"
                    }}
                  >
                    {getCategoryDisplayName(category)}
                  </h2>
                  <Separator className="flex-1" style={{
                    backgroundColor: categoryColors[category as FoodCategory] || "#d2b48c", 
                    opacity: 0.5,
                    height: "2px"
                  }}/>
                </div>
                
                <Carousel className="w-full">
                  <CarouselContent>
                    {cardsByCategory[category].map((card) => (
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
            ))}
          </div>
        </div>
      )}
    </GridLayout>
  );
};

export default BitesPage;

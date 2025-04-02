
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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { userName } = useUser();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const cards = getCardsByType("food") as FoodCard[];
    setFoodCards(cards);
    
    // Set default active category to the first one
    if (cards.length > 0) {
      const categories = getSortedCategories(cards);
      if (categories.length > 0) {
        setActiveCategory(categories[0]);
      }
    }
  }, []);

  // Group food cards by category
  const groupedFoodCards = foodCards.reduce<Record<string, FoodCard[]>>((acc, card) => {
    const category = card.category || "etc.";
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

  // Sort categories alphabetically, but ensure "etc." is last
  const getSortedCategories = (cards: FoodCard[]): string[] => {
    const categories = Array.from(new Set(cards.map(card => card.category || "etc.")));
    return categories.sort((a, b) => {
      if (a.toLowerCase() === "etc.") return 1;
      if (b.toLowerCase() === "etc.") return -1;
      return a.localeCompare(b);
    });
  };
  
  const sortedCategories = getSortedCategories(foodCards);
  
  // Color mapping for categories
  const categoryColors: Record<string, string> = {
    "cafe": "#D6E5F0", // Soft blue
    "diner": "#FFE29F", // Soft yellow
    "specialty foods": "#FDE1D3", // Soft peach
    "fine dining": "#E5DEFF", // Soft purple
    "take out": "#FFDEE2", // Soft pink
    "bakeries": "#F2FCE2", // Soft green
    "bars": "#FFCCA1", // Soft orange
    "food trucks": "#D8E4C8", // Soft green
    "restaurant": "#F5F1E6", // Manila
    "large event space": "#E5DEFF", // Soft purple
    "etc.": "#F1F0FB", // Soft gray
  };

  // Get default color if category not in mapping
  const getCategoryColor = (category: string): string => {
    return categoryColors[category.toLowerCase()] || "#F1F0FB";
  };
  
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
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
        <div className="flex border border-catalog-softBrown/30 rounded-lg overflow-hidden bg-white shadow-md">
          {/* Vertical tabs */}
          <div className="flex flex-col relative shrink-0 bg-gray-50 border-r border-catalog-softBrown/30">
            {sortedCategories.map((category, index) => (
              <div 
                key={category}
                className={`relative cursor-pointer transition-all`}
                onClick={() => handleCategoryClick(category)}
              >
                {/* Tab divider with color */}
                <div 
                  className={`w-16 h-16 flex items-center justify-center text-xs font-medium ${
                    category === activeCategory ? 'border-r-4' : ''
                  }`}
                  style={{ 
                    backgroundColor: getCategoryColor(category),
                    borderColor: category === activeCategory ? '#9E8979' : 'transparent',
                  }}
                >
                  <div className="writing-mode-vertical-rl transform rotate-180 whitespace-nowrap px-2 py-3">
                    {formatCategoryName(category)}
                    <span className="ml-1">({groupedFoodCards[category].length})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Content area */}
          <div className="flex-grow p-4 min-h-[400px] bg-[url('/public/lovable-uploads/215f942c-ba3b-4d38-b851-069868df939a.png')] bg-no-repeat bg-right-top overflow-hidden">
            {activeCategory && (
              <div className="h-full">
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b" style={{ borderColor: getCategoryColor(activeCategory) }}>
                  {formatCategoryName(activeCategory)}
                </h2>
                <Carousel className="w-full">
                  <CarouselContent>
                    {groupedFoodCards[activeCategory].map((card) => (
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
          </div>
        </div>
      )}

      <style jsx>{`
        .writing-mode-vertical-rl {
          writing-mode: vertical-rl;
        }
      `}</style>
    </GridLayout>
  );
};

export default BitesPage;


import { useEffect, useState } from "react";
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
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

// Define all categories from the FoodCategory type
const allCategories: FoodCategory[] = [
  "cafe", "diner", "specialty foods", "fine dining", "take out", 
  "bakeries", "bars", "food trucks", "large event space", "restaurant", "etc."
];

// Define the category colors with a vintage color palette from the provided image
const categoryColors: Record<FoodCategory, string> = {
  "cafe": "#f5c4d3", // Light pink
  "diner": "#e0c5c1", // Dusty rose
  "specialty foods": "#ddb892", // Tan
  "fine dining": "#e9b44c", // Golden yellow
  "take out": "#c1cc99", // Light olive
  "bakeries": "#9de0d0", // Mint
  "bars": "#a5b1c2", // Slate blue
  "food trucks": "#a64b2a", // Rust brown
  "large event space": "#ff6b45", // Coral
  "restaurant": "#e18336", // Burnt orange
  "etc.": "#da7f5d", // Terracotta
};

// Additional colors for more categories if needed
const extraColors = [
  "#cc7f43", // Light brown
  "#d35843", // Brick red
  "#4d583c", // Olive green
  "#8c9e5e", // Moss green
  "#358f8f", // Teal
  "#6b798e", // Dusty blue
  "#2f5d60", // Dark teal
  "#1a535c", // Deep teal
  "#4a3f35", // Dark brown
  "#232e33", // Almost black
];

// Helper function to get category display name
const getCategoryDisplayName = (category: string): string => {
  return category
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper function to generate text color based on background
const getTextColor = (backgroundColor: string): string => {
  // Convert hex to RGB
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return white for dark backgrounds, dark brown for light backgrounds
  return brightness > 145 ? "#603913" : "#ffffff";
};

const BitesPage = () => {
  const [foodCards, setFoodCards] = useState<FoodCard[]>([]);
  const { userName } = useUser();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const cards = getCardsByType("food") as FoodCard[];
    setFoodCards(cards);
  }, []);

  // Group cards by category
  const cardsByCategory: Record<string, FoodCard[]> = {};
  
  // Initialize all categories with empty arrays
  allCategories.forEach(category => {
    cardsByCategory[category] = [];
  });
  
  // Then populate with actual cards
  foodCards.forEach(card => {
    if (cardsByCategory[card.category]) {
      cardsByCategory[card.category].push(card);
    }
  });

  return (
    <GridLayout>
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="catalog-title text-3xl">
          From the Library of <span className="font-typewriter font-bold text-black">{userName}</span>
        </h1>
        <div className="flex flex-wrap gap-2">
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
        <div className="text-center py-12 bg-catalog-cream rounded-lg border border-catalog-softBrown/30 shadow-md">
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
          <Accordion type="multiple" defaultValue={[allCategories[0]]} className="w-full">
            {allCategories.map((category) => {
              const categoryColor = categoryColors[category] || "#d2b48c";
              const textColor = getTextColor(categoryColor);
              const hasCards = cardsByCategory[category].length > 0;
              
              return (
                <AccordionItem 
                  key={category} 
                  value={category}
                >
                  <div 
                    style={{ backgroundColor: categoryColor, borderRadius: "0.5rem 0.5rem 0 0" }}
                    className="transition-colors duration-150"
                  >
                    <AccordionTrigger 
                      className="px-6 py-6 font-typewriter font-semibold text-lg"
                      style={{ color: textColor }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <span>{getCategoryDisplayName(category)}</span>
                          {!hasCards && (
                            <span className="text-sm opacity-70 font-normal">(No entries yet)</span>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                  </div>
                  
                  <AccordionContent 
                    className="bg-white border border-t-0 rounded-b-lg"
                    style={{ borderColor: categoryColor }}
                  >
                    {hasCards ? (
                      <Carousel className="w-full">
                        <CarouselContent>
                          {cardsByCategory[category].map((card) => (
                            <CarouselItem key={card.id} className={isMobile ? "basis-full" : "md:basis-1/2 lg:basis-1/3"}>
                              <div className="p-1">
                                <Envelope 
                                  label={card.title}
                                  backgroundColor={categoryColor}
                                >
                                  <CatalogCard card={card} />
                                </Envelope>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <div className="flex justify-end gap-2 mt-4">
                          <CarouselPrevious 
                            className="relative static translate-y-0" 
                            style={{ backgroundColor: categoryColor, color: textColor }}
                          />
                          <CarouselNext 
                            className="relative static translate-y-0" 
                            style={{ backgroundColor: categoryColor, color: textColor }}
                          />
                        </div>
                      </Carousel>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-catalog-softBrown mb-4">No entries in this category yet.</p>
                        <Button asChild style={{ backgroundColor: categoryColor, color: textColor }}>
                          <Link to={`/create/food?category=${category}`}>
                            <PlusCircle size={16} className="mr-2" />
                            Add {getCategoryDisplayName(category)} Experience
                          </Link>
                        </Button>
                      </div>
                    )}
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


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { Button } from "@/components/ui/button";
import { EntertainmentCard } from "@/lib/types";
import { getCardsByType } from "@/lib/data";
import { PlusCircle, Search } from "lucide-react";
import GridLayout from "@/components/GridLayout";
import { useUser } from "@/contexts/UserContext";
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

// Define all entertainment categories
const allCategories = [
  "movies", "tv shows", "documentaries", "concerts", 
  "theater", "musicals", "podcasts", "comedy", "anime", "etc."
];

// Define the category colors with a vintage color palette
const categoryColors: Record<string, string> = {
  "movies": "#f5c4d3", // Light pink
  "tv shows": "#e0c5c1", // Dusty rose
  "documentaries": "#ddb892", // Tan
  "concerts": "#e9b44c", // Golden yellow
  "theater": "#c1cc99", // Light olive
  "musicals": "#9de0d0", // Mint
  "podcasts": "#a5b1c2", // Slate blue
  "comedy": "#a64b2a", // Rust brown
  "anime": "#ff6b45", // Coral
  "etc.": "#da7f5d", // Terracotta
};

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

const BlockbustersPage = () => {
  const [entertainmentCards, setEntertainmentCards] = useState<EntertainmentCard[]>([]);
  const { userName } = useUser();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const cards = getCardsByType('entertainment') as EntertainmentCard[];
    setEntertainmentCards(cards);
  }, []);
  
  // Group cards by category
  const cardsByCategory: Record<string, EntertainmentCard[]> = {};
  
  // Initialize all categories with empty arrays
  allCategories.forEach(category => {
    cardsByCategory[category] = [];
  });
  
  // Then populate with actual cards
  entertainmentCards.forEach(card => {
    const category = card.entertainmentCategory?.toLowerCase() || 'etc.';
    if (cardsByCategory[category]) {
      cardsByCategory[category].push(card);
    } else {
      // If category doesn't match predefined categories, add to "etc."
      cardsByCategory['etc.'].push(card);
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
            <Link to="/search?type=entertainment">
              <Search size={18} className="mr-2" />
              Browse Blockbusters
            </Link>
          </Button>
          <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal">
            <Link to="/create/entertainment">
              <PlusCircle size={18} className="mr-2" />
              Add New Blockbuster
            </Link>
          </Button>
        </div>
      </div>

      {entertainmentCards.length === 0 ? (
        <div className="text-center py-12 bg-catalog-cream rounded-lg border border-catalog-softBrown/30 shadow-md">
          <p className="text-lg text-catalog-softBrown mb-4">
            Your entertainment catalog is empty.
          </p>
          <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal">
            <Link to="/create/entertainment">
              <PlusCircle size={18} className="mr-2" />
              Add Your First Entertainment Experience
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
                          <Link to={`/create/entertainment?category=${category}`}>
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

export default BlockbustersPage;

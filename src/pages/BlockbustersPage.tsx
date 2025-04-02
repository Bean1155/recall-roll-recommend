
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const BlockbustersPage = () => {
  const [entertainmentCards, setEntertainmentCards] = useState<EntertainmentCard[]>([]);
  const { userName } = useUser();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const cards = getCardsByType('entertainment') as EntertainmentCard[];
    setEntertainmentCards(cards);
  }, []);
  
  // Group entertainment cards by their entertainment category
  const groupedEntertainmentCards = entertainmentCards.reduce<Record<string, EntertainmentCard[]>>((acc, card) => {
    const category = card.entertainmentCategory || 'etc.';
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

  // Sort categories alphabetically, but ensure "etc." is last
  const sortedCategories = Object.keys(groupedEntertainmentCards).sort((a, b) => {
    if (a.toLowerCase() === "etc.") return 1;
    if (b.toLowerCase() === "etc.") return -1;
    return a.localeCompare(b);
  });
  
  // Color mapping for entertainment categories
  const categoryColors: Record<string, string> = {
    "movies": "bg-[#FFE29F] text-gray-800", // Soft yellow
    "tv shows": "bg-[#D6E5F0] text-gray-800", // Soft blue 
    "documentaries": "bg-[#E5DEFF] text-gray-800", // Soft purple
    "anime": "bg-[#FDE1D3] text-gray-800", // Soft peach
    "concerts": "bg-[#FFDEE2] text-gray-800", // Soft pink
    "theater": "bg-[#D8E4C8] text-gray-800", // Soft green
    "podcasts": "bg-[#FFCCA1] text-gray-800", // Soft orange
    "books": "bg-[#F2FCE2] text-gray-800", // Soft green
    "games": "bg-[#E5F1FF] text-gray-800", // Light blue
    "comedies": "bg-[#FFE8D6] text-gray-800", // Peach
    "events": "bg-[#D1F5EA] text-gray-800", // Mint
    "live performances": "bg-[#FFECB3] text-gray-800", // Light amber
    "etc.": "bg-[#F1F0FB] text-gray-800", // Soft gray
  };

  // Get default color if category not in mapping
  const getCategoryColor = (category: string): string => {
    return categoryColors[category.toLowerCase()] || "bg-[#F1F0FB] text-gray-800";
  };
  
  return (
    <GridLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="catalog-title text-3xl">From the Library of {userName}</h1>
        <div className="flex gap-2">
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
        <div className="text-center py-12">
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
        <Tabs defaultValue={sortedCategories[0]}>
          <TabsList className="flex flex-wrap mb-6 bg-transparent space-x-1 space-y-1 h-auto">
            {sortedCategories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className={`${getCategoryColor(category)} rounded-md border border-catalog-softBrown/30 shadow-sm px-4 py-2 transition-all`}
              >
                {formatCategoryName(category)} ({groupedEntertainmentCards[category].length})
              </TabsTrigger>
            ))}
          </TabsList>
          
          {sortedCategories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-4 py-4">
              <div className={`border-t-4 ${getCategoryColor(category).split(' ')[0]} border-catalog-softBrown/30 pt-4`}>
                <Carousel className="w-full">
                  <CarouselContent>
                    {groupedEntertainmentCards[category].map((card) => (
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

export default BlockbustersPage;

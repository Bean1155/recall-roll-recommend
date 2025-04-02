
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { Button } from "@/components/ui/button";
import { EntertainmentCard } from "@/lib/types";
import { getCardsByType } from "@/lib/data";
import { PlusCircle } from "lucide-react";
import GridLayout from "@/components/GridLayout";
import { useUser } from "@/contexts/UserContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BlockbustersPage = () => {
  const [entertainmentCards, setEntertainmentCards] = useState<EntertainmentCard[]>([]);
  const [viewMode, setViewMode] = useState<"accordion" | "carousel">("accordion");
  const { userName } = useUser();
  
  useEffect(() => {
    const cards = getCardsByType('entertainment') as EntertainmentCard[];
    setEntertainmentCards(cards);
  }, []);
  
  // Group entertainment cards by their entertainment category
  const groupedEntertainmentCards = entertainmentCards.reduce<Record<string, EntertainmentCard[]>>((acc, card) => {
    const category = card.entertainmentCategory || 'other';
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
  const sortedCategories = Object.keys(groupedEntertainmentCards).sort();
  
  return (
    <GridLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="catalog-title text-3xl">From the Library of {userName}</h1>
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
        <div className="space-y-6">
          <Tabs defaultValue="accordion" className="w-full">
            <TabsList className="w-full max-w-md mx-auto mb-6">
              <TabsTrigger 
                value="accordion" 
                className="w-1/2 data-[state=active]:bg-catalog-teal data-[state=active]:text-white"
                onClick={() => setViewMode("accordion")}
              >
                Accordion View
              </TabsTrigger>
              <TabsTrigger 
                value="carousel" 
                className="w-1/2 data-[state=active]:bg-catalog-teal data-[state=active]:text-white"
                onClick={() => setViewMode("carousel")}
              >
                Carousel View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="accordion" className="space-y-6">
              <Accordion type="multiple" className="w-full">
                {sortedCategories.map((category) => (
                  <AccordionItem 
                    key={category} 
                    value={category}
                    className="border-catalog-softBrown"
                  >
                    <AccordionTrigger className="text-xl font-bold text-catalog-teal hover:text-catalog-darkTeal py-4">
                      {formatCategoryName(category)} ({groupedEntertainmentCards[category].length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                        {groupedEntertainmentCards[category].map((card) => (
                          <Envelope key={card.id} label={card.medium}>
                            <CatalogCard card={card} />
                          </Envelope>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="carousel" className="space-y-10">
              {sortedCategories.map((category) => (
                <div key={category} className="space-y-4 py-4">
                  <h2 className="text-2xl font-bold text-catalog-teal border-b border-catalog-softBrown pb-2">
                    {formatCategoryName(category)} ({groupedEntertainmentCards[category].length})
                  </h2>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {groupedEntertainmentCards[category].map((card) => (
                        <CarouselItem key={card.id} className="md:basis-1/2 lg:basis-1/3">
                          <div className="p-1">
                            <Envelope label={card.medium}>
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
            </TabsContent>
          </Tabs>
        </div>
      )}
    </GridLayout>
  );
};

export default BlockbustersPage;

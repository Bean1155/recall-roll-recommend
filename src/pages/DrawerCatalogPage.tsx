
import { useState } from "react";
import { Utensils, Clapperboard } from "lucide-react";
import GridLayout from "@/components/GridLayout";
import { EntertainmentCard, FoodCard } from "@/lib/types";
import { getCardsByType } from "@/lib/data";
import CatalogCard from "@/components/CatalogCard";
import { useUser } from "@/contexts/UserContext";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import Envelope from "@/components/Envelope";

const DrawerCatalogPage = () => {
  const [foodCards, setFoodCards] = useState<FoodCard[]>([]);
  const [entertainmentCards, setEntertainmentCards] = useState<EntertainmentCard[]>([]);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const { userName } = useUser();
  const isMobile = useIsMobile();

  // Load cards when a drawer is opened
  const handleDrawerOpen = (type: "food" | "entertainment") => {
    setActiveDrawer(type);
    if (type === "food") {
      const cards = getCardsByType("food") as FoodCard[];
      setFoodCards(cards);
    } else {
      const cards = getCardsByType("entertainment") as EntertainmentCard[];
      setEntertainmentCards(cards);
    }
  };

  return (
    <GridLayout>
      <div className="text-center mb-10">
        <h1 className="catalog-title text-4xl md:text-6xl mb-4 text-[#3B3B3B]">
          CATALOG DRAWERS
        </h1>
        <p className="catalog-subtitle text-lg md:text-xl text-[#A52A2A]">
          Open a drawer to browse your collection
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 my-12">
        {/* Bites Drawer */}
        <Drawer onOpenChange={(open) => {
          if (open) handleDrawerOpen("food");
        }}>
          <DrawerTrigger asChild>
            <div
              className="relative flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
              style={{ width: "220px" }}
            >
              <div className="bg-[#d4a76a] rounded-lg h-16 w-full flex items-center justify-center shadow-md border border-[#b38c50]">
                <Utensils className="text-[#5c4a2a] h-8 w-8" />
              </div>
              <div className="bg-[#e0b77e] rounded-md h-10 w-full mt-1 flex items-center justify-center shadow-md border border-[#b38c50]">
                <div className="h-1 w-16 bg-[#8a6c3c] rounded-full" />
              </div>
              <p className="mt-2 font-typewriter text-lg font-semibold text-[#5c4a2a]">
                BITES
              </p>
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-6xl">
              <DrawerHeader>
                <DrawerTitle className="text-2xl font-typewriter text-catalog-softBrown">
                  Your Bites Collection
                </DrawerTitle>
                <DrawerDescription>
                  {userName}'s food experiences catalog
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4 pb-10">
                {foodCards.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-lg text-catalog-softBrown">
                      Your food catalog is empty.
                    </p>
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Blockbusters Drawer */}
        <Drawer onOpenChange={(open) => {
          if (open) handleDrawerOpen("entertainment");
        }}>
          <DrawerTrigger asChild>
            <div
              className="relative flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
              style={{ width: "220px" }}
            >
              <div className="bg-[#d4a76a] rounded-lg h-16 w-full flex items-center justify-center shadow-md border border-[#b38c50]">
                <Clapperboard className="text-[#5c4a2a] h-8 w-8" />
              </div>
              <div className="bg-[#e0b77e] rounded-md h-10 w-full mt-1 flex items-center justify-center shadow-md border border-[#b38c50]">
                <div className="h-1 w-16 bg-[#8a6c3c] rounded-full" />
              </div>
              <p className="mt-2 font-typewriter text-lg font-semibold text-[#5c4a2a]">
                BLOCKBUSTERS
              </p>
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-6xl">
              <DrawerHeader>
                <DrawerTitle className="text-2xl font-typewriter text-catalog-softBrown">
                  Your Blockbusters Collection
                </DrawerTitle>
                <DrawerDescription>
                  {userName}'s entertainment experiences catalog
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4 pb-10">
                {entertainmentCards.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-lg text-catalog-softBrown">
                      Your entertainment catalog is empty.
                    </p>
                  </div>
                ) : (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {entertainmentCards.map((card) => (
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
                )}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="mt-8 bg-white bg-opacity-80 rounded-lg p-6 shadow-md max-w-2xl mx-auto">
        <h2 className="font-typewriter text-xl mb-4 text-center text-catalog-softBrown">How to Use</h2>
        <ol className="list-decimal pl-6 space-y-2 font-typewriter text-catalog-softBrown">
          <li>Click on a drawer to open it</li>
          <li>Browse through your collection using the carousel</li>
          <li>Click outside or swipe down to close the drawer</li>
        </ol>
      </div>
    </GridLayout>
  );
};

export default DrawerCatalogPage;

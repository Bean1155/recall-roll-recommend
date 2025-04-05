
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { EntertainmentCard } from "@/lib/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface EntertainmentCardsDisplayProps {
  category?: string;
  cards: EntertainmentCard[];
  categoryColor?: string;
  categoryDisplayName?: string;
  textColor?: string;
  onCardClick?: (card: EntertainmentCard) => void;
  filters?: {
    status: string[];
    rating: number[];
    tags: string[];
  };
  categoryColors?: Record<string, string>;
  onOpenFilters?: () => void;
}

const EntertainmentCardsDisplay = ({
  category,
  cards,
  categoryColor,
  categoryDisplayName,
  textColor,
  onCardClick,
  filters,
  categoryColors,
  onOpenFilters,
}: EntertainmentCardsDisplayProps) => {
  const hasCards = cards.length > 0;

  return (
    <>
      {hasCards ? (
        <Carousel className="w-full">
          <CarouselContent>
            {cards.map((card) => (
              <CarouselItem key={card.id} className="basis-full">
                <div 
                  className="p-1" 
                  id={`card-${card.id}`}
                  onClick={() => onCardClick?.(card)}
                >
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
              className="relative static translate-y-0 h-6 w-6 sm:h-8 sm:w-8" 
              style={{ backgroundColor: categoryColor, color: textColor }}
            />
            <CarouselNext 
              className="relative static translate-y-0 h-6 w-6 sm:h-8 sm:w-8" 
              style={{ backgroundColor: categoryColor, color: textColor }}
            />
          </div>
        </Carousel>
      ) : (
        <div className="text-center py-4 sm:py-8">
          <p className="text-catalog-softBrown mb-4 text-sm sm:text-base">No entries in this category yet.</p>
          <Button asChild 
            className="text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4 h-auto" 
            style={{ backgroundColor: categoryColor, color: textColor }}
          >
            <Link to={`/create/entertainment?category=${category}`}>
              <PlusCircle size={12} className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">Add {categoryDisplayName}</span>
            </Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default EntertainmentCardsDisplay;

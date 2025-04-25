
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { EntertainmentCard } from "@/lib/types";
import { getCategoryDisplayName } from "@/utils/categoryUtils";
import SharedCardDisplay from "@/components/shared/SharedCardDisplay";
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
  categoryColor = "#e0c6a3",
  categoryDisplayName,
  textColor = "#603913",
  onCardClick,
  filters,
  categoryColors,
  onOpenFilters,
}: EntertainmentCardsDisplayProps) => {
  const hasCards = cards.length > 0;
  const displayName = categoryDisplayName || (category ? getCategoryDisplayName(category) : "Entertainment");
  
  return (
    <div>
      {hasCards ? (
        <Carousel className="w-full">
          <CarouselContent>
            {cards.map((card) => (
              <CarouselItem key={card.id} className="basis-full">
                <div className="p-1">
                  <SharedCardDisplay
                    card={card}
                    type="entertainment"
                    categoryColor={categoryColor}
                    onCardClick={onCardClick}
                  />
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
        <div className="text-center py-4">
          <p className="text-catalog-softBrown mb-4">No entries in this category yet.</p>
          <Button asChild 
            className="text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4 h-auto"
            style={{ backgroundColor: categoryColor, color: textColor }}
          >
            <Link to={category ? `/create/entertainment?category=${category}` : "/create/entertainment"}>
              <PlusCircle size={12} className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">Add {displayName}</span>
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default EntertainmentCardsDisplay;

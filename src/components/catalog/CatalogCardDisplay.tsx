
import { CatalogCard } from "@/lib/types";
import CatalogCardComponent from "@/components/CatalogCard";
import CatalogCardCompact from "@/components/CatalogCardCompact";
import Envelope from "@/components/Envelope";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CatalogCardDisplayProps {
  cards: CatalogCard[];
  categoryName: string;
  categoryDisplayName: string;
  categoryColor: string;
  textColor?: string;
  compact?: boolean;
  type: 'food' | 'entertainment';
  onCardClick?: (card: CatalogCard) => void;
  createPath?: string;
}

const CatalogCardDisplay = ({
  cards,
  categoryName,
  categoryDisplayName,
  categoryColor,
  textColor = '#603913',
  compact = false,
  type,
  onCardClick,
  createPath,
}: CatalogCardDisplayProps) => {
  const hasCards = cards.length > 0;
  const navigate = useNavigate();

  const defaultCreatePath = type === 'food' 
    ? `/create/food?category=${categoryName}`
    : `/create/entertainment?category=${categoryName}`;

  const handleCardClick = (card: CatalogCard) => {
    if (onCardClick) {
      onCardClick(card);
    } else {
      navigate(`/edit/${card.id}`);
    }
  };

  if (compact) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {hasCards ? (
          cards.slice(0, 12).map(card => (
            <Link 
              to={`/${type === 'food' ? 'bites' : 'blockbusters'}?highlight=${card.id}`} 
              key={card.id} 
              className="block"
            >
              <div className="letterboxd-style-card">
                <CatalogCardCompact card={card} compact={true} />
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-4 col-span-full text-gray-500">
            No items found in this category.
          </div>
        )}
        
        {cards.length > 12 && (
          <div className="text-center mt-4 col-span-full">
            <Button asChild variant="outline" style={{ borderColor: categoryColor, color: categoryColor }}>
              <Link to={`/${type === 'food' ? 'bites' : 'blockbusters'}?category=${categoryName}`}>
                View all {cards.length} items
              </Link>
            </Button>
          </div>
        )}
      </div>
    );
  }

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
                  onClick={() => handleCardClick(card)}
                >
                  <Envelope 
                    label={card.title}
                    backgroundColor={categoryColor}
                  >
                    <CatalogCardComponent card={card} />
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
            <Link to={createPath || defaultCreatePath}>
              <PlusCircle size={12} className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">Add {categoryDisplayName}</span>
            </Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default CatalogCardDisplay;

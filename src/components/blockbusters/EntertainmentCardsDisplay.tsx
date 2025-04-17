
import { Link, useNavigate } from "react-router-dom";
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
import { getCategoryDisplayName } from "@/utils/categoryUtils";
import CatalogCardDisplay from "@/components/catalog/CatalogCardDisplay";

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
    <CatalogCardDisplay 
      cards={cards}
      categoryName={category || "entertainment"}
      categoryDisplayName={displayName}
      categoryColor={categoryColor}
      textColor={textColor}
      type="entertainment"
      onCardClick={onCardClick}
      createPath={category ? `/create/entertainment?category=${category}` : "/create/entertainment"}
    />
  );
};

export default EntertainmentCardsDisplay;

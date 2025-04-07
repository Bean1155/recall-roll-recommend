
import { FoodCard } from "@/lib/types";
import { Star } from "lucide-react";

interface FoodCardDetailsProps {
  card: FoodCard;
}

const FoodCardDetails = ({ card }: FoodCardDetailsProps) => {
  // Helper function to render stars for the service rating
  const renderServiceRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {card.creator && (
        <p className="text-gray-700">
          <span className="font-medium">Chef/Restaurant:</span> {card.creator}
        </p>
      )}
      {card.cuisine && (
        <p className="text-gray-700">
          <span className="font-medium">Cuisine:</span> {card.cuisine}
        </p>
      )}
      {card.location && (
        <p className="text-gray-700">
          <span className="font-medium">Location:</span> {card.location}
        </p>
      )}
      {card.status && (
        <p className="text-gray-700">
          <span className="font-medium">Status:</span> {card.status}
        </p>
      )}
      {card.visitCount > 0 && (
        <p className="text-gray-700">
          <span className="font-medium">Visit Count:</span> {card.visitCount}
        </p>
      )}
      {card.serviceRating && (
        <p className="text-gray-700">
          <span className="font-medium">Service:</span> {renderServiceRating(card.serviceRating)}
        </p>
      )}
    </div>
  );
};

export default FoodCardDetails;

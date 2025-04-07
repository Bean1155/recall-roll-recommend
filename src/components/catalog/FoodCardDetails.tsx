
import { FoodCard } from "@/lib/types";

interface FoodCardDetailsProps {
  card: FoodCard;
}

const FoodCardDetails = ({ card }: FoodCardDetailsProps) => {
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
          <span className="font-medium">Service:</span> {card.serviceRating}
        </p>
      )}
    </div>
  );
};

export default FoodCardDetails;


import { Star } from "lucide-react";

interface CardRatingProps {
  rating: number;
  size?: number;
  className?: string;
}

export const CardRating = ({ rating, size = 16, className = "" }: CardRatingProps) => {
  return (
    <div className={`flex ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star 
          key={i} 
          size={size} 
          className={i < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} 
        />
      ))}
    </div>
  );
};

export default CardRating;


import { Heart } from "lucide-react";
import { useState } from "react";
import { updateCard } from "@/lib/data";
import { CatalogCard } from "@/lib/types";

interface FavoriteButtonProps {
  card: CatalogCard;
  initialState?: boolean;
}

const FavoriteButton = ({ card, initialState }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(initialState || card.isFavorite || false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const updatedCard = {
      ...card,
      isFavorite: !isFavorite
    };
    
    updateCard(updatedCard);
    setIsFavorite(!isFavorite);
  };

  return (
    <button 
      onClick={toggleFavorite}
      className="text-red-500 hover:scale-110 transition-transform"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart 
        size={20} 
        className={isFavorite ? "fill-red-500" : ""} 
      />
    </button>
  );
};

export default FavoriteButton;


import { CatalogCard as CatalogCardType, FoodCard, EntertainmentCard } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Edit, Send, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface CatalogCardProps {
  card: CatalogCardType;
  showActions?: boolean;
}

const CatalogCard = ({ card, showActions = true }: CatalogCardProps) => {
  const isFoodCard = card.type === 'food';
  const foodCard = card as FoodCard;
  const entertainmentCard = card as EntertainmentCard;

  return (
    <div 
      className={cn(
        "catalog-card relative",
        isFoodCard ? "catalog-card-food" : "catalog-card-entertainment"
      )}
    >
      <div className="mb-2 border-b border-catalog-softBrown pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.creator}</p>
          </div>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                className={i < card.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} 
              />
            ))}
          </div>
        </div>
        <div className="catalog-line"></div>
      </div>
      
      <div className="mb-4 space-y-2 text-sm">
        {isFoodCard ? (
          <>
            <p><span className="font-bold">Cuisine:</span> {foodCard.cuisine}</p>
            <p><span className="font-bold">Location:</span> {foodCard.location}</p>
            <p><span className="font-bold">Category:</span> {foodCard.category}</p>
          </>
        ) : (
          <>
            <p><span className="font-bold">Genre:</span> {entertainmentCard.genre}</p>
            <p><span className="font-bold">Medium:</span> {entertainmentCard.medium}</p>
            <p><span className="font-bold">Category:</span> {entertainmentCard.entertainmentCategory}</p>
          </>
        )}
        <p><span className="font-bold">Date Experienced:</span> {new Date(card.date).toLocaleDateString()}</p>
        {card.recommendedBy && (
          <p><span className="font-bold">Recommended by:</span> {card.recommendedBy}</p>
        )}
      </div>
      
      <div className="mb-4 bg-white bg-opacity-50 p-2 rounded border border-catalog-softBrown">
        <p className="text-sm italic whitespace-pre-line">{card.notes}</p>
      </div>
      
      {(isFoodCard && foodCard.tags && foodCard.tags.length > 0) || 
       (!isFoodCard && entertainmentCard.tags && entertainmentCard.tags.length > 0) ? (
        <div className="mb-4">
          <p className="text-xs font-bold mb-1">Tags:</p>
          <div className="flex flex-wrap gap-1">
            {isFoodCard && foodCard.tags ? 
              foodCard.tags.map((tag, index) => (
                <span key={index} className="text-xs bg-catalog-softBrown/30 px-2 py-1 rounded-full">
                  {tag}
                </span>
              )) :
              entertainmentCard.tags && entertainmentCard.tags.map((tag, index) => (
                <span key={index} className="text-xs bg-catalog-softBrown/30 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))
            }
          </div>
        </div>
      ) : null}
      
      {showActions && (
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white border-catalog-softBrown text-catalog-teal"
            asChild
          >
            <Link to={`/edit/${card.id}`}>
              <Edit size={16} className="mr-2" />
              Edit
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white border-catalog-softBrown text-catalog-teal"
            asChild
          >
            <Link to={`/recommend/${card.id}`}>
              <Send size={16} className="mr-2" />
              Recommend
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CatalogCard;

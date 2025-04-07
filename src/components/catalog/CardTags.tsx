
import { CatalogCard, FoodCard, EntertainmentCard } from "@/lib/types";

interface CardTagsProps {
  card: CatalogCard;
  isFoodCard: boolean;
}

const CardTags = ({ card, isFoodCard }: CardTagsProps) => {
  const tags = isFoodCard 
    ? (card as FoodCard).tags 
    : (card as EntertainmentCard).tags;
  
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className="mb-4">
      <p className="text-xs font-bold mb-1">Tags:</p>
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, index) => (
          <span key={index} className="text-xs bg-catalog-softBrown/30 px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CardTags;

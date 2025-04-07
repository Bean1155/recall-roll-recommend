
import { CatalogCard } from "@/lib/types";
import CardRating from "./CardRating";
import FavoriteButton from "./FavoriteButton";

interface CardHeaderProps {
  card: CatalogCard;
}

const CardHeader = ({ card }: CardHeaderProps) => {
  return (
    <div className="mb-2 border-b border-catalog-softBrown pb-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{card.title}</h3>
          <p className="text-sm text-muted-foreground">{card.creator}</p>
        </div>
        <div className="flex items-center gap-2">
          <FavoriteButton card={card} />
          <CardRating rating={card.rating} />
        </div>
      </div>
      <div className="catalog-line"></div>
    </div>
  );
};

export default CardHeader;

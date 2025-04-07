
import { CatalogCard as CatalogCardType, FoodCard } from "@/lib/types";
import CardHeader from "./catalog/CardHeader";
import FoodCardDetails from "./catalog/FoodCardDetails";
import EntertainmentCardDetails from "./catalog/EntertainmentCardDetails";
import CommonCardDetails from "./catalog/CommonCardDetails";
import CardNotes from "./catalog/CardNotes";
import UserFeedback from "./catalog/UserFeedback";
import CardTags from "./catalog/CardTags";
import CardActions from "./catalog/CardActions";

interface CatalogCardProps {
  card: CatalogCardType;
  showActions?: boolean;
}

const CatalogCard = ({ card, showActions = true }: CatalogCardProps) => {
  const isFoodCard = card.type === 'food';
  
  return (
    <div 
      className={`catalog-card relative ${
        isFoodCard ? "catalog-card-food" : "catalog-card-entertainment"
      }`}
    >
      <CardHeader card={card} />
      
      <div className="mb-4 space-y-2 text-sm">
        {isFoodCard ? (
          <FoodCardDetails card={card as FoodCard} />
        ) : (
          <EntertainmentCardDetails card={card as any} />
        )}
        <CommonCardDetails card={card} />
      </div>
      
      <CardNotes notes={card.notes} />
      <UserFeedback userNotes={card.userNotes} />
      <CardTags card={card} isFoodCard={isFoodCard} />
      <CardActions card={card} showActions={showActions} />
    </div>
  );
};

export default CatalogCard;

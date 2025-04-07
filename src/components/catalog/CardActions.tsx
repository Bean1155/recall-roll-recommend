
import { CatalogCard } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Edit, Send } from "lucide-react";

interface CardActionsProps {
  card: CatalogCard;
  showActions?: boolean;
}

const CardActions = ({ card, showActions = true }: CardActionsProps) => {
  if (!showActions) return null;

  return (
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
  );
};

export default CardActions;

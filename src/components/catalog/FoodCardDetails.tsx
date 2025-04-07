
import { FoodCard } from "@/lib/types";
import { Utensils, MapPin, Tag } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FoodCardDetailsProps {
  card: FoodCard;
}

const FoodCardDetails = ({ card }: FoodCardDetailsProps) => {
  return (
    <TooltipProvider>
      <p className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center text-catalog-teal">
              <Utensils size={16} className="mr-1" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Cuisine Type</p>
          </TooltipContent>
        </Tooltip>
        <span className="font-bold">Cuisine:</span> {card.cuisine}
      </p>
      <p className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center text-catalog-teal">
              <MapPin size={16} className="mr-1" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Location</p>
          </TooltipContent>
        </Tooltip>
        <span className="font-bold">Location:</span> {card.location}
      </p>
      <p className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center text-catalog-teal">
              <Tag size={16} className="mr-1" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Category</p>
          </TooltipContent>
        </Tooltip>
        <span className="font-bold">Category:</span> {card.category}
      </p>
    </TooltipProvider>
  );
};

export default FoodCardDetails;


import { EntertainmentCard } from "@/lib/types";
import { Award, Tag, Film, Tv, Headphones } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface EntertainmentCardDetailsProps {
  card: EntertainmentCard;
}

const EntertainmentCardDetails = ({ card }: EntertainmentCardDetailsProps) => {
  return (
    <TooltipProvider>
      <p className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center text-catalog-teal">
              <Award size={16} className="mr-1" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Genre</p>
          </TooltipContent>
        </Tooltip>
        <span className="font-bold">Genre:</span> {card.genre}
      </p>
      <p className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center text-catalog-teal">
              {card.medium.toLowerCase().includes('tv') ? (
                <Tv size={16} className="mr-1" />
              ) : card.medium.toLowerCase().includes('podcast') ? (
                <Headphones size={16} className="mr-1" />
              ) : (
                <Film size={16} className="mr-1" />
              )}
            </span>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Medium</p>
          </TooltipContent>
        </Tooltip>
        <span className="font-bold">Medium:</span> {card.medium}
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
        <span className="font-bold">Category:</span> {card.entertainmentCategory}
      </p>
    </TooltipProvider>
  );
};

export default EntertainmentCardDetails;

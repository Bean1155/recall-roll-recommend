
import { CatalogCard } from "@/lib/types";
import { Calendar, User, Users } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { appUsers } from "@/contexts/UserContext";

interface CommonCardDetailsProps {
  card: CatalogCard;
}

const CommonCardDetails = ({ card }: CommonCardDetailsProps) => {
  // Get user names for recommended users
  const recommendedToUsers = card.recommendedTo?.map(userId => {
    const user = appUsers.find(u => u.id === userId);
    return user?.name || userId;
  }) || [];

  return (
    <TooltipProvider>
      <p className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center text-catalog-teal">
              <Calendar size={16} className="mr-1" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Date Experienced</p>
          </TooltipContent>
        </Tooltip>
        <span className="font-bold">Date Experienced:</span> {new Date(card.date).toLocaleDateString()}
      </p>
      {card.recommendedBy && (
        <p className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex items-center text-catalog-teal">
                <User size={16} className="mr-1" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Recommended by</p>
            </TooltipContent>
          </Tooltip>
          <span className="font-bold">Recommended by:</span> {card.recommendedBy}
        </p>
      )}
      {card.recommendedTo && card.recommendedTo.length > 0 && (
        <p className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex items-center text-catalog-teal">
                <Users size={16} className="mr-1" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Recommended to</p>
            </TooltipContent>
          </Tooltip>
          <span className="font-bold">Recommended to:</span> {recommendedToUsers.join(', ')}
        </p>
      )}
      {card.url && (
        <p className="flex items-center gap-2">
          <span className="font-bold">URL:</span> 
          <a 
            href={card.url.startsWith('http') ? card.url : `https://${card.url}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {card.url}
          </a>
        </p>
      )}
    </TooltipProvider>
  );
};

export default CommonCardDetails;

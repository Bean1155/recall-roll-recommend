
import { CatalogCard as CatalogCardType, FoodCard, EntertainmentCard } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Edit, Send, Star, MessageSquare, Heart, Utensils, MapPin, Tag, Calendar, User, Film, Tv, Headphones, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { updateCard } from "@/lib/data";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CatalogCardProps {
  card: CatalogCardType;
  showActions?: boolean;
}

const CatalogCard = ({ card, showActions = true }: CatalogCardProps) => {
  const isFoodCard = card.type === 'food';
  const foodCard = card as FoodCard;
  const entertainmentCard = card as EntertainmentCard;
  const hasUserNotes = card.userNotes && card.userNotes.length > 0;
  const [isFavorite, setIsFavorite] = useState(card.isFavorite || false);

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
          <div className="flex items-center gap-2">
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
        </div>
        <div className="catalog-line"></div>
      </div>
      
      <div className="mb-4 space-y-2 text-sm">
        {isFoodCard ? (
          <>
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
                <span className="font-bold">Cuisine:</span> {foodCard.cuisine}
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
                <span className="font-bold">Location:</span> {foodCard.location}
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
                <span className="font-bold">Category:</span> {foodCard.category}
              </p>
            </TooltipProvider>
          </>
        ) : (
          <>
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
                <span className="font-bold">Genre:</span> {entertainmentCard.genre}
              </p>
              <p className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center text-catalog-teal">
                      {entertainmentCard.medium.toLowerCase().includes('tv') ? (
                        <Tv size={16} className="mr-1" />
                      ) : entertainmentCard.medium.toLowerCase().includes('podcast') ? (
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
                <span className="font-bold">Medium:</span> {entertainmentCard.medium}
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
                <span className="font-bold">Category:</span> {entertainmentCard.entertainmentCategory}
              </p>
            </TooltipProvider>
          </>
        )}
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
        </TooltipProvider>
      </div>
      
      <div className="mb-4 bg-white bg-opacity-50 p-2 rounded border border-catalog-softBrown">
        <p className="text-sm italic whitespace-pre-line">{card.notes}</p>
      </div>
      
      {hasUserNotes && (
        <div className="mb-4 p-2 bg-blue-50 rounded border border-blue-200">
          <div className="flex items-center gap-1 mb-2">
            <MessageSquare size={14} className="text-blue-600" />
            <h4 className="text-sm font-medium text-blue-800">User Notes</h4>
          </div>
          <div className="space-y-2">
            {card.userNotes?.map((note, index) => (
              <div key={index} className="p-2 bg-white rounded text-xs">
                <div className="font-medium text-blue-700">
                  {note.userId}
                </div>
                <p className="whitespace-pre-line mt-1">{note.notes}</p>
                <div className="text-gray-500 text-[10px] mt-1">
                  {new Date(note.date).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
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

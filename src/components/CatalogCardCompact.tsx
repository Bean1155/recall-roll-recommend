
import React from "react";
import { CatalogCard as CatalogCardType } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface CatalogCardCompactProps {
  card: CatalogCardType;
  onClick?: (card: CatalogCardType) => void;
  compact?: boolean; // Prop for letterboxd-style compact cards
}

const CatalogCardCompact = ({ card, onClick, compact = false }: CatalogCardCompactProps) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    console.log("CatalogCardCompact: Card clicked:", card.id, card.title);
    
    if (onClick) {
      console.log("CatalogCardCompact: Using provided onClick handler");
      onClick(card);
      return;
    }
    
    // Navigate to the appropriate page with highlight parameter
    console.log("CatalogCardCompact: Navigating to card page with highlight parameter");
    if (card.type === 'food') {
      // Make sure we use the correct parameter that will be processed by useCardDetailHandling
      navigate(`/bites?highlight=${card.id}`);
    } else {
      navigate(`/blockbusters?highlight=${card.id}`);
    }
  };

  // Generate a soft pastel background color based on the card id for consistency
  const generateBackgroundColor = (id: string) => {
    const colors = [
      'bg-pink-100', 'bg-purple-100', 'bg-blue-100', 'bg-green-100',
      'bg-yellow-100', 'bg-orange-100', 'bg-red-100', 'bg-indigo-100'
    ];
    
    // Simple hash function to get a consistent index
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Generate background color based on the card's id
  const bgColorClass = generateBackgroundColor(card.id);

  // Truncate title if it's too long
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  // Check for image URL based on card type
  const hasImage = card.type === 'food' ? 
    'url' in card && Boolean(card.url) : 
    'url' in card && Boolean(card.url);
  
  // Get image URL safely
  const getImageUrl = () => {
    if (card.type === 'food' && 'url' in card) {
      return card.url;
    } else if (card.type === 'entertainment' && 'url' in card) {
      return card.url;
    }
    return null;
  };
  
  const imageUrl = getImageUrl();
  
  // Use different styles based on compact mode
  if (compact) {
    return (
      <div 
        className="cursor-pointer rounded overflow-hidden shadow-sm hover:shadow-md transition-all h-full"
        onClick={handleCardClick}
      >
        <div className={cn("relative aspect-[2/3] flex items-center justify-center", bgColorClass)}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={card.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-xs font-semibold text-gray-600 p-1 text-center">
              {truncateText(card.title, 15)}
            </div>
          )}
          
          {card.isFavorite && (
            <div className="absolute top-1 right-1">
              <Heart className="h-3 w-3 fill-red-500 text-red-500" />
            </div>
          )}
          
          {card.rating && card.rating > 0 && (
            <div className="absolute bottom-1 left-1 flex items-center">
              {Array.from({ length: Math.min(card.rating, 3) }).map((_, i) => (
                <Star key={i} className="h-2 w-2 fill-amber-400 text-amber-400" />
              ))}
              {card.rating > 3 && (
                <span className="text-[8px] text-amber-400">+{card.rating - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Regular non-compact card (original design)
  return (
    <Card 
      className={cn(
        "overflow-hidden cursor-pointer transition-all hover:shadow-md",
        "border border-gray-200 rounded-lg h-full"
      )}
      onClick={handleCardClick}
    >
      <div className={cn("relative h-32 flex items-center justify-center", bgColorClass)}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={card.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-lg font-semibold text-gray-600">
            {truncateText(card.title, 20)}
          </div>
        )}
        
        {card.isFavorite && (
          <div className="absolute top-2 right-2">
            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <div className="font-medium text-sm line-clamp-1">{card.title}</div>
        {card.rating && card.rating > 0 && (
          <div className="flex items-center mt-1">
            {Array.from({ length: card.rating }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CatalogCardCompact;

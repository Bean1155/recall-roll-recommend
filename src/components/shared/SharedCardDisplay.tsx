
import React from 'react';
import { CatalogCard, FoodCard, EntertainmentCard } from '@/lib/types';
import CatalogCardComponent from '@/components/CatalogCard';
import Envelope from '@/components/Envelope';

interface SharedCardDisplayProps {
  card: CatalogCard;
  type: 'food' | 'entertainment';
  categoryColor: string;
  onCardClick?: (card: CatalogCard) => void;
}

const SharedCardDisplay: React.FC<SharedCardDisplayProps> = ({
  card,
  type,
  categoryColor,
  onCardClick,
}) => {
  const handleClick = () => {
    if (onCardClick) {
      onCardClick(card);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer transition-transform hover:scale-[1.02]"
    >
      <Envelope 
        label={card.title} 
        backgroundColor={categoryColor}
      >
        <CatalogCardComponent card={card} />
      </Envelope>
    </div>
  );
};

export default SharedCardDisplay;

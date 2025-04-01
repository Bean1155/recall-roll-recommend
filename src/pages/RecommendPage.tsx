
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CatalogCard from "@/components/CatalogCard";
import RecommendForm from "@/components/RecommendForm";
import { CatalogCard as CatalogCardType } from "@/lib/types";
import { getCardById } from "@/lib/data";
import GridLayout from "@/components/GridLayout";
import { Badge } from "@/components/ui/badge";

const RecommendPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<CatalogCardType | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundCard = getCardById(id);
      if (foundCard) {
        setCard(foundCard);
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);
  
  if (!card) {
    return <div>Loading...</div>;
  }
  
  const title = (
    <div className="flex items-center gap-2">
      <span>{`Recommend This ${card.type === 'food' ? 'Food' : 'Entertainment'}`}</span>
      {card.recommendationBadge && (
        <Badge 
          className={card.recommendationBadge === 'Highly Recommend' 
            ? 'bg-catalog-teal' 
            : 'bg-catalog-pink text-black'
          }
        >
          {card.recommendationBadge}
        </Badge>
      )}
    </div>
  );
  
  return (
    <GridLayout title={title}>
      <div className="max-w-md mx-auto mb-8">
        <CatalogCard card={card} showActions={false} />
      </div>
      
      <RecommendForm card={card} />
    </GridLayout>
  );
};

export default RecommendPage;

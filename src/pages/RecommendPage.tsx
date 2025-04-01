
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CatalogCard from "@/components/CatalogCard";
import RecommendForm from "@/components/RecommendForm";
import { CatalogCard as CatalogCardType } from "@/lib/types";
import { getCardById } from "@/lib/data";
import GridLayout from "@/components/GridLayout";
import { Badge } from "@/components/ui/badge";
import ShareOptions from "@/components/ShareOptions";

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
  
  return (
    <GridLayout title={`Share This ${card.type === 'food' ? 'Food' : 'Entertainment'}`}>
      <div className="max-w-md mx-auto mb-8">
        <CatalogCard card={card} showActions={false} />
        
        <div className="flex justify-center mt-4">
          <ShareOptions 
            card={card} 
            mode="external" 
            variant="dialog"
            buttonClassName="w-full justify-center bg-catalog-teal hover:bg-catalog-darkTeal text-white"
          />
        </div>
        
        {/* Render the badge separately if needed */}
        {card.recommendationBadge && (
          <div className="flex justify-center mt-4">
            <Badge 
              className={card.recommendationBadge === 'Highly Recommend' 
                ? 'bg-catalog-teal' 
                : 'bg-catalog-pink text-black'
              }
            >
              {card.recommendationBadge}
            </Badge>
          </div>
        )}
      </div>
      
      <RecommendForm card={card} />
    </GridLayout>
  );
};

export default RecommendPage;

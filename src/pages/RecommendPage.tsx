
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CatalogCard from "@/components/CatalogCard";
import RecommendForm from "@/components/RecommendForm";
import { CatalogCard as CatalogCardType } from "@/lib/types";
import { getCardById } from "@/lib/data";
import GridLayout from "@/components/GridLayout";

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
  
  const title = `Recommend This ${card.type === 'food' ? 'Food' : 'Entertainment'}`;
  
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

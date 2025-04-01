
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import CardForm from "@/components/CardForm";
import { getCardById } from "@/lib/data";
import GridLayout from "@/components/GridLayout";

const EditCardPage = () => {
  const { id } = useParams<{ id: string }>();
  const [notFound, setNotFound] = useState(false);
  const [cardType, setCardType] = useState<'food' | 'entertainment' | null>(null);
  
  useEffect(() => {
    if (id) {
      const card = getCardById(id);
      if (card) {
        setCardType(card.type as 'food' | 'entertainment');
      } else {
        setNotFound(true);
      }
    }
  }, [id]);
  
  if (notFound) {
    return <Navigate to="/not-found" />;
  }
  
  if (!cardType) {
    return <div>Loading...</div>;
  }
  
  const title = cardType === 'food' ? 'Edit Bite' : 'Edit Blockbuster';
  
  return (
    <GridLayout title={title}>
      <CardForm type={cardType} cardId={id} />
    </GridLayout>
  );
};

export default EditCardPage;

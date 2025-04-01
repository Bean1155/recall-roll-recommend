
import { useParams } from "react-router-dom";
import CardForm from "@/components/CardForm";
import { CardType } from "@/lib/types";
import GridLayout from "@/components/GridLayout";

const CreateCardPage = () => {
  const { type } = useParams<{ type: string }>();
  const cardType = (type === 'food' || type === 'entertainment') ? type : 'food';
  
  const title = cardType === 'food' ? 'Add Bite' : 'Add Blockbuster';
  
  return (
    <GridLayout title={title}>
      <CardForm type={cardType as CardType} />
    </GridLayout>
  );
};

export default CreateCardPage;

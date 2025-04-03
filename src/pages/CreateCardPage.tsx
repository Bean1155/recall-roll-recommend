
import { useParams, useNavigate } from "react-router-dom";
import CardForm from "@/components/CardForm";
import { CardType } from "@/lib/types";
import GridLayout from "@/components/GridLayout";
import { useEffect } from "react";
import { forceRewardsRefresh } from "@/utils/rewardUtils";

const CreateCardPage = () => {
  const { type } = useParams<{ type: string }>();
  const cardType = (type === 'food' || type === 'entertainment') ? type : 'food';
  const navigate = useNavigate();
  
  const title = cardType === 'food' ? 'Add Bite' : 'Add Blockbuster';
  
  // Force a rewards refresh when this page is loaded
  useEffect(() => {
    // Ensure rewards are up to date
    forceRewardsRefresh();
  }, []);
  
  return (
    <GridLayout title={title}>
      <CardForm type={cardType as CardType} />
    </GridLayout>
  );
};

export default CreateCardPage;

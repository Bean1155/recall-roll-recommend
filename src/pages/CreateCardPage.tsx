
import { useParams, useNavigate } from "react-router-dom";
import CardForm from "@/components/CardForm";
import { CardType } from "@/lib/types";
import GridLayout from "@/components/GridLayout";
import { useEffect } from "react";
import { forceRewardsRefresh } from "@/utils/rewardUtils";
import { useUser } from "@/contexts/UserContext";

const CreateCardPage = () => {
  const { type } = useParams<{ type: string }>();
  const cardType = (type === 'food' || type === 'entertainment') ? type : 'food';
  const navigate = useNavigate();
  const { currentUser } = useUser();
  
  const title = cardType === 'food' ? 'Add Bite' : 'Add Blockbuster';
  
  // Force a rewards refresh when this page is loaded
  useEffect(() => {
    // Ensure rewards are up to date
    forceRewardsRefresh();
  }, []);
  
  // Force rewards refresh when navigating away to catch any new points
  useEffect(() => {
    return () => {
      console.log("CreateCardPage: Unmounting, forcing rewards refresh");
      if (currentUser) {
        // Small delay to ensure the card is saved first
        setTimeout(() => forceRewardsRefresh(), 300);
      }
    };
  }, [currentUser]);
  
  return (
    <GridLayout title={title}>
      <CardForm type={cardType as CardType} />
    </GridLayout>
  );
};

export default CreateCardPage;

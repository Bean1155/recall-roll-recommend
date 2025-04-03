
import { useParams, useNavigate } from "react-router-dom";
import CardForm from "@/components/CardForm";
import { CardType } from "@/lib/types";
import GridLayout from "@/components/GridLayout";
import { useEffect, useRef } from "react";
import { forceRewardsRefresh } from "@/utils/rewardUtils";
import { useUser } from "@/contexts/UserContext";

const CreateCardPage = () => {
  const { type } = useParams<{ type: string }>();
  const cardType = (type === 'food' || type === 'entertainment') ? type : 'food';
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const hasInitializedRef = useRef(false);
  
  const title = cardType === 'food' ? 'Add Bite' : 'Add Blockbuster';
  
  // Force a rewards refresh when this page is loaded
  useEffect(() => {
    console.log("CreateCardPage: Component mounted, forcing rewards refresh");
    
    // Multiple refreshes to ensure it's caught
    const delays = [0, 500, 1000, 2000];
    
    delays.forEach(delay => {
      setTimeout(() => {
        forceRewardsRefresh();
        console.log(`CreateCardPage: Forced refresh with delay ${delay}ms`);
      }, delay);
    });
    
    hasInitializedRef.current = true;
  }, []);
  
  // Force rewards refresh when navigating away to catch any new points
  useEffect(() => {
    return () => {
      console.log("CreateCardPage: Unmounting, forcing rewards refresh");
      if (currentUser) {
        // Force multiple refreshes with increasing delays
        for (let i = 0; i < 5; i++) {
          const delay = 300 * i;
          setTimeout(() => {
            console.log(`CreateCardPage: Unmount refresh attempt ${i+1} with ${delay}ms delay`);
            forceRewardsRefresh();
          }, delay);
        }
      }
    };
  }, [currentUser]);
  
  // Periodic refresh while on this page
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (hasInitializedRef.current && currentUser) {
        console.log("CreateCardPage: Periodic refresh");
        forceRewardsRefresh();
      }
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [currentUser]);
  
  return (
    <GridLayout title={title}>
      <CardForm type={cardType as CardType} />
    </GridLayout>
  );
};

export default CreateCardPage;

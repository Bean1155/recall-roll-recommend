
import { useParams, useNavigate } from "react-router-dom";
import CardForm from "@/components/CardForm";
import { CardType } from "@/lib/types";
import GridLayout from "@/components/GridLayout";
import { useEffect, useRef, useCallback } from "react";
import { forceRewardsRefresh } from "@/utils/rewardUtils";
import { useUser } from "@/contexts/UserContext";

const CreateCardPage = () => {
  const { type } = useParams<{ type: string }>();
  const cardType = (type === 'food' || type === 'entertainment') ? type : 'food';
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const hasInitializedRef = useRef(false);
  const rewardRefreshIntervalRef = useRef<number | null>(null);
  
  const title = cardType === 'food' ? 'Add Bite' : 'Add Blockbuster';
  
  // Function to force refresh rewards
  const refreshRewards = useCallback(() => {
    if (currentUser) {
      console.log("CreateCardPage: Manually forcing rewards refresh");
      forceRewardsRefresh();
    }
  }, [currentUser]);
  
  // Force a rewards refresh when this page is loaded
  useEffect(() => {
    console.log("CreateCardPage: Component mounted, forcing rewards refresh");
    
    // Multiple refreshes to ensure it's caught
    const delays = [0, 200, 500, 1000, 2000];
    
    delays.forEach(delay => {
      setTimeout(() => {
        forceRewardsRefresh();
        console.log(`CreateCardPage: Forced refresh with delay ${delay}ms`);
      }, delay);
    });
    
    // Set up a regular interval to keep checking for rewards
    if (currentUser && !rewardRefreshIntervalRef.current) {
      rewardRefreshIntervalRef.current = window.setInterval(() => {
        console.log("CreateCardPage: Interval refresh");
        forceRewardsRefresh();
      }, 1500);
    }
    
    hasInitializedRef.current = true;
    
    return () => {
      if (rewardRefreshIntervalRef.current) {
        clearInterval(rewardRefreshIntervalRef.current);
        rewardRefreshIntervalRef.current = null;
      }
    };
  }, [currentUser]);
  
  // Add a message event listener to catch CardForm submissions
  useEffect(() => {
    const handleCardSubmit = (event: Event) => {
      if ((event as CustomEvent).detail?.action === 'card_added') {
        console.log("CreateCardPage: Card submission event detected, refreshing rewards");
        
        // Give the data.ts function time to complete adding the rewards
        setTimeout(() => {
          for (let i = 0; i < 10; i++) {
            setTimeout(() => {
              forceRewardsRefresh();
              console.log(`CreateCardPage: Post-submission refresh attempt ${i+1}`);
            }, i * 300);
          }
        }, 200);
      }
    };
    
    window.addEventListener('catalog_action', handleCardSubmit);
    
    return () => {
      window.removeEventListener('catalog_action', handleCardSubmit);
    };
  }, []);
  
  // Force rewards refresh when navigating away to catch any new points
  useEffect(() => {
    return () => {
      console.log("CreateCardPage: Unmounting, forcing rewards refresh");
      if (currentUser) {
        // Force multiple refreshes with increasing delays
        for (let i = 0; i < 10; i++) {
          const delay = 200 * i;
          setTimeout(() => {
            console.log(`CreateCardPage: Unmount refresh attempt ${i+1} with ${delay}ms delay`);
            forceRewardsRefresh();
          }, delay);
        }
      }
    };
  }, [currentUser]);
  
  // Manual refresh button handler - for debugging
  const handleManualRefresh = () => {
    console.log("CreateCardPage: Manual refresh triggered");
    refreshRewards();
  };

  const handleFormSubmitSuccess = () => {
    console.log("CreateCardPage: CardForm submission success callback");
    // Trigger rewards refresh
    setTimeout(() => {
      const event = new CustomEvent('catalog_action', { 
        detail: { action: 'card_added', cardType } 
      });
      window.dispatchEvent(event);
    }, 100);
  };
  
  return (
    <GridLayout title={title}>
      <CardForm 
        type={cardType as CardType} 
        onSubmitSuccess={handleFormSubmitSuccess}
      />
      
      {/* Extra debug button removed from production
      <button 
        onClick={handleManualRefresh}
        className="mt-4 bg-gray-200 p-2 rounded text-sm"
      >
        Refresh Rewards (Debug)
      </button>
      */}
    </GridLayout>
  );
};

export default CreateCardPage;

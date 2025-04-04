
import { useParams, useNavigate } from "react-router-dom";
import CardForm from "@/components/CardForm";
import { CardType } from "@/lib/types";
import GridLayout from "@/components/GridLayout";
import { useEffect, useRef, useCallback } from "react";
import { forceRewardsRefresh, showRewardToast } from "@/utils/rewardUtils";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";

const CreateCardPage = () => {
  const { type } = useParams<{ type: string }>();
  const cardType = (type === 'food' || type === 'entertainment') ? type : 'food';
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const hasInitializedRef = useRef(false);
  const rewardRefreshIntervalRef = useRef<number | null>(null);
  const pointsCheckedRef = useRef(0);
  
  const title = cardType === 'food' ? 'Add Bite' : 'Add Blockbuster';
  
  // Function to force refresh rewards
  const refreshRewards = useCallback(() => {
    if (currentUser) {
      console.log("CreateCardPage: Manually forcing rewards refresh");
      forceRewardsRefresh();
      
      // CRITICAL ADDITION: Dispatch an event specifically for the rewards page
      try {
        const event = new CustomEvent('card_reward_update', { 
          detail: { timestamp: Date.now(), source: 'CreateCardPage', forced: true } 
        });
        window.dispatchEvent(event);
        console.log("CreateCardPage: Dispatched card_reward_update event");
      } catch (error) {
        console.error("Error dispatching card reward update event:", error);
      }
    }
  }, [currentUser]);
  
  // Periodically check for updated points after a form submission
  useEffect(() => {
    if (!currentUser) return;
    
    // Function to check if points have been updated
    const checkForPointsUpdate = () => {
      try {
        const storageKey = `last_${cardType}_added_${currentUser.id}`;
        const lastAddedTime = localStorage.getItem(storageKey);
        
        if (lastAddedTime) {
          const timeSinceAdded = Date.now() - parseInt(lastAddedTime);
          
          if (timeSinceAdded < 30000) { // Within 30 seconds of adding a card
            console.log(`CreateCardPage: Card was recently added (${timeSinceAdded}ms ago)`);
            
            const rewardsData = localStorage.getItem('catalogUserRewards');
            if (rewardsData) {
              const rewards = JSON.parse(rewardsData);
              const points = rewards[currentUser.id] || 0;
              
              console.log(`CreateCardPage: Current user has ${points} points`);
              pointsCheckedRef.current++;
              
              // After multiple checks, ensure the rewards are updated
              if (pointsCheckedRef.current > 5) {
                const event = new CustomEvent('card_reward_update', { 
                  detail: { timestamp: Date.now(), points, forced: true } 
                });
                window.dispatchEvent(event);
                console.log(`CreateCardPage: Forced card_reward_update after ${pointsCheckedRef.current} checks`);
              }
            }
          }
        }
      } catch (e) {
        console.error("Error checking for points update:", e);
      }
    };
    
    const checkInterval = setInterval(checkForPointsUpdate, 1000);
    
    return () => {
      clearInterval(checkInterval);
    };
  }, [currentUser, cardType]);
  
  // Force a rewards refresh when this page is loaded
  useEffect(() => {
    if (!currentUser) return;
    
    console.log("CreateCardPage: Component mounted, forcing rewards refresh");
    
    // Set the stage for tracking card addition
    const trackingKey = `last_${cardType}_added_${currentUser.id}`;
    localStorage.removeItem(trackingKey);
    
    // Multiple refreshes to ensure it's caught
    const delays = [0, 100, 200, 500, 1000, 2000];
    
    delays.forEach(delay => {
      setTimeout(() => {
        forceRewardsRefresh();
        console.log(`CreateCardPage: Forced refresh with delay ${delay}ms`);
      }, delay);
    });
    
    // Set up a regular interval for this page
    if (!rewardRefreshIntervalRef.current) {
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
  }, [currentUser, cardType]);
  
  // Add a message event listener to catch CardForm submissions
  useEffect(() => {
    const handleCardSubmit = (event: Event) => {
      if ((event as CustomEvent).detail?.action === 'card_added') {
        console.log("CreateCardPage: Card submission event detected, refreshing rewards");
        
        // Mark the time of card addition
        if (currentUser) {
          const trackingKey = `last_${cardType}_added_${currentUser.id}`;
          localStorage.setItem(trackingKey, Date.now().toString());
          console.log(`CreateCardPage: Marked card addition time in ${trackingKey}`);
          
          // Direct toast notification for immediate feedback
          if (typeof showRewardToast === 'function') {
            // Show toast with points for adding a card
            showRewardToast(currentUser.id, 15, `Adding a new ${cardType === 'food' ? 'bite' : 'blockbuster'}`);
          }
        }
        
        // Give the data.ts function time to complete adding the rewards
        setTimeout(() => {
          for (let i = 0; i < 10; i++) {
            setTimeout(() => {
              forceRewardsRefresh();
              
              // Also dispatch the special card reward event
              const event = new CustomEvent('card_reward_update', { 
                detail: { timestamp: Date.now(), forced: true } 
              });
              window.dispatchEvent(event);
              
              console.log(`CreateCardPage: Post-submission refresh attempt ${i+1}`);
            }, i * 150);
          }
        }, 100);
      }
    };
    
    window.addEventListener('catalog_action', handleCardSubmit);
    
    return () => {
      window.removeEventListener('catalog_action', handleCardSubmit);
    };
  }, [currentUser, cardType]);
  
  // Force rewards refresh when navigating away to catch any new points
  useEffect(() => {
    return () => {
      console.log("CreateCardPage: Unmounting, forcing rewards refresh");
      if (currentUser) {
        // Force multiple refreshes with increasing delays
        for (let i = 0; i < 10; i++) {
          const delay = 100 * i; // Reduced delay for faster feedback
          setTimeout(() => {
            console.log(`CreateCardPage: Unmount refresh attempt ${i+1} with ${delay}ms delay`);
            forceRewardsRefresh();
            
            // Dispatch the special card reward event
            const event = new CustomEvent('card_reward_update', { 
              detail: { timestamp: Date.now(), forced: true } 
            });
            window.dispatchEvent(event);
          }, delay);
        }
      }
    };
  }, [currentUser]);

  const handleFormSubmitSuccess = () => {
    console.log("CreateCardPage: CardForm submission success callback");
    
    // CRITICAL FIX: Create a direct toast notification here for visibility
    if (currentUser) {
      // Show the reward toast immediately
      if (typeof showRewardToast === 'function') {
        // Show toast with points for adding a card
        showRewardToast(currentUser.id, 15, `Adding a new ${cardType === 'food' ? 'bite' : 'blockbuster'}`);
      }
      
      toast({
        title: "Card Created!",
        description: `Your ${cardType === 'food' ? 'bite' : 'blockbuster'} has been added and you earned points!`,
        className: "bg-catalog-cream border-catalog-teal border-4 text-catalog-darkBrown font-medium z-[2000]",
        duration: 5000,
      });
    }
    
    // Mark the time of card addition
    if (currentUser) {
      const trackingKey = `last_${cardType}_added_${currentUser.id}`;
      localStorage.setItem(trackingKey, Date.now().toString());
      console.log(`CreateCardPage: Marked card addition time in ${trackingKey}`);
    }
    
    // Trigger rewards refresh immediately and multiple times
    refreshRewards();
    
    setTimeout(() => {
      const event = new CustomEvent('catalog_action', { 
        detail: { action: 'card_added', cardType } 
      });
      window.dispatchEvent(event);
      
      // Also directly call forceRewardsRefresh for redundancy
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          forceRewardsRefresh();
          console.log(`CreateCardPage: Form success refresh attempt ${i+1}`);
        }, i * 100); // Faster refresh intervals
      }
    }, 50); // Reduced delay for faster feedback
  };
  
  return (
    <GridLayout title={title}>
      <CardForm 
        type={cardType as CardType} 
        onSubmitSuccess={handleFormSubmitSuccess}
      />
    </GridLayout>
  );
};

export default CreateCardPage;

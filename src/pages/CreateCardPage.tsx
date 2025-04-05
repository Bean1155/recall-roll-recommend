import { useParams, useNavigate } from "react-router-dom";
import CardForm from "@/components/CardForm";
import { CardType } from "@/lib/types";
import GridLayout from "@/components/GridLayout";
import { useEffect, useRef, useCallback, useState } from "react";
import { forceRewardsRefresh, showRewardToast, addPointsForCardCreation } from "@/utils/rewardUtils";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

const CreateCardPage = () => {
  const { type } = useParams<{ type: string }>();
  const cardType = (type === 'food' || type === 'entertainment') ? type : 'food';
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const hasInitializedRef = useRef(false);
  const rewardRefreshIntervalRef = useRef<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const title = cardType === 'food' ? 'Add Bite' : 'Add Blockbuster';
  
  // Function to force refresh rewards without excessive calls
  const refreshRewards = useCallback(() => {
    if (currentUser) {
      console.log("CreateCardPage: Manually forcing rewards refresh");
      forceRewardsRefresh();
      
      // Dispatch an event specifically for the rewards page
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
  
  // Force a rewards refresh when this page is loaded
  useEffect(() => {
    if (!currentUser) return;
    
    console.log("CreateCardPage: Component mounted, forcing rewards refresh");
    
    // Set the stage for tracking card addition
    const trackingKey = `last_${cardType}_added_${currentUser.id}`;
    localStorage.removeItem(trackingKey);
    
    // Single refresh is sufficient
    refreshRewards();
    
    // Set up a regular interval for this page with longer timeout
    if (!rewardRefreshIntervalRef.current) {
      rewardRefreshIntervalRef.current = window.setInterval(() => {
        console.log("CreateCardPage: Interval refresh");
        forceRewardsRefresh();
      }, 5000); // Reduced from 1500ms to 5000ms
    }
    
    hasInitializedRef.current = true;
    
    return () => {
      if (rewardRefreshIntervalRef.current) {
        clearInterval(rewardRefreshIntervalRef.current);
        rewardRefreshIntervalRef.current = null;
      }
    };
  }, [currentUser, cardType, refreshRewards]);
  
  // Add a message event listener to catch CardForm submissions
  useEffect(() => {
    const handleCardSubmit = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.action === 'card_added') {
        console.log("CreateCardPage: Card submission event detected, refreshing rewards");
        
        // Mark the time of card addition
        if (currentUser) {
          const trackingKey = `last_${cardType}_added_${currentUser.id}`;
          localStorage.setItem(trackingKey, Date.now().toString());
          console.log(`CreateCardPage: Marked card addition time in ${trackingKey}`);
          
          // Points are only added when the form is submitted, not on search selection
          addPointsForCardCreation(currentUser.id, cardType);
        }
        
        // Single refresh after card addition
        setTimeout(() => {
          forceRewardsRefresh();
          
          // Also dispatch the special card reward event
          const event = new CustomEvent('card_reward_update', { 
            detail: { timestamp: Date.now(), forced: true } 
          });
          window.dispatchEvent(event);
        }, 100);
      }
    };
    
    window.addEventListener('catalog_action', handleCardSubmit);
    
    return () => {
      window.removeEventListener('catalog_action', handleCardSubmit);
    };
  }, [currentUser, cardType]);
  
  // Force rewards refresh when navigating away
  useEffect(() => {
    return () => {
      console.log("CreateCardPage: Unmounting, forcing rewards refresh");
      if (currentUser) {
        forceRewardsRefresh();
      }
    };
  }, [currentUser]);

  // Listen for window blur/focus events to detect when user goes to browser search
  useEffect(() => {
    const handleBlur = () => {
      console.log("User left the page - likely for browser search");
      setIsSearching(true);
    };
    
    const handleFocus = () => {
      console.log("User returned to the page");
      // Keep the button visible for a moment after return
      setTimeout(() => {
        setIsSearching(false);
      }, 3000);
    };
    
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleFormSubmitSuccess = () => {
    console.log("CreateCardPage: CardForm submission success callback");
    
    if (currentUser) {
      // Only add points here when directly submitting the form
      // NOT when using search selection which has its own reward mechanism
      addPointsForCardCreation(currentUser.id, cardType);
      
      toast({
        title: "Card Created!",
        description: `Your ${cardType === 'food' ? 'bite' : 'blockbuster'} has been added and you earned points!`,
        className: "bg-catalog-cream border-catalog-teal border-4 text-catalog-darkBrown font-medium z-[2000]",
        duration: 5000,
      });
    }
    
    // Dispatch a single event
    setTimeout(() => {
      const event = new CustomEvent('catalog_action', { 
        detail: { action: 'card_added', cardType } 
      });
      window.dispatchEvent(event);
    }, 50);
  };
  
  return (
    <GridLayout title={title}>
      <CardForm 
        type={cardType as CardType} 
        onSubmitSuccess={handleFormSubmitSuccess}
      />
      
      {/* Floating button that appears when user is searching in browser */}
      {isSearching && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[1000] animate-bounce">
          <button
            onClick={() => setIsSearching(false)}
            className="flex items-center gap-2 bg-catalog-teal text-white px-4 py-3 rounded-full shadow-lg hover:bg-catalog-teal/90 transition-all"
          >
            <ArrowLeft size={18} />
            <span>Back to {cardType === 'food' ? 'Bite' : 'Blockbuster'} Form</span>
          </button>
        </div>
      )}
    </GridLayout>
  );
};

export default CreateCardPage;

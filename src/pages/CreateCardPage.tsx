
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import CardForm from "@/components/CardForm";
import { CardType } from "@/lib/types";
import GridLayout from "@/components/GridLayout";
import { useEffect, useRef, useState } from "react";
import { forceRewardsRefresh, addPointsForCardCreation } from "@/utils/rewardUtils";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

const CreateCardPage = () => {
  const { type } = useParams<{ type: string }>();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  
  const cardType = (type === 'food' || type === 'entertainment') ? type : 'food';
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [submittedCardId, setSubmittedCardId] = useState<string | null>(null);
  const processingSubmitRef = useRef(false);
  const hasAddedRewardRef = useRef(false);
  
  const title = cardType === 'food' ? 'Add Bite' : 'Add Blockbuster';
  
  // Reset tracking flags when component mounts or card type changes
  useEffect(() => {
    processingSubmitRef.current = false;
    hasAddedRewardRef.current = false;
    setSubmittedCardId(null);

    // Force refresh rewards when component mounts
    if (currentUser) {
      console.log("CreateCardPage: Component mounted, forcing rewards refresh");
      forceRewardsRefresh();
      
      // Add delayed refresh for better reliability
      setTimeout(() => {
        console.log("CreateCardPage: Follow-up rewards refresh");
        forceRewardsRefresh();
      }, 500);
    }

    return () => {
      // Force a final refresh when leaving the page
      if (currentUser) {
        console.log("CreateCardPage: Component unmounting, final refresh");
        forceRewardsRefresh();
      }
    };
  }, [currentUser, cardType]);

  const handleFormSubmitSuccess = (cardId: string) => {
    console.log("CreateCardPage: CardForm submission success callback with ID:", cardId);
    
    // Prevent duplicate processing
    if (processingSubmitRef.current) {
      console.log("CreateCardPage: Already processing submit, ignoring duplicate");
      return;
    }
    
    processingSubmitRef.current = true;
    setSubmittedCardId(cardId);
    
    if (currentUser) {
      // SUPER CRITICAL FIX: Always award points directly without any checks
      console.log(`CreateCardPage: Adding points for ${cardType} card creation to user ${currentUser.id}`);
      
      // Directly add points (most reliable method)
      addPointsForCardCreation(currentUser.id, cardType);
      
      // Set flag for tracking purposes
      hasAddedRewardRef.current = true;
      
      // Show success message to user
      toast.success(`Your ${cardType === 'food' ? 'bite' : 'blockbuster'} has been added and you earned points!`);
      
      // Trigger multiple reward refreshes for maximum reliability
      forceRewardsRefresh();
      setTimeout(() => forceRewardsRefresh(), 300);
      setTimeout(() => forceRewardsRefresh(), 800);
      setTimeout(() => forceRewardsRefresh(), 1500);
      
      // Try adding points again in case first attempt failed
      setTimeout(() => {
        if (currentUser && !hasAddedRewardRef.current) {
          console.log("CreateCardPage: Follow-up attempt to add points");
          addPointsForCardCreation(currentUser.id, cardType);
        }
      }, 500);
    }
    
    // Dispatch a custom event to notify other components
    const event = new CustomEvent('catalog_action', { 
      detail: { action: 'card_added', cardType, cardId } 
    });
    window.dispatchEvent(event);
    console.log("CreateCardPage: Dispatched card_added event", { cardType, cardId });
    
    // Redirect to the appropriate page and open the card detail dialog via URL fragment
    setTimeout(() => {
      // Navigate to the page with a URL fragment that will trigger the card to open
      navigate(cardType === 'food' ? `/bites?open=${cardId}` : `/blockbusters?open=${cardId}`);
      processingSubmitRef.current = false; // Reset the flag
    }, 600);
  };
  
  return (
    <GridLayout title={title}>
      <CardForm 
        type={cardType as CardType} 
        onSubmitSuccess={handleFormSubmitSuccess}
        initialCategory={initialCategory}
      />
    </GridLayout>
  );
};

export default CreateCardPage;

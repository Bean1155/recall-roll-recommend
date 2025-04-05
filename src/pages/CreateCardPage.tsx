
import { useParams, useNavigate } from "react-router-dom";
import CardForm from "@/components/CardForm";
import { CardType } from "@/lib/types";
import GridLayout from "@/components/GridLayout";
import { useEffect, useRef, useState } from "react";
import { forceRewardsRefresh } from "@/utils/rewardUtils";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/components/ui/use-toast";

const CreateCardPage = () => {
  const { type } = useParams<{ type: string }>();
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

    return () => {
      // Force a single refresh when leaving the page
      if (currentUser) {
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
    
    if (currentUser && !hasAddedRewardRef.current) {
      // We'll add reward in the data.ts addCard function instead
      // This avoids duplicate rewards and ensures rewards are only given on save
      hasAddedRewardRef.current = true;
      
      toast({
        title: "Card Created!",
        description: `Your ${cardType === 'food' ? 'bite' : 'blockbuster'} has been added and you earned points!`,
        className: "bg-catalog-cream border-catalog-teal border-4 text-catalog-darkBrown font-medium z-[2000]",
        duration: 5000,
      });
    }
    
    // Dispatch a single event with the cardId
    const event = new CustomEvent('catalog_action', { 
      detail: { action: 'card_added', cardType, cardId } 
    });
    window.dispatchEvent(event);
    
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
      />
    </GridLayout>
  );
};

export default CreateCardPage;

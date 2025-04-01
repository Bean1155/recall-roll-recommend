
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CatalogCard from "@/components/CatalogCard";
import RecommendForm from "@/components/RecommendForm";
import { CatalogCard as CatalogCardType } from "@/lib/types";
import { getCardById, shareCard } from "@/lib/data";
import GridLayout from "@/components/GridLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const RecommendPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<CatalogCardType | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundCard = getCardById(id);
      if (foundCard) {
        setCard(foundCard);
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);
  
  const handleExternalShare = async () => {
    if (!card) return;
    
    try {
      // Pass 'external' mode to indicate sharing externally (limited information)
      await shareCard(card, 'external');
      toast({
        title: "External Share",
        description: "Basic card information has been shared. Note: External users will only see limited information.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to share";
      toast({
        title: "Share failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  
  if (!card) {
    return <div>Loading...</div>;
  }
  
  // Create the title element to render in the UI
  const titleElement = (
    <div className="flex items-center gap-2">
      <span>{`Recommend This ${card.type === 'food' ? 'Food' : 'Entertainment'}`}</span>
      {card.recommendationBadge && (
        <Badge 
          className={card.recommendationBadge === 'Highly Recommend' 
            ? 'bg-catalog-teal' 
            : 'bg-catalog-pink text-black'
          }
        >
          {card.recommendationBadge}
        </Badge>
      )}
    </div>
  );
  
  return (
    <GridLayout title={`Recommend This ${card.type === 'food' ? 'Food' : 'Entertainment'}`}>
      <div className="max-w-md mx-auto mb-8">
        <CatalogCard card={card} showActions={false} />
        
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline"
            className="bg-white border-catalog-softBrown text-catalog-teal"
            onClick={handleExternalShare}
          >
            <Share2 size={16} className="mr-2" />
            Share Externally (Limited Info)
          </Button>
        </div>
      </div>
      
      {/* Render the badge separately if needed */}
      {card.recommendationBadge && (
        <div className="flex justify-center mb-4">
          <Badge 
            className={card.recommendationBadge === 'Highly Recommend' 
              ? 'bg-catalog-teal' 
              : 'bg-catalog-pink text-black'
            }
          >
            {card.recommendationBadge}
          </Badge>
        </div>
      )}
      
      <RecommendForm card={card} />
    </GridLayout>
  );
};

export default RecommendPage;

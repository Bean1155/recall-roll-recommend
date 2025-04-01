
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CatalogCard from "@/components/CatalogCard";
import RecommendForm from "@/components/RecommendForm";
import { CatalogCard as CatalogCardType } from "@/lib/types";
import { getCardById } from "@/lib/data";
import GridLayout from "@/components/GridLayout";
import { Badge } from "@/components/ui/badge";
import ShareOptions from "@/components/ShareOptions";
import UserSelect from "@/components/UserSelect";
import { toast } from "@/components/ui/use-toast";

const RecommendPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<CatalogCardType | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [sharingMode, setSharingMode] = useState<'external' | 'internal'>('external');
  
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
  
  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    setSharingMode('internal');
    toast({
      title: "User Selected",
      description: "You can now share this recommendation with the selected user.",
    });
  };
  
  const handleToggleMode = () => {
    setSharingMode(sharingMode === 'external' ? 'internal' : 'external');
    if (sharingMode === 'internal') {
      setSelectedUserId(null);
    }
  };
  
  if (!card) {
    return <div>Loading...</div>;
  }
  
  return (
    <GridLayout title={`Share This ${card.type === 'food' ? 'Food' : 'Entertainment'}`}>
      <div className="max-w-md mx-auto mb-8">
        <CatalogCard card={card} showActions={false} />
        
        <div className="mt-6 space-y-4">
          <div className="flex gap-2 justify-center">
            <ShareOptions 
              card={card} 
              mode={sharingMode}
              variant="dialog"
              buttonClassName="w-full justify-center bg-catalog-teal hover:bg-catalog-darkTeal text-white"
            />
          </div>
          
          <div className="flex justify-center">
            <Badge 
              className="cursor-pointer hover:opacity-80"
              onClick={handleToggleMode}
            >
              Switch to {sharingMode === 'external' ? 'App User' : 'External'} Sharing
            </Badge>
          </div>
          
          {sharingMode === 'internal' && (
            <div className="mt-4">
              <UserSelect 
                cardId={card.id} 
                onUserSelect={handleUserSelect} 
                selectedUserId={selectedUserId} 
              />
            </div>
          )}
          
          {card.recommendationBadge && (
            <div className="flex justify-center mt-4">
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
        </div>
      </div>
      
      <RecommendForm card={card} />
    </GridLayout>
  );
};

export default RecommendPage;

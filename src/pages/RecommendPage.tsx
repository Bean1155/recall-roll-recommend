
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CatalogCard from "@/components/CatalogCard";
import RecommendForm from "@/components/RecommendForm";
import { CatalogCard as CatalogCardType } from "@/lib/types";
import { getCardById, addUserNotesToCard } from "@/lib/data";
import GridLayout from "@/components/GridLayout";
import { Badge } from "@/components/ui/badge";
import ShareOptions from "@/components/ShareOptions";
import UserSelect from "@/components/UserSelect";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const RecommendPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<CatalogCardType | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [sharingMode, setSharingMode] = useState<'external' | 'internal'>('external');
  const [userNotes, setUserNotes] = useState("");
  const [addNotesToOriginal, setAddNotesToOriginal] = useState(false);
  const { sharingSettings } = useUser();
  
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
  
  const handleAddNotes = () => {
    if (!card || !selectedUserId || !userNotes.trim()) {
      toast({
        title: "Cannot Add Notes",
        description: "Please select a user and add your notes",
        variant: "destructive"
      });
      return;
    }
    
    const success = addUserNotesToCard(
      card.id, 
      selectedUserId, 
      userNotes.trim(), 
      addNotesToOriginal && sharingSettings.allowNoteUpdates
    );
    
    if (success) {
      toast({
        title: "Notes Added",
        description: "Your notes have been added to the original card",
      });
      
      // Refresh the card data
      const updatedCard = getCardById(card.id);
      if (updatedCard) {
        setCard(updatedCard);
      }
      
      setUserNotes("");
    } else if (addNotesToOriginal) {
      toast({
        title: "Cannot Update Original Card",
        description: "The original card creator does not allow note updates",
        variant: "destructive"
      });
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
            <div className="mt-4 space-y-4">
              <UserSelect 
                cardId={card.id} 
                onUserSelect={handleUserSelect} 
                selectedUserId={selectedUserId} 
              />
              
              {selectedUserId && (
                <div className="space-y-3 bg-gray-50 p-4 rounded-md border border-gray-200">
                  <Label htmlFor="user-notes" className="font-medium">
                    Add Your Notes:
                  </Label>
                  <Textarea 
                    id="user-notes"
                    placeholder="Share your thoughts about this recommendation..."
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="add-to-original" 
                      checked={addNotesToOriginal}
                      onCheckedChange={(checked) => setAddNotesToOriginal(checked as boolean)}
                    />
                    <Label 
                      htmlFor="add-to-original" 
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      Add these notes to the original card
                    </Label>
                  </div>
                  
                  <Button 
                    onClick={handleAddNotes}
                    className="w-full bg-catalog-softBrown hover:bg-catalog-softBrown/80"
                  >
                    Add Notes
                  </Button>
                </div>
              )}
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

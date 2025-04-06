
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import CardForm from "@/components/CardForm";
import { getCardById, deleteCard } from "@/lib/data";
import GridLayout from "@/components/GridLayout";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EditCardPage = () => {
  const { id } = useParams<{ id: string }>();
  const [notFound, setNotFound] = useState(false);
  const [cardType, setCardType] = useState<'food' | 'entertainment' | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (id) {
      const card = getCardById(id);
      if (card) {
        setCardType(card.type as 'food' | 'entertainment');
      } else {
        setNotFound(true);
      }
    }
  }, [id]);
  
  const handleDeleteCard = () => {
    if (id) {
      deleteCard(id);
      toast({
        title: "Card Deleted",
        description: `Your ${cardType === 'food' ? 'bite' : 'blockbuster'} has been deleted.`,
      });
      navigate(cardType === 'food' ? '/bites' : '/blockbusters');
    }
  };

  const handleSubmitSuccess = (cardId: string) => {
    toast({
      title: "Card Updated",
      description: `Your ${cardType === 'food' ? 'bite' : 'blockbuster'} has been updated.`,
    });
    navigate(cardType === 'food' ? `/bites?open=${cardId}` : `/blockbusters?open=${cardId}`);
  };
  
  if (notFound) {
    return <Navigate to="/not-found" />;
  }
  
  if (!cardType || !id) {
    return <div>Loading...</div>;
  }
  
  const title = cardType === 'food' ? 'Edit Bite' : 'Edit Blockbuster';
  
  return (
    <GridLayout title={title}>
      <div className="w-full max-w-md mx-auto">
        <CardForm 
          type={cardType} 
          cardId={id} 
          isEdit={true}
          onSubmitSuccess={handleSubmitSuccess}
        />
        
        <div className="flex justify-center mt-8">
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this {cardType === 'food' ? 'bite' : 'blockbuster'}.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteCard}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </GridLayout>
  );
};

export default EditCardPage;

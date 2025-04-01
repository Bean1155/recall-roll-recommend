
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CatalogCard } from "@/lib/types";
import { addRecommendation } from "@/lib/data";
import { toast } from "@/components/ui/use-toast";

interface RecommendFormProps {
  card: CatalogCard;
}

const RecommendForm = ({ card }: RecommendFormProps) => {
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Add recommendation to card
      addRecommendation(card.id, recipient);
      
      toast({
        title: "Recommendation Sent!",
        description: `Your recommendation has been sent to ${recipient}.`,
      });
      
      // In a real app, this would send an email or notification
      
      navigate(card.type === 'food' ? '/bites' : '/blockbusters');
    } catch (error) {
      console.error('Error sending recommendation:', error);
      toast({
        title: "Error",
        description: "There was an error sending your recommendation. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="catalog-card max-w-md mx-auto">
      <div className="space-y-4">
        <div>
          <Label htmlFor="recipient">Recipient's Name</Label>
          <Input
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
            className="catalog-input"
            placeholder="Who are you recommending this to?"
          />
        </div>
        
        <div>
          <Label htmlFor="message">Personal Message (Optional)</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="catalog-input h-20"
            placeholder="Add a personal note about why you're recommending this..."
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            className="bg-white border-catalog-softBrown"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-catalog-teal hover:bg-catalog-darkTeal"
          >
            Send Recommendation
          </Button>
        </div>
      </div>
    </form>
  );
};

export default RecommendForm;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CatalogCard } from "@/lib/types";
import { addRecommendation } from "@/lib/data";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface RecommendFormProps {
  card: CatalogCard;
}

const RecommendForm = ({ card }: RecommendFormProps) => {
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [badge, setBadge] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Add recommendation to card
      addRecommendation(card.id, recipient, badge);
      
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
          <Label htmlFor="badge">Add a Recommendation Badge (Optional)</Label>
          <Select
            value={badge || undefined}
            onValueChange={(value) => setBadge(value || null)}
          >
            <SelectTrigger className="catalog-input">
              <SelectValue placeholder="No badge" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No badge</SelectItem>
              <SelectItem value="Highly Recommend">
                <div className="flex items-center">
                  <Badge className="bg-catalog-teal mr-2">Highly Recommend</Badge>
                  <span>Highly Recommend</span>
                </div>
              </SelectItem>
              <SelectItem value="Favorite">
                <div className="flex items-center">
                  <Badge className="bg-catalog-pink text-black mr-2">Favorite</Badge>
                  <span>Favorite</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
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
        
        {badge && badge !== "none" && (
          <div className="p-3 bg-catalog-cream/50 rounded-md border border-catalog-softBrown">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <div className="flex items-center">
              <Badge 
                className={badge === "Highly Recommend" 
                  ? "bg-catalog-teal mr-2" 
                  : "bg-catalog-pink text-black mr-2"
                }
              >
                {badge}
              </Badge>
              <span className="text-sm">{card.title}</span>
            </div>
          </div>
        )}
        
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

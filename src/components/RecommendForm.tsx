
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CatalogCard } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";

interface RecommendFormProps {
  card: CatalogCard;
}

const RecommendForm = ({ card }: RecommendFormProps) => {
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Thanks for sharing!",
      description: "You can continue exploring recommendations.",
    });
    
    navigate(card.type === 'food' ? '/bites' : '/blockbusters');
  };
  
  return (
    <form onSubmit={handleSubmit} className="catalog-card max-w-md mx-auto">
      <div className="space-y-4">
        <div className="p-3 bg-catalog-cream/50 rounded-md border border-catalog-softBrown">
          <p className="text-sm text-center">
            Use the share options above to recommend this {card.type === 'food' ? 'food' : 'entertainment'} to others!
          </p>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            className="bg-white border-catalog-softBrown"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="bg-catalog-teal hover:bg-catalog-darkTeal"
          >
            Done
          </Button>
        </div>
      </div>
    </form>
  );
};

export default RecommendForm;

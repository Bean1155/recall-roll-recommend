
import { X } from "lucide-react";
import { FoodCard } from "@/lib/types";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog";

interface SearchResultsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  results: FoodCard[];
  categoryColors: Record<string, string>;
  onCardClick: (card: FoodCard) => void;
}

const SearchResultsDialog = ({
  isOpen,
  onOpenChange,
  results,
  categoryColors,
  onCardClick,
}: SearchResultsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
      <DialogContent 
        className="sm:max-w-[700px] p-4 border-2 border-catalog-softBrown rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#f8f8f8" }}
      >
        <DialogTitle className="text-xl font-typewriter text-catalog-teal">
          Search Results
        </DialogTitle>
        <DialogDescription className="text-sm text-catalog-softBrown mb-4">
          We found {results.length} matches. Click on a card to view details.
        </DialogDescription>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
          {results.map((card) => (
            <div 
              key={card.id}
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => onCardClick(card)}
            >
              <Envelope 
                label={card.title}
                backgroundColor={categoryColors[card.category]}
              >
                <CatalogCard card={card} showActions={false} />
              </Envelope>
            </div>
          ))}
        </div>
        
        <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-md hover:bg-gray-100">
          <X size={18} />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default SearchResultsDialog;

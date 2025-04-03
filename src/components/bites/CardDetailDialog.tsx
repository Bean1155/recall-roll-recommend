
import { X } from "lucide-react";
import { FoodCard } from "@/lib/types";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog";

interface CardDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  card: FoodCard | null;
  categoryColors: Record<string, string>;
}

const CardDetailDialog = ({
  isOpen,
  onOpenChange,
  card,
  categoryColors,
}: CardDetailDialogProps) => {
  if (!card) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
      <DialogContent 
        className="sm:max-w-[600px] p-0 border-2 border-catalog-softBrown rounded-xl overflow-hidden max-h-[90vh]"
        style={{ backgroundColor: categoryColors[card.category] }}
      >
        <DialogTitle className="sr-only">Card Details</DialogTitle>
        <div className="relative">
          <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-md hover:bg-gray-100">
            <X size={18} />
          </DialogClose>
          
          <div className="p-6 animate-fade-in">
            <Envelope label={card.title} backgroundColor={categoryColors[card.category]}>
              <CatalogCard card={card} />
            </Envelope>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardDetailDialog;


import { X } from "lucide-react";
import { FoodCard } from "@/lib/types";
import CatalogCard from "@/components/CatalogCard";
import Envelope from "@/components/Envelope";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
  DrawerOverlay,
} from "@/components/ui/drawer";

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
  const isMobile = useIsMobile();
  
  if (!card) return null;
  
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerOverlay className="bg-black/80 backdrop-blur-sm" />
        <DrawerContent 
          className="p-0 border-t-2 border-catalog-softBrown rounded-t-xl overflow-y-auto animate-in slide-in-from-bottom duration-300"
          style={{ 
            backgroundColor: categoryColors[card.category],
            height: "85vh", // Set fixed height for mobile
            maxHeight: "85vh" // Cap max height at 85% of viewport
          }}
        >
          <DrawerTitle className="sr-only">Card Details</DrawerTitle>
          <div className="relative h-full">
            <div className="absolute right-4 top-4 z-50">
              <DrawerClose className="rounded-full bg-white/90 p-2.5 shadow-md hover:bg-white transition-colors flex items-center justify-center">
                <X size={24} className="text-gray-700" />
                <span className="sr-only">Close</span>
              </DrawerClose>
            </div>
            
            <div className="p-6 animate-fade-in overflow-y-auto pb-16" style={{ height: "100%" }}>
              <Envelope label={card.title} backgroundColor={categoryColors[card.category]}>
                <CatalogCard card={card} />
              </Envelope>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
      <DialogContent 
        className="sm:max-w-[600px] p-0 border-2 border-catalog-softBrown rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        style={{ backgroundColor: categoryColors[card.category] }}
      >
        <DialogTitle className="sr-only">Card Details</DialogTitle>
        <div className="relative">
          <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow-md hover:bg-white transition-colors">
            <X size={18} className="text-gray-700" />
            <span className="sr-only">Close</span>
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

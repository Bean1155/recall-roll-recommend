
import { X } from "lucide-react";
import { EntertainmentCard } from "@/lib/types";
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
import { Button } from "@/components/ui/button";

interface EntertainmentDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  card: EntertainmentCard | null;
  categoryColors: Record<string, string>;
}

const EntertainmentDetailDialog = ({
  isOpen,
  onOpenChange,
  card,
  categoryColors,
}: EntertainmentDetailDialogProps) => {
  const isMobile = useIsMobile();
  
  if (!card) return null;
  
  const category = card.entertainmentCategory?.toLowerCase() || 'etc.';
  const backgroundColor = categoryColors[category] || '#d2b48c';
  
  const handleClose = () => {
    onOpenChange(false);
  };
  
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerOverlay className="bg-black/80 backdrop-blur-sm" />
        <DrawerContent 
          className="p-0 border-t-2 border-catalog-softBrown rounded-t-xl overflow-y-auto animate-in slide-in-from-bottom duration-300"
          style={{ 
            backgroundColor,
            height: "85vh", // Set fixed height for mobile
            maxHeight: "85vh" // Cap max height at 85% of viewport
          }}
        >
          <DrawerTitle className="sr-only">Card Details</DrawerTitle>
          <div className="relative h-full">
            <div className="absolute right-4 top-4 z-50">
              <Button 
                onClick={handleClose} 
                className="rounded-full bg-white/90 p-2.5 shadow-md hover:bg-white transition-colors flex items-center justify-center h-10 w-10"
                type="button"
                aria-label="Close"
              >
                <X size={24} className="text-gray-700" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            
            <div className="p-6 animate-fade-in overflow-y-auto pb-16" style={{ height: "100%" }}>
              <Envelope label={card.title} backgroundColor={backgroundColor}>
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
        style={{ backgroundColor }}
      >
        <DialogTitle className="sr-only">Card Details</DialogTitle>
        <div className="relative">
          <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow-md hover:bg-white transition-colors">
            <X size={18} className="text-gray-700" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          <div className="p-6 animate-fade-in">
            <Envelope label={card.title} backgroundColor={backgroundColor}>
              <CatalogCard card={card} />
            </Envelope>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EntertainmentDetailDialog;

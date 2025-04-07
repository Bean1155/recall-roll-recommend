
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerOverlay, DrawerTitle } from "@/components/ui/drawer";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchContainerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose?: () => void;
  children: React.ReactNode;
}

const SearchContainer: React.FC<SearchContainerProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  children
}) => {
  const isMobile = useIsMobile();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      onOpenChange(false);
    }
  }, [onClose, onOpenChange]);

  if (isMobile) {
    return (
      <Drawer
        open={isOpen}
        onOpenChange={onOpenChange}
      >
        <DrawerOverlay className="bg-black/70 backdrop-blur-sm" />
        <DrawerContent className="p-0 border-t-4 border-t-[#d2b48c] border-x border-x-[#d2b48c] border-b border-b-[#d2b48c] bg-[#FAF3E3] rounded-t-xl overflow-visible shadow-lg animate-in slide-in-from-bottom duration-300" style={{ maxHeight: "90vh" }}>
          <DrawerTitle className="sr-only">Search</DrawerTitle>
          <div className="relative overflow-y-auto pb-6">
            {/* Decorative line connecting to the button */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-[#d2b48c] rounded-b-md"></div>
            
            {onClose && (
              <div className="absolute right-4 top-3 z-50">
                <Button 
                  onClick={handleClose} 
                  className="rounded-full bg-white/90 p-2.5 h-10 w-10 shadow-md hover:bg-white flex items-center justify-center"
                  variant="ghost"
                  size="icon"
                  type="button"
                  aria-label="Close"
                >
                  <X size={24} className="text-gray-700" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            )}

            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/70 backdrop-blur-sm" />
      <DialogContent 
        className="p-0 border-0 shadow-none bg-transparent animate-in zoom-in-95 duration-200"
        style={{ maxWidth: "90vw", width: "550px" }}
      >
        <DialogTitle className="sr-only">Search</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default SearchContainer;

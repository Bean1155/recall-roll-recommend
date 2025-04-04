
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LaunchScreenAnimation from "./launch/LaunchScreenAnimation";
import LaunchScreenForm from "./launch/LaunchScreenForm";

interface LaunchScreenProps {
  forcedOpen?: boolean;
  onClose?: () => void;
}

const LaunchScreen: React.FC<LaunchScreenProps> = ({ forcedOpen = false, onClose }) => {
  const [open, setOpen] = useState(true);
  const [stamped, setStamped] = useState(false);
  const [displayText, setDisplayText] = useState("");

  // Reset stamped state when forcedOpen changes
  useEffect(() => {
    if (forcedOpen) {
      setOpen(true);
      setStamped(false);
      setDisplayText("");
    }
  }, [forcedOpen]);

  const handleFormSubmit = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onClose) {
      onClose();
    }
  };

  // Don't render anything if not open and not forcibly opened
  if (!open && !forcedOpen) return null;

  return (
    <Dialog open={open || forcedOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg p-0 border-catalog-softBrown border-2 overflow-hidden bg-catalog-cream rounded-lg">
        <div 
          className="flex flex-col items-center justify-start p-6 relative"
          style={{
            minHeight: '450px'
          }}
        >
          {/* Catalog Card Header Line */}
          <div className="w-full mb-4 border-b border-catalog-softBrown pb-2">
            <div className="catalog-line"></div>
          </div>
          
          <LaunchScreenAnimation 
            open={open}
            forcedOpen={forcedOpen}
            setStamped={setStamped}
            stamped={stamped}
          />
          
          <LaunchScreenForm 
            stamped={stamped}
            onSubmitSuccess={handleFormSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LaunchScreen;

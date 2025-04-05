
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

  // Reset stamped state when forcedOpen changes
  useEffect(() => {
    if (forcedOpen) {
      setOpen(true);
      setStamped(false);
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
      <DialogContent 
        className="sm:max-w-md md:max-w-lg p-0 border-catalog-softBrown border-2 overflow-hidden rounded-lg"
        style={{
          background: "#f5f5dc",
          boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px"
        }}
      >
        <div 
          className="flex flex-col items-center justify-start p-6 relative"
          style={{
            minHeight: '550px'
          }}
        >
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

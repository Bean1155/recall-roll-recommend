
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
      <DialogContent className="sm:max-w-md md:max-w-lg p-0 border-catalog-softBrown border-2 overflow-hidden bg-white">
        <div 
          className="flex flex-col items-center justify-center p-4 relative"
          style={{
            backgroundImage: 'linear-gradient(#F1F0FB 1.1rem, #D2B48C 1.2rem)',
            backgroundSize: '100% 1.2rem',
            backgroundRepeat: 'repeat',
            paddingTop: '1.5rem',
            minHeight: '450px'
          }}
        >
          {/* Red margin line */}
          <div 
            className="absolute left-10 top-0 bottom-0 w-0.5 bg-vintage-red opacity-70"
            aria-hidden="true"
          />
          
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

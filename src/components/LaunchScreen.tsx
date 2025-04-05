
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LaunchScreenAnimation from "./launch/LaunchScreenAnimation";
import LaunchScreenForm from "./launch/LaunchScreenForm";
import LaunchScreenTitle from "./launch/LaunchScreenTitle";

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
          background: "#FFFEF0", // Vintage white color
          boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px"
        }}
      >
        <div 
          className="flex flex-col items-center justify-between p-6 relative"
          style={{
            minHeight: '550px'
          }}
        >
          {/* Add the title component at the top */}
          <LaunchScreenTitle 
            stamped={stamped}
          />
          
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <LaunchScreenForm 
              stamped={stamped}
              onSubmitSuccess={handleFormSubmit}
            />
          </div>
          
          {/* Increase the negative margin to create more overlap */}
          <div className="w-full mt-8" style={{ marginBottom: "-24px" }}>
            <LaunchScreenAnimation 
              open={open}
              forcedOpen={forcedOpen}
              setStamped={setStamped}
              stamped={stamped}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LaunchScreen;
